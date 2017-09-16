'use strict'

// Load requirements
const path = require('path')

// Load module requirements
const users = require('../../users')
const i18n = require('../../locale')
const logger = require('../../log')
const utils = require('../../utils')

// Define data direcotry
const dataDir = path.join(__dirname, '../../../../data/')

// Handle incoming status/profile changes
module.exports = {

  // The events to listen to
  events: [
    'reaction_added'
  ],

  // Load the actions from config
  actions: require(path.join(dataDir, 'actions')).reaction,

  // Get incoming hook
  process: function (message) {
    // Variables
    const user = users.users[message.user]
    const target = users.users[message.item_user]

    // DEBUG
    logger.info(i18n.t('bot.triggers.reaction.added', user.short_name, ':' + message.reaction + ':', target.short_name))

    // Update the user and target reaction count
    user.reactions = !user.reactions ? 1 : (user.reactions + 1)

    // Run actions
    this.actions.forEach((action) => {
      // Check for minimum value
      if (user.reactions < action.trigger) { 
        return logger.verbose(i18n.t('bot.triggers.reaction.count', user.short_name, action.method, user.reactions, action.trigger))
      }

      // Run the action
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
}
