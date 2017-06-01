'use strict'

const Command = require('../../commands/command')

module.exports = class showMessageCommand extends Command {
	get message() { return this._message }
	set message(value) { this._message = value }
}