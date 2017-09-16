# trollmoji [![NPM version](https://badge.fury.io/js/trollmoji.svg)](https://npmjs.org/package/trollmoji) [![Build Status](https://travis-ci.org/jHoldroyd/trollmoji.svg?branch=master)](https://travis-ci.org/jHoldroyd/trollmoji)

👻 Slack bot for having some fun with your team

## Prerequisites
Before getting started you will need to have [nodejs](https://nodejs.org/en/) version 6 or greater. You will also need to get a Slack API token from [here](https://api.slack.com/custom-integrations/legacy-tokens). If you'd like to recieve push notifications detailing your teams despair then you'll need an account with [Pushover](https://pushover.net).

> **Why a legacy token?** Because it allows you to interact with the Slack Real-time API without adding a bot user!

## Installation

```sh
$ npm i -g trollmoji
```

> **Note:** On first run a .env file, data directory and config files will be created, as well as downloading the required emoji data and then closing. Please add your Slack/Pushover keys to the .env file before running again.

## Usage

```sh
$ trollmoji
```

After running the command the tool will run setup, download the available emojis, and team users before moving on to waiting for incoming events from Slack.

```sh
$ info: Setup complete, starting
$ info: Loaded 955 emojis
$ info: Found 30 users
$ info: Ready & waiting for event triggers
```

> **Note:** trollmoji is a fire and forget tool with few configuration options, however you can use `-v` or `--verbose` to get a more detailed output from the CLI tool

## Built With

* [Grunt](https://github.com/gruntjs/grunt) - Task runner
* [Slack](https://github.com/smallwins/slack) - Third-party Slack client
* [Chalk](https://github.com/chalk/chalk) - Terminal output formatting
* [Winston](https://github.com/winstonjs/winston) - Logging
* [Node Emoji](https://github.com/omnidan/node-emoji) - Nodejs emoji support


## Contributing

Please read [CONTRIBUTING.md](https://github.com/jHoldroyd/trollmoji/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jHoldroyd/trollmoji/tags).


## Authors

* **Jamie Holdroyd** - [Moltin](https://moltin.com)

See also the list of [contributors](https://github.com/jHoldroyd/trollmoji/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
