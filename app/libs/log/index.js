'use strict'

// Load requirements
const winston = require('winston')
const emoji = require('node-emoji')
const emojiRegex = require('emoji-regex')
const path = require('path')
const fs = require('fs')
const os = require('os')

// Add rotation to winston logs
require('winston-daily-rotate-file')

// Get log directory
let logDirectory = path.resolve(path.join(__dirname, '../../../logs'))

// Ensure the directory exists
try { fs.mkdirSync(logDirectory) } /* istanbul ignore next */ catch (e) { }

// Verbose output
const verbose = (process.argv.includes('-v') || process.argv.includes('--verbose'))

// Setup the logger interfaces for console, file and exception handling
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: (verbose ? 'verbose' : 'info'),
      colorize: true
    }),
    new (winston.transports.DailyRotateFile)({
      filename: path.join(logDirectory, 'daily.'),
      datePattern: 'yyyy-MM-dd.log',
      level: 'warn'
    })
  ],
  exceptionHandlers: [
    new (winston.transports.DailyRotateFile)({
      filename: path.join(logDirectory, 'exceptions.'),
      datePattern: 'yyyy-MM-dd.log',
      humanReadableUnhandledException: true
    })
  ]
})

// Add colorize support
logger.filters.push((level, msg, meta) => {
  return require('../utils/methods/format-string')(msg)
})

// Add emoji formatting support
logger.filters.push((level, msg, meta) => {
  // Variables
  let regex = emojiRegex()
  let m

  // Keep string name variants on Windows
  if (os.platform() !== 'win32') {
    // Turn strings into emojis
    msg = emoji.emojify(msg)

    // Ensure spacing is maintained
    while ((m = regex.exec(msg)) !== null) {
      if (m.index === regex.lastIndex) { regex.lastIndex++ }
      msg = msg.replace(m[0], m[0] + ' ')
    }
  }

  // Send back the string
  return msg.trim()
})

// Export for use
module.exports = logger
