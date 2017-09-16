'use strict'

// Load config
require('dotenv').config()

// Load requirements
const logger = require('./libs/log')
const i18n = require('./libs/locale')

// Create directories and ensure we have required data
require('./libs/setup').then(() => {
  logger.info(i18n.t('general.status.setup'))

  // Load the available emojis
  return require('./libs/emojis').load()
}).then((emojis) => {
  logger.info(i18n.t('general.status.emojis', emojis.length))

  // Load the teams users
  return require('./libs/users').load()
}).then((users) => {
  logger.info(i18n.t('general.status.users', Object.keys(users).length))

  // Bind our bot watchers
  return require('./libs/bot').bind()
}).then((steve) => {
  // Have Steve start listening for triggers
  steve.listen({token: process.env.SLACK_TOKEN})

  // Ready and waiting
  logger.info(i18n.t('general.status.watching'))

// Clean up behind ourselves
}).catch((err) => {
  logger.error(err.message)
  process.exit(1)
})
