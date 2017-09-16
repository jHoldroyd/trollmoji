'use strict'

// Load module requirements
const emojis = require('../../emojis')
const users = require('../../users')
const i18n = require('../../locale')
const utils = require('../../utils')
const logger = require('../../log')

// Handle incoming status/profile changes
module.exports = {

  // The events to listen to
  events: [
    'user_change'
  ],

  // The actions and "severity" to respond with
  actions: {
    status: 1 // Level of change, 1 = icon, 2 icon + message
  },

  // Check data for change
  updated: function (id, emoji, status) {
    return emoji !== users.users[id].emoji || status !== users.users[id].status
  },

  // Get incoming hook
  process: function (message, actions) {
    // Variables
    const user = message.user

    // Parse incoming user data
    const emoji = user.profile.status_emoji.replace(/:/g, '')
    const status = user.profile.status_text || ''

    // Was a status change detected
    if (this.updated(user.id, emoji, status)) {
      // DEBUG
      logger.info(i18n.t('bot.triggers.status.changed', users.users[user.id].short_name, ':' + emoji + ':', status))

      // Set the user to ignored
      users.users[user.id].ignore = true

      // Run actions
      Object.keys(this.actions).forEach((method) => {
        actions[method](this.actions[method], user).then((result) => {
          // DEBUG
          logger.info(i18n.t('bot.actions.' + result.type + '.success', result))

          // Send notification
          utils.notify(i18n.t('bot.actions.' + result.type + '.notify', result))

        // Something went wrong
        }).catch((err) => {
          return logger.error(err.message)
        })
      })
    }

    // Nothing to do
    return false
  }
}
