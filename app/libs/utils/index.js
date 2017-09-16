'use strict'

module.exports = {

  // Format a string for terminal ouptut
  formatString: require('./methods/format-string'),

  // JSON pretty print
  json: require('./methods/json'),

  // Send notification via pushover
  notify: require('./methods/notify'),

  // Gets a random array item
  getRandom: require('./methods/get-random'),

  // List available class methods
  getMethods: require('./methods/get-methods')
}
