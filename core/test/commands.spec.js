/* eslint-disable no-unused-expressions, no-unused-vars, space-before-function-paren */
'use strict'

const chai = require('chai')
const { Command, CommandDispatcher, CommandBus } = require('../commands')

chai.should()

describe('Commands tests', () => {
  const showMessageCommandType = 'showMessageCommand'

  describe('Command tests', () => {
    it('Should throw TypeError exception when try to create an abstract Command', (done) => {
      (() => {
        const command = new Command()
        command
      }).should.throw(TypeError)
      done()
    })

    it('Should create an SayHelloCommand and set type.', (done) => {
      const SayHelloCommand = class SayHelloCommand extends Command { }
      const command = new SayHelloCommand()
      command.should.have.property('_type')
      command.type.should.equal('SayHelloCommand')
      done()
    })
  })

  describe('CommandDispatcher tests', () => {
    const dispatcher = new CommandDispatcher()

    it('Should register a command using factory', (done) => {
      dispatcher.register(showMessageCommandType, {
        factory: () =>
          new class showMessageCommandHandler { handle (command) { command } }()
      })
      done()
    })

    it('Should register a command using function', (done) => {
      dispatcher.register('funcCommand', (command) => { return command })
      done()
    })

    it('Should throw an error when try to register a duplicated command', (done) => {
      (() => { dispatcher.register(showMessageCommandType, () => { }) })
        .should.throw(Error, 'Already exists a handler for showMessageCommand')
      done()
    })

    it('Should execute showMessageCommand', (done) => {
      dispatcher.send({ type: showMessageCommandType, message: 'hello!' })
      done()
    })

    it('Should execute command using function', (done) => {
      dispatcher.send({ type: 'funcCommand' })
      done()
    })

    it('Should throw an error when try to execute an command without handler', (done) => {
      (() => { dispatcher.send({ type: 'withoutHandlerCommand' }) })
        .should.throw(Error, 'There\'s no handler registered for command withoutHandlerCommand')
      done()
    })

    it('Should register multiple commands and execute them', (done) => {
      dispatcher.register(['firstCommand', 'secondCommand'], (command) => { return command })
      dispatcher.send({ type: 'firstCommand' })
      dispatcher.send({ type: 'secondCommand' })
      done()
    })

    it('Should throw an Error when try to register an object', (done) => {
      (() => {
        dispatcher.register({}, (command) => { return command })
      }).should.throw(Error, 'The type parameter must be string or array.')
      done()
    })

    it('Should throw an Error when try to dispatch an object without factory property', (done) => {
      (() => {
        dispatcher.register({}, (command) => { return command })
      }).should.throw(Error, 'The type parameter must be string or array.')
      done()
    })

    it('Should throw an Error when try to dispatch a command without a factory function returns a handler', (done) => {
      dispatcher.register('withoutReturnAHandler', {
        factory: () => { const handler = new class showMessageCommandHandler { handle (command) { command } }() }
      })

      dispatcher.register('withoutFactoryHandler', {})

      let func = (() => { dispatcher.send({ type: 'withoutReturnAHandler' }) }).should.throw(Error)
      let func2 = () => { dispatcher.send({ type: 'withoutFactoryHandler' }) }
      func2()
      func

      done()
    })
  })

  describe('CommandBus tests', () => {
    it('Should throw TypeError exception when try to create an abstract CommandBus', (done) => {
      (() => {
        const bus = new CommandBus()
        bus
      }).should.throw(TypeError, 'CommandBus is abstract!')
      done()
    })

    it('Should create an specialized CommandBus', (done) => {
      const bus = new class SpecializedCommandBus extends CommandBus { }()
      bus.send({})
      done()
    })
  })
})
