'use strict'

// Load module requirements
const users = require('../../users')
const i18n = require('../../locale')
const logger = require('../../log')
const utils = require('../../utils')

// Handle incoming status/profile changes
module.exports = {

  // The events to listen to
  events: [
    'reaction_added'
  ],

  // The actions and how many reactions required to trigger them
  actions: {
    nickname: 50
  },

  // Get incoming hook
  process: function (message, actions) {
    // Variables
    const user = users.users[message.user]
    const target = users.users[message.item_user]

    // DEBUG
    logger.info(i18n.t('bot.triggers.reaction.added', user.short_name, ':' + message.reaction + ':', target.short_name))

    // Update the user and target reaction count
    user.reactions = !user.reactions ? 1 : (user.reactions + 1)

    // Run actions
    Object.keys(this.actions).forEach((method) => {
      // Check for minimum value
      if (user.reactions < this.actions[method]) {
        return logger.verbose(i18n.t('bot.triggers.reaction.count', user.short_name, method, user.reactions, this.actions[method]))
      }

      // Run the action
      actions[method](user).then((result) => {
        // DEBUG
        logger.info(i18n.t('bot.actions.' + result.type + '.success', result.name, result.nickname))

        // Reset reaction counter
        user.reactions = 0

        // Send notification
        utils.notify(i18n.t('bot.actions.' + result.type + '.notify', result.name, result.nickname))

      // Something went wrong
      }).catch((err) => {
        return logger.error(err.message)
      })
    })
  }
}
