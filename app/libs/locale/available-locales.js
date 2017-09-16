'use strict'

// Load our requirements
const glob = require('glob')
const path = require('path')

// Build a list of the available locale files in a given directory
module.exports = function (dir) {
  // Variables
  let available = ['en']

  // Run through the installed locales and add to array to be loaded
  glob.sync(path.join(dir, '/*.json')).forEach((file) => {
    // Get the shortname for the file
    let lang = path.basename(file, '.json')

    // Ignore english
    if (lang !== 'en') { available.push(lang) }
  })

  return available
}
