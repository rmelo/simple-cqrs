'use strict'

module.exports = class CommandBus {
	constructor() {
		if (this.constructor.name == 'CommandBus')
			throw new TypeError('CommandBus is abstract!')
	}
	send(command) { command }
}