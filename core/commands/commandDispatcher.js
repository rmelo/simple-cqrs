'use strict'

const CommandBus = require('./commandBus')

module.exports = class CommandDispatcher extends CommandBus {
  constructor () {
    super()
    this._handlers = new Map()
  }
  register (type, handler) {
    if (type.constructor === String) {
      if (this._handlers.get(type)) { throw new Error(`Already exists a handler for ${type}`) }
      this._handlers.set(type, handler)
    } else if (type.constructor === Array) {
      type.forEach(function (t) {
        this.register(t, handler)
      }, this)
    } else {
      throw Error('The type parameter must be string or array.')
    }
  }
  send (command) {
    const handler = this._handlers.get(command.type)
    if (typeof handler === 'object') {
      if (handler.factory) {
        const instance = handler.factory()
        if (instance) { return instance.handle(command) }
        throw new Error('The factory function must exists and returns a handler')
      }
    } else if (typeof handler === 'function') {
      return handler(command)
    } else {
      throw new Error(`There's no handler registered for command ${command.type}`)
    }
  }
}
