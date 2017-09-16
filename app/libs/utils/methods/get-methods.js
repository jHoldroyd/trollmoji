'use strict'

// List available class methods
module.exports = function (obj, ignore, type) {
  // Normalize ignore
  ignore = (Array.isArray(ignore) ? ignore : (ignore || []))

  // Normalize type
  type = type || 'function'

  // No input given
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return []
  }

  // Traverse properties and build an array of functions not ignored
  return Object.getOwnPropertyNames(obj).filter((property) => {
    /* eslint valid-typeof: "off" */
    return (typeof obj[property] === type && !ignore.includes(property))
  })
}
