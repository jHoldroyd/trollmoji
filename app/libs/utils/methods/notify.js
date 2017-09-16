'use strict'

// Load requirements
const emoji = require('node-emoji')

// Create a pushover instance
const pushover = new (require('pushover-notifications'))({
  user: process.env.PUSHOVER_USER,
  token: process.env.PUSHOVER_TOKEN
})

// Load utilities
const i18n = require('../../locale')
const logger = require('../../log')

// Get package data
const pkg = require('../../../../package')

// Send notification to mobile device
module.exports = function (msg) {
  // DEBUG
  logger.verbose(i18n.t('utils.methods.notify.send', msg))

  // Send the message
  return pushover.send({
    message: emoji.emojify(msg),
    title: pkg.name,
    sound: 'magic',
    priority: 1
  }, (err, result) => {
    if (err !== undefined && result && !result.status) {
      return logger.error(i18n.t('utils.methods.notify.error', msg))
    }
  })
}
