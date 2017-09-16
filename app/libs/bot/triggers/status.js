'use strict'

// Load requirements
const path = require('path')

// Load module requirements
const users = require('../../users')
const i18n = require('../../locale')
const utils = require('../../utils')
const logger = require('../../log')

// Define data direcotry
const dataDir = path.join(__dirname, '../../../../data/')

// Handle incoming status/profile changes
module.exports = {

  // The events to listen to
  events: [
    'user_change'
  ],

  // Load the actions from config
  actions: require(path.join(dataDir, 'actions')).status,

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
      this.actions.forEach((action) => {
        require(path.join('../actions/', action.method))(action, user).then((result) => {
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
