'use strict'

// Load requirements
const slack = require('slack')
const words = require('words')

// Load module requirements
const emojis = require('../../emojis')
const users = require('../../users')
const logger = require('../../log')
const i18n = require('../../locale')

// Updates a users status icon and message
function changeStatus (severity, user, emoji, status) {
  return new Promise((resolve, reject) => {
    // Build the response object
    let response = {
      name: user.short_name,
      type: 'status',
      before: {
        emoji: emoji,
        status: status
      },
      after: {
        emoji: (severity >= 1 ? emojis.random() : emoji),                     // Random emoji we're going to use
        status: (severity >= 2 ? words({min: 2, max: 5, join: ' '}) : status) // Random phrase that will become their status
      }
    }

    // Run the profile update
    slack.users.profile.set({
      token: process.env.SLACK_TOKEN,
      user: user.id,
      profile: {
        status_emoji: ':' + response.after.emoji + ':',
        status_text: response.after.status
      }
    }, (err, data) => {
      // Handle any errors
      if (err !== null) {
        // Check for an invalid emoji
        if (/profile_status_set_failed_not_valid_emoji/ig.test(err.message)) {
          // Stop it being used again
          emojis.invalidate(response.after.emoji)

          // DEBUG
          logger.info(i18n.t('bot.actions.status.try_again', user.short_name))

          // Try again
          return changeStatus(severity, user, emoji, status).then((result) => {
            return resolve(result)
          }).catch((err) => {
            return reject(err)
          })
        }

        // Otherwise reject with the error
        return reject(err)
      }

      // Update the user tracking
      users.users[user.id].emoji = response.after.emoji
      users.users[user.id].text = response.after.status

      // Seems okay, resolve it
      return resolve(response)
    })
  })
}

// Export for use
module.exports = changeStatus
