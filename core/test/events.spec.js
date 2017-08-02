/* eslint-disable no-unused-expressions, space-before-function-paren */
'use strict'

const
  chai = require('chai'),
  sinon = require('sinon')

chai.should()
chai.use(require('sinon-chai'))

const { Event, EventBus, EventHandler, EventDispatcher } = require('../events')
const MessageDisplayedEvent = require('./events/messageDisplayedEvent')

describe('Events tests', () => {
  describe('Event tests', () => {
    it('Should throw TypeError exception when try to create an abstract Event', (done) => {
      (() => {
        const event = new Event()
        event.toString()
        done()
      }).should.throw(TypeError)
      done()
    })

    it('Should create a json-based event and change it properties', (done) => {
      const event = new MessageDisplayedEvent()

      const creationDate = event

      event.version.should.eq(0)
      event.type.should.be.eq('MessageDisplayedEvent')

      event.message = 'hello!'
      event.type = 'messageDisplayedEvent'
      event.date = new Date()
      event.version = 1

      event.version.should.eq(1)
      event.type.should.be.eq('messageDisplayedEvent')
      event.date.should.not.be.eq(creationDate)

      done()
    })
  })

  describe('EventHandler tests', () => {
    const wrongHandler = new class WrongEventHandler extends EventHandler { }()

    it('Should throw an Error when register null event', (done) => {
      (() => {
        wrongHandler.register('', () => { })
      }).should.throw(Error, 'Event must be non-null')
      done()
    })

    it('Should throw an Error when register null function', (done) => {
      (() => {
        wrongHandler.register('event', null)
      }).should.throw(Error, 'Func must be a non-null function')
      done()
    })

    it('Should register some events, get events and dispatche then', (done) => {
      let result = false
      const messageHandler = new class MessageEventHandler extends EventHandler {
        constructor() {
          super()
          this.register('messageDisplayedEvent', (event) => {
            result = true
          })
        }
      }()
      messageHandler.handle({ type: 'messageDisplayedEvent', message: 'hello!' })
      result.should.be.true
      messageHandler.events.should.lengthOf(1)
      messageHandler.events.should.contains('messageDisplayedEvent')
      done()
    })
  })

  describe('EventBus tests', () => {
    it('Should throw TypeError exception when try to create an abstract EventBus', (done) => {
      (() => {
        const bus = new EventBus()
        bus
      }).should.throw(TypeError, 'EventBus is abstract!')
      done()
    })

    it('Should create an specialized EventBus', (done) => {
      const bus = new class SpecializedEventBus extends EventBus { }()
      bus.publish({})
      done()
    })
  })

  describe('EventDispatcher tests', () => {
    const dispatcher = new EventDispatcher()
    const handler1 = new class Handler extends EventHandler {
      constructor() {
        super()
        this.register('messageDisplayedEvent', (event) => {
          event
        })
      }
    }()

    const handler2 = new class Handler extends EventHandler {
      constructor() {
        super()
        this.register('messageDisplayedEvent', (event) => {
          event
        })
      }
    }()

    const handler3 = new class Handler extends EventHandler {
      constructor() {
        super()
        this.register('messageDisplayedEvent', (event) => {
          event
        })
        this.register('messageClearedEvent', (event) => {
          event
        })
      }
    }()

    const spyFunc1 = sinon.spy()
    const spyFunc2 = sinon.spy()

    it('Should not publish an event', (done) => {
      dispatcher.publish({ type: 'inexistentEvent' })
      done()
    })

    it('Should register an first event handler', (done) => {
      dispatcher.register(handler1)
      dispatcher.handlers.size.should.eq(1)
      dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(1)
      done()
    })

    it('Should register an second event handler', (done) => {
      dispatcher.register(handler2)
      dispatcher.handlers.size.should.eq(1)
      dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(2)
      done()
    })

    it('Should register the third event handler with multiple functions', (done) => {
      dispatcher.register(handler3)
      dispatcher.handlers.size.should.eq(2)
      dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(3)
      done()
    })

    it('Should register a handler as a function with one event', (done) => {
      dispatcher.register((event) => {
        spyFunc1(event)
      }, 'messageDisplayedEvent')
      dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(4)
      done()
    })

    it('Should register a handler as a function with multiple events', (done) => {
      dispatcher.register((event) => {
        spyFunc2(event)
      }, ['messageDisplayedEvent', 'messageClearedEvent'])
      done()
    })

    it('Should register a handler as a string and do nothing', (done) => {
      (() => {
        dispatcher.register('handler', 'messageDisplayedEvent1')
      }).should.throw(Error)
      done()
    })

    it('Should register publish a event', (done) => {
      const spyHandler1 = sinon.spy(handler1, 'handle')
      const spyHandler2 = sinon.spy(handler2, 'handle')
      const spyHandler3 = sinon.spy(handler3, 'handle')

      dispatcher.publish({ type: 'messageDisplayedEvent' })
      dispatcher.publish({ type: 'messageClearedEvent' })

      spyHandler1.should.been.calledOnce
      spyHandler2.should.been.calledOnce
      spyHandler3.should.been.calledTwice
      spyFunc1.should.been.calledOnce
      spyFunc2.should.been.calledTwice

      done()
    })
  })
})
