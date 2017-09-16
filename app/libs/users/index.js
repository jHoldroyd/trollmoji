'use strict'

// Load requirements
const slack = require('slack')
const path = require('path')

// Load utilities
const i18n = require('../locale')
const logger = require('../log')

// Data directory
const dataDir = path.join(__dirname, '../../../data/')

// User tracking and handling
module.exports = {

  // User flags to avoid, edit these depending on your privileges
  flags: [
    // 'is_admin',
    // 'is_owner',
    // 'is_primary_owner',
    // 'is_restricted',
    'is_ultra_restricted',
    'is_bot'
  ],

  // Load the user blacklist
  blacklist: require(path.join(dataDir, 'blacklist')),

  // Contains the list of tracked users
  users: {},

  // Check if id or username is on the blacklist
  blacklisted: function (user) {
    return this.blacklist.some((handle) => {
      return handle === user.id || handle === user.name
    })
  },

  // Check if a user is restricted
  restricted: function (user) {
    return this.flags.some((flag) => {
      return user[flag] === true
    })
  },

  // Add a user to the track list
  add: function (user, ignore) {
    // DEBUG
    logger.verbose(i18n.t('users.add.added'), user.name)

    // Add to object for tracking
    this.users[user.id] = {
      id: user.id,
      name: user.name,
      real_name: user.real_name,
      short_name: (user.real_name || '').split(' ')[0],
      emoji: (user.profile.status_emoji || '').replace(/:/g, ''),
      text: user.profile.status_text || '',
      ignore: ignore || false
    }
  },

  // Load the available users
  load: function () {
    return new Promise((resolve, reject) => {
      // Get the list from the slack API
      slack.users.list({token: process.env.SLACK_TOKEN}, (err, data) => {
        // Check for errors
        if (err !== null) {
          return reject(new Error(i18n.t('users.load.errors.slack', err.message)))
        }

        // Check for a response
        if (data.ok !== true) {
          return reject(new Error(i18n.t('users.load.errors.invalid')))
        }

        // Loop members and add them to ze list
        data.members.forEach((user) => {
          if (!this.restricted(user)) this.add(user)
        })

        // resolve the promise with data
        return resolve(this.users)
      })
    })
  }
}
