'use strict';

const expect = require('chai').expect,
    Command = require('../core/command');

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
        expect(command.type).equal('SayHelloCommand');

        done();
    });

});