'use strict';

const chai = require('chai');
const { Command, CommandFactory, CommandDispatcher, showMessageCommand, CommandBus } = require('../commands');

chai.should();

describe('Commands tests', () => {

    const showMessageCommandType = 'showMessageCommand';

    describe('Command tests', () => {

        it('Should throw TypeError exception when try to create an abstract Command', (done) => {
            (() => {
                const command = new Command();
            }).should.throw(TypeError);
            done();
        });

        it('Should create an SayHelloCommand and set type.', (done) => {
            const SayHelloCommand = class SayHelloCommand extends Command { };
            const command = new SayHelloCommand();
            command.should.have.property('_type');
            command.type.should.equal('SayHelloCommand');
            done();
        });

    });

    describe('CommandFactory tests', (done) => {

        it('Should create a showMessageCommand and set its properties', (done) => {
            const factory = new CommandFactory(__dirname + '/commands');
            const command = factory.create(showMessageCommandType, { message: 'hello!', anotherProperty:'hi!' });
            command.type.should.eq(showMessageCommandType);
            command.message.should.eq('hello!');
            command.message = 'world!';
            command.message.should.eq('world!');
            done();
        });

        it('Should throw a TypeError when an invalid command', (done) => {
            (() => {
                const factory = new CommandFactory((__dirname + '/commands'));
                const command = factory.create('invalidCommand');
            }).should.throw(Error);
            done();
        });
    });

    describe('CommandDispatcher tests', () => {

        const dispatcher = new CommandDispatcher();

        it('Should register a command using factory', (done) => {
            dispatcher.register(showMessageCommandType, {
                factory: () =>
                    new class showMessageCommandHandler { handle(command) { } }
            });
            done();
        });

        it('Should register a command using function', (done) => {
            dispatcher.register('funcCommand', (command) => { return command; });
            done();
        });

        it('Should throw an error when try to register a duplicated command', (done) => {
            (() => { dispatcher.register(showMessageCommandType, () => { }); })
                .should.throw(Error, 'Already exists a handler for showMessageCommand');
            done();
        });

        it('Should execute showMessageCommand', (done) => {
            dispatcher.send({ type: showMessageCommandType, message: 'hello!' });
            done();
        });

        it('Should execute command using function', (done) => {
            dispatcher.send({ type: 'funcCommand' });
            done();
        });

        it('Should throw an error when try to execute an command without handler', (done) => {
            (() => { dispatcher.send({ type: 'withoutHandlerCommand' }); })
                .should.throw(Error, 'There\'s no handler registered for command withoutHandlerCommand');
            done();
        });

        it('Should register multiple commands and execute them', (done) => {
            dispatcher.register(['firstCommand', 'secondCommand'], (command) => { return command; });
            dispatcher.send({ type: 'firstCommand' });
            dispatcher.send({ type: 'secondCommand' });
            done();
        });

    })

    describe('CommandBus tests', () => {

        it('Should throw TypeError exception when try to create an abstract CommandBus', (done) => {
            (() => {
                const bus = new CommandBus();
            }).should.throw(TypeError, 'CommandBus is abstract!');
            done();
        });

        it('Should create an specialized CommandBus', (done) => {
            const bus = new class SpecializedCommandBus extends CommandBus { }
            bus.send({});
            done();
        });

    });
});