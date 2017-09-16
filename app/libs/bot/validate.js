'use strict'

// Load module requirements
const users = require('../users')
const i18n = require('../locale')
const logger = require('../log')

// Validation of incoming events
module.exports = {

  // Handle checks for users being ignored or blacklisted
  user: function (message, event) {
    // Variables
    const user = message.user
    const name = user.real_name.split(' ')[0]

    // Check for blacklisted user
    if (users.blacklisted(user)) {
      logger.warn(i18n.t('bot.triggers.' + event + '.blacklisted', name))
      return false
    }

    // Check for restricted user
    if (users.restricted(user)) {
      logger.warn(i18n.t('bot.triggers.' + event + '.restricted', name))
      return false
    }

    // Not in the system, let them off for now
    if (!users.users[user.id]) {
      users.add(user, true)
      return false
    }

    // Ignored, we'll get you next time
    if (users.users[user.id].ignore === true) {
      // Hold off for a second, multiple events may be triggered
      setTimeout(() => { users.users[user.id].ignore = false }, 1000)
      return false
    }

    // Proceed
    return true
  },

  // Handle checks for reactions
  reaction: function (message, event) {
    // Check for user
    if (!users.users[message.user]) {
      logger.warn(i18n.t('bot.triggers.' + event + '.no_user', message.user))
      return false
    }

    // Get user data
    const user = users.users[message.user]
    const name = user.real_name.split(' ')[0]

    // Check for blacklisted user
    if (users.blacklisted(user)) {
      logger.warn(i18n.t('bot.triggers.' + event + '.blacklisted', name))
      return false
    }

    // Proceed
    return true
  }

}
