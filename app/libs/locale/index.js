'use strict'

// Load our requirements
const i18n = require('i18n')
const path = require('path')

// Variables
let localesDir = path.resolve(path.join(__dirname, '../../../locales'))

// Configure the localization engine
i18n.configure({
  locales: require('./available-locales')(localesDir),
  defaultLocale: 'en',
  objectNotation: true,
  directory: localesDir,
  autoReload: true,
  syncFiles: true,
  register: i18n,
  api: {
    '__': 't',
    '__n': 'tn'
  }
})

// Export for future use
module.exports = i18n
