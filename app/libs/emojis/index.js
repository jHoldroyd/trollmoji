'use strict'

// Load requirements
const emoji = require('node-emoji')
const slack = require('slack')
const path = require('path')
const fs = require('fs')
const os = require('os')

// Load utilities
const i18n = require('../locale')
const utils = require('../utils')
const logger = require('../log')

// Data directory
const dataDir = path.join(__dirname, '../../../data/')

// Emoji data handler
module.exports = {

  // Define the emoji categories to load
  categories: ['People', 'Objects', 'Nature', 'Foods', 'Activity', 'Custom'],

  // Load the invalid emoji list
  invalid: require(path.join(dataDir, 'invalid')),

  // Contains the list of loaded emojis
  emojis: [],

  // Returns a random emoji from the available list
  random: function () {
    return utils.getRandom(this.emojis)
  },

  // Returns a formatted emoji for the given platform
  format: function (name, force) {
    if (name.length <= 0) { return '<blank>' }
    if (os.platform() === 'win32' && !force) { return ':' + name + ':' }
    return emoji.get(name)
  },

  // Write invalid emojis to file
  invalidate: function (name) {
    // Variables
    let index = this.emojis.indexOf(name)

    // DEBUG
    logger.info(i18n.t('emojis.invalidate.added', this.format(name)))

    // Remove from emoji list
    if (index > -1) this.emojis.splice(index, 1)

    // Add to invalid list and write file
    this.invalid.push(name)
    return fs.writeFileSync(path.join(dataDir, 'invalid.json'), utils.json(this.invalid))
  },

  // Builds a list of the available emojis
  load: function () {
    return new Promise((resolve, reject) => {
      // Build a list of the standard emoji set based on our preferences
      require(path.join(dataDir, 'emoji')).forEach((e) => {
        if (!this.categories || this.categories.includes(e.category)) {
          e.short_names.forEach((name) => {
            if (this.invalid.includes(name)) { return }
            return this.emojis.push(name)
          })
        }
      })

      // Get the slack channel custom emojis
      if (!this.categories || this.categories.includes('Custom')) {
        slack.emoji.list({token: process.env.SLACK_TOKEN}, (err, data) => {
          // Check for errors
          if (err !== null) {
            return reject(new Error(i18n.t('emojis.load.errors.slack', err.message)))
          }

          // Check for a response
          if (data.ok !== true) {
            return reject(new Error(i18n.t('emojis.load.errors.invalid')))
          }

          // Get an array of emoji data
          let emojis = Array.isArray(data.emoji)
                         ? data.emoji
                         : Object.keys(data.emoji)

          // Loop and assign
          emojis.forEach((name) => { this.emojis.push(name) })

          // Resolve with data
          return resolve(this.emojis)
        })
      }
    })
  }
}
