'use strict'

const EventBus = require('./eventBus')

module.exports = class EventDispatcher extends EventBus {
  constructor () {
    super()
    this._handlers = new Map()
  }

  get handlers () { return this._handlers }

  /**
  * 
  * @param {*} handler 
  * @param {*} events 
*/
  register (handler, events) {
    const setEvent = (handler, event) => {
      let handlers = this._handlers.get(event) || []
      handlers.push(handler)
      this._handlers.set(event, handlers)
    }

    if (typeof handler === 'object') {
      handler.events.forEach((event) => {
        setEvent(handler, event)
      })
    } else if (typeof handler === 'function' && events) {
      events = Object.prototype.toString.call(events).indexOf('Array') > -1 ? events : [events]
      events.forEach((event) => {
        setEvent(handler, event)
      })
    } else {
      throw new Error('Handler must be provided as a object or as a function.')
    }

    return this
  }

  publish (event) {
    let handlers = this._handlers.get(event.type) || []
    handlers.forEach((handler) => {
      if (typeof handler === 'object') { handler.handle(event) } else { handler(event) }
    }, this)
  }
}
