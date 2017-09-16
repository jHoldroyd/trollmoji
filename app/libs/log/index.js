'use strict'

// Load requirements
const winston = require('winston')
const emoji = require('node-emoji')
const path = require('path')
const fs = require('fs')

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
  msg = emoji.emojify(msg)
  return msg.replace(/([\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2700-\u27BF][\uFE0E-\uFE0F]?)/g, '$1 ')
})

// Export for use
module.exports = logger
