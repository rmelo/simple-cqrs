'use strict';

const expect = require('chai').expect,
    { Command, CommandFactory } = require('../');

describe('Core', () => {
    describe('Command', () => {

        it('Should throw TypeError exception when try to create an abstract Command', (done) => {
            expect((() => {
                const command = new Command();
            })).throw(TypeError);
            done();
        });

        it('Should create an SayHelloCommand and set type.', (done) => {

            const SayHelloCommand = class SayHelloCommand extends Command { };
            const command = new SayHelloCommand();
            expect(command).have.haveOwnProperty('_type');
            expect(command.type).equal('SayHelloCommand');

            done();
        });

    });

    describe('CommandFactory', () => {
        it('Should create a ShowMessageCommand', (done) => {

            const factory = new CommandFactory();
            const command = factory.create('ShowMessageCommand', { message: 'Hello!' });
            expect(command).exist;
            expect(command.type).eq('ShowMessageCommand');

            done();
        });
    });
});