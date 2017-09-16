'use strict'

// Load requirements
const slack = require('slack')

// Load module requirements
const i18n = require('../locale')
const logger = require('../log')

// Handle the interactions with slack
module.exports = {

  // Hold the bot instance, I think we'll call him Steve
  steve: slack.rtm.client(),

  // Bind the triggers to watch on
  bind: function () {
    return new Promise((resolve, reject) => {
      // Run through the available triggers
      Object.keys(this.triggers).forEach((name) => {
        // Register the triggers with Steve
        this.triggers[name].events.forEach((event) => {
          // DEBUG
          logger.verbose(i18n.t('bot.index.bind.event'), event, name)

          // Bind the callback
          this.steve[event]((message) => {
            // Variables
            let group = message.type.split('_')[0]

            // DEBUG
            logger.verbose(i18n.t('bot.index.bind.recieved', message.type))

            // Run validation checks for message group
            if (this.validate[group] && !this.validate[group](message, event)) {
              logger.verbose(i18n.t('bot.index.bind.skip', message.type))
              return false
            }

            // Process message and run applicable actions
            logger.verbose(i18n.t('bot.index.bind.process', message.type, name))
            return this.triggers[name].process(message, this.actions)
          })
        })
      })

      // Resolve with steve
      return resolve(this.steve)
    })
  },

  // Validation of event types
  validate: require('./validate'),

  // Actions to watch for
  triggers: {
    // Status updated in profile
    status: require('./triggers/status'),

    // Reaction added
    reaction: require('./triggers/reaction')
  },

  // Actions that can be used on triggers
  actions: {
    // Updates a users status to a random emoji
    status: require('./actions/status'),

    // Give the user a sweet nickname
    nickname: require('./actions/nickname')
  }

}
