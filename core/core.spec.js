'use strict';

const chai = require('chai');
const { Command, CommandFactory } = require('../');

chai.should();

describe('Core tests', () => {
    describe('Command', () => {

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

    describe('CommandFactory', (done) => {
        it('Should create a ShowMessageCoreCommand and set its properties', (done) => {
            const factory = new CommandFactory('../core/');
            const command = factory.create('coreCommand', { message: 'hello!' });
            command.type.should.eq('ShowMessageCoreCommand');
            command.message.should.eq('hello!');
            command.message = 'world!';
            command.message.should.eq('world!');
            done();
        });
    });
});