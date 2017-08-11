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
    if (typeof handler === 'object') {
      this.setHandlerEvents(handler, events)
    } else if (typeof handler === 'function' && events) {
      events = Object.prototype.toString.call(events).indexOf('Array') > -1 ? events : [events]
      events.forEach((event) => {
        this.setEvent(handler, event)
      })
    } else {
      throw new Error('Handler must be provided as a object or as a function.')
    }

    return this
  }
  setEvent (handler, event) {
    let handlers = this._handlers.get(event) || []
    handlers.push(handler)
    this._handlers.set(event, handlers)
  }

  setHandlerEvents (handler, events) {
    if (events) {
      if (events === '*') {
        this.setEvent(handler, events)
      } else {
        events.forEach(event => this.setEvent(handler, event))
      }
    } else {
      handler.events.forEach((event) => {
        this.setEvent(handler, event)
      })
    }
  }

  publish (event) {
    const type = Object.prototype.toString.apply(event)

    if (type.indexOf('Object') === -1) throw new Error('The event must be an object with type field')
    if (!event.type) throw new Error('The type field must be non-null')

    let handlers = this._handlers.get(event.type) || []
    handlers = handlers.concat(this._handlers.get('*') || [])
    handlers.forEach((handler) => {
      if (typeof handler === 'object') { handler.handle(event) } else { handler(event) }
    }, this)
  }
}
