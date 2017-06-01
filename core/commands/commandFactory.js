'use strict'

const MessageFactory = require('../messageFactory')

module.exports = class CommandFactory extends MessageFactory {
	constructor(commandsPath = './commands/') {
		super(commandsPath)
	}
}