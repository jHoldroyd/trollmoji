# trollmoji [![NPM version](https://badge.fury.io/js/trollmoji.svg)](https://npmjs.org/package/trollmoji)

👻 Slack bot designed to mess with your team in a fun, random and **non-malicious** way

## What?
**trollmoji** is a cli-based tool with the ability to change things like status emojis and messages, give them a new nickname or anything else you dream up by creating your own `trigger` or `action` - more on those later.

## Why?
Because.

## Prerequisites
Before getting started you will need to have [nodejs](https://nodejs.org/en/) *(>=6)* & [npm](https://github.com/npm/npm). You will also need to get a [Slack API](https://api.slack.com/custom-integrations/legacy-tokens) key for your team. If you'd like to recieve notifications detailing your teams despair then you'll need to add your [Pushover](https://pushover.net) keys.

> **Why a legacy token?** These allow you to interact with the Slack Realtime API without adding a bot user.

## Installation

```sh
$ npm i -g trollmoji
```

> **Note:** On first run a .env file, data directory and config files will be created, as well as downloading the required emoji data and then closing. Please add your Slack/Pushover keys to the .env file before running again.

## Usage
**trolmoji** is a fire-and-forget tool designed to sit and quietly do its thing, and as such once configured and run there isn't any further input from the user; *other than turning it off when your team have had enough of course.*

```sh
$ trollmoji
```

Once run, the tool will run *setup*, *download available emojis*, and *get team users* before moving on to waiting for incoming events from Slack.

> **Note:** You can add either a `-v` or `--verbose` flag to the command to get more detailed information.

## Configuration
There are two configuration files located in the `data` directory in the root of this project - `actions.json` and `blacklist.json`.

### actions.json
Actions allows you to setup which `triggers` and `actions` are bound, the actions they trigger, and the run conditions for them. Check the [default configuration](https://github.com/jHoldroyd/trollmoji/blob/master/data/actions.json) for an idea of how to configure or add new methods.

#### Available options

* **Triggers**
  * *Reaction* - user has added X number *(default: 50)* of reactions to messages
  * *Status* - user has updated their status icon or message
* **Actions**:
  * *Nickname* - Gives the user a new nickname, example: *Jon "knows nothing" Snow*
  * *Status* - Updates the users status emoji and/or message

### blacklist.json
Blacklist contains a list of the user `ids` or `names` that you would like to not run this list against; *some poeple may not want to mess with bots or their boss.* Any time a trigger is about to be run the incoming data is validated and one of the checks will be to ensure the user is not `restricted` or on the `blacklist`.

``` json
[
  "jholdroyd",
  "U32N242K3"
]
```

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
