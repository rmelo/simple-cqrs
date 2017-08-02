'use strict'

const { Command, CommandDispatcher, CommandBus } = require('./core/commands')
const { Event, EventHandler, EventBus, EventDispatcher } = require('./core/events')

const App = class App {
  constructor () {
    this._commandBus = new CommandDispatcher()
    this._eventBus = new EventDispatcher()
  }
  useCommandBus (commandBus) {
    this._commandBus = commandBus
  }
  useEventBus (eventBus) {
    this._eventBus = eventBus
  }
  useEventHandler (handler, events) {
    this._eventBus.register(handler, events)
  }
  useCommandHandler (type, handler) {
    this._commandBus.register(type, handler)
  }
  send (command) {
    return this._commandBus.send(command)
  }
  publish (event) {
    this._eventBus.publish(event)
  }
}

module.exports = {
  createApp: () => {
    return new App()
  },
  App,
  Command,
  CommandDispatcher,
  CommandBus,
  Event,
  EventHandler,
  EventBus,
  EventDispatcher
}
