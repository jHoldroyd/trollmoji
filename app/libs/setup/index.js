'use strict'

// Load requirements
const request = require('request')
const path = require('path')
const fs = require('fs')

// Load utilities
const i18n = require('../locale')
const utils = require('../utils')
const logger = require('../log')

// Variables
const rootDir = path.join(__dirname, '../../../')
const dataDir = path.join(rootDir, 'data/')
const envVars = ['SLACK_TOKEN', 'PUSHOVER_USER', 'PUSHOVER_TOKEN']
const emojiURL = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json'

// Setup directories and requirements
module.exports = new Promise((resolve, reject) => {
  // Create a blank .env file
  fs.writeFile(path.join(rootDir, '.env'), envVars.join('=\n') + '=\n', {flag: 'wx'}, (err) => {
    if (err) return reject(err.message)
    logger.info(i18n.t('setup.status.env'))
    return process.kill(0)
  })

  // Create the data directory
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
    logger.info(i18n.t('setup.status.directory'))
  }

  // Create the user blacklist file
  fs.writeFile(path.join(dataDir, 'blacklist.json'), utils.json([]), {flag: 'wx'}, (err) => {
    if (err) return reject(err.message)
    return logger.info(i18n.t('setup.status.blacklist'))
  })

  // Create the invalid emojis file
  fs.writeFile(path.join(dataDir, 'invalid.json'), utils.json([]), {flag: 'wx'}, (err) => {
    if (err) return reject(err.message)
    return logger.info(i18n.t('setup.status.invalid'))
  })

  // Download emoji data
  if (!fs.existsSync(path.join(dataDir, 'emoji.json'))) {
    logger.info(i18n.t('setup.status.emoji_download'))

    // Start download
    return request(emojiURL, (err, response, body) => {
      // Something went wrong
      if (err) return reject(err.message)

      // Didn't resolve
      if (!response.statusCode || response.statusCode.toString().substr(0, 1) !== '2') {
        return reject(new Error(i18n.t('setup.errors.download', response.statusCode)))
      }

      // Create the file
      return fs.writeFile(path.join(dataDir, 'emoji.json'), body, {flag: 'wx'}, (err) => {
        if (err) return reject(err.message)
        logger.info(i18n.t('setup.status.emoji_data'))
        return resolve()
      })
    })
  }

  // No data needed, ready to go
  return resolve()
})
