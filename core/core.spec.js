'use strict';

const chai = require('chai');
const { Command, CommandFactory, CommandDispatcher, CoreCommand, CommandBus } = require('../');

chai.should();

describe('Core tests', () => {

    const coreCommandType = 'coreCommand';

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

        it('Should create a coreCommand and set its properties', (done) => {
            const factory = new CommandFactory('../core/');
            const command = factory.create(coreCommandType, { message: 'hello!' });
            command.type.should.eq(coreCommandType);
            command.message.should.eq('hello!');
            command.message = 'world!';
            command.message.should.eq('world!');
            done();
        });

        it('Should throw a TypeError when an invalid command', (done) => {
            (() => {
                const factory = new CommandFactory('../core/');
                const command = factory.create('numbCommand');
            }).should.throw(Error);
            done();
        });
    });

    describe('CommandDispatcher tests', () => {

        const dispatcher = new CommandDispatcher();

        it('Should register a command using factory', (done) => {
            dispatcher.register(coreCommandType, {
                factory: () =>
                    new class CoreCommandHandler { handle(command) { } }
            });
            done();
        });

        it('Should register a command using function', (done) => {
            dispatcher.register('funcCommand', (command) => { return command; });
            done();
        });

        it('Should throw an error when try to register a duplicated command', (done) => {
            (() => { dispatcher.register(coreCommandType, () => { }); })
                .should.throw(Error, 'Already exists a handler for coreCommand');
            done();
        });

        it('Should execute coreCommand', (done) => {
            dispatcher.send({ type: coreCommandType, message: 'hello!' });
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

        it('Should throw TypeError exception when try to create an abstract Command', (done) => {
            (() => {
                const bus = new CommandBus();
            }).should.throw(TypeError, 'CommandBus is abstract!');
            done();
        });

        it('Should create an AzureServiceBus', (done) => {
            const azureServiceBus = new class AzureServiceBus extends CommandBus { }
            azureServiceBus.send({});
            done();
        });

    });
});