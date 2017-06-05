/* global describe it*/
'use strict'

const
	chai = require('chai'),
	sinon = require('sinon'),
	{ EventHandler, CommandDispatcher, EventDispatcher, CommandFactory } = require('./index.js')

chai.should()
chai.use(require('sinon-chai'))

const app = require('./index.js').createApp()

chai.should()

describe('App tests', () => {

	const handler = { handle: () => { } }
	const spyHandler = sinon.spy(handler, 'handle')

	it('Should register a command handler', (done) => {
		app.useCommandHandler('createTrackingCommand', handler.handle)
		done()
	})

	it('Should send a command and handle it', (done) => {
		app.send({ type: 'createTrackingCommand' })
		spyHandler.should.been.calledOnce
		done()
	})

	const eventHandler = new class MyEventHandler extends EventHandler {
		constructor() {
			super()
			this.register('myEvent', handler)
		}
		handle() { }
	}
	const spyEventHandler = sinon.spy(eventHandler, 'handle')

	it('Should register an event handler', (done) => {
		app.useEventHandler(eventHandler)
		done()
	})

	it('Should send an event and handle it', (done) => {
		app.publish({ type: 'myEvent' })
		spyEventHandler.should.been.calledOnce
		done()
	})

	it('Should change the command bus', (done) => {
		app.useCommandBus(new CommandDispatcher(new CommandFactory()))
		done()
	})

	it('Should change the event bus', (done) => {
		app.useEventBus(new EventDispatcher())
		done()
	})

})

