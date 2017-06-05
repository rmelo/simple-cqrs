'use strict'

const { Command, CommandFactory, CommandDispatcher, CommandBus } = require('./core/commands')
const { Event, EventFactory, EventHandler, EventBus, EventDispatcher } = require('./core/events')

module.exports = {
	createApp: () => {
		return new App()
	},
	Command,
	CommandFactory,
	CommandDispatcher,
	CommandBus,
	Event,
	EventFactory,
	EventHandler,
	EventBus,
	EventDispatcher
}

class App {
	constructor() {
		this._commandBus = new CommandDispatcher(new CommandFactory())
		this._eventBus = new EventDispatcher()
	}
	useCommandBus(commandBus) {
		this._commandBus = commandBus
	}
	useEventBus(eventBus) {
		this._eventBus = eventBus
	}
	useEventHandler(handler) {
		this._eventBus.register(handler)
	}
	useCommandHandler(type, handler) {
		this._commandBus.register(type, handler)
	}
	send(command) {
		this._commandBus.send(command)
	}
	publish(event) {
		this._eventBus.publish(event)
	}
}
