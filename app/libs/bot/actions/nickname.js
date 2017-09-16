'use strict'

// Load requirements
const slack = require('slack')

// Load module requirements
const users = require('../../users')

// Create nickname generator
const Moniker = require('moniker')
const names = Moniker.generator([Moniker.adjective, Moniker.noun], {glue: ' '})

// Name regex pattern
const regex = /^(.+?) (?:"([a-z- ]+)" )?(.+?)$/i

// Gives the user a new nickname
module.exports = function (user) {
  return new Promise((resolve, reject) => {
    // Variables
    let lastName = user.real_name.replace(regex, '$2')
    let nickname = names.choose()
    let response = {
      name: user.short_name,
      type: 'nickname',
      full_name: user.short_name + ' "' + nickname + '" ' + lastName,
      nickname: nickname
    }

    // Run the profile update
    slack.users.profile.set({
      token: process.env.SLACK_TOKEN,
      user: user.id,
      profile: {
        first_name: user.short_name + ' "' + nickname + '"'
      }
    }, (err, data) => {
      // Handle any errors
      if (err !== null) { return reject(err) }

      // Update user tracking
      users.users[user.id].real_name = data.profile.real_name

      // Seems okay, resolve it
      return resolve(response)
    })
  })
}
