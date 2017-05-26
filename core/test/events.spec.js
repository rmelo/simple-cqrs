'use strict';

const chai = require('chai');
const { Event, EventFactory, EventBus } = require('../events');
const MessageDisplayedEvent = require('./events/messageDisplayedEvent');

chai.should();

describe('Events tests', () => {

    describe('Event tests', () => {

        it('Should throw TypeError exception when try to create an abstract Event', (done) => {
            (() => {
                const event = new Event();
                done();
            }).should.throw(TypeError);
            done();
        });

        it('Should create a json-based event and change it properties', (done) => {
            const event = new MessageDisplayedEvent();

            event.type.should.be.eq('MessageDisplayedEvent');

            event.message = 'hello!';
            event.type = 'messageDisplayedEvent';
            event.date = new Date();

            event.type.should.be.eq('messageDisplayedEvent');

            done();
        });
    });

    describe('EventFactory tests', (done) => {

        const factory = new EventFactory(__dirname + '/events');

        it('Should create an event and set its properties', (done) => {
            const event = factory.create('messageDisplayedEvent', { version: 1, message: 'Hello!' });
            event.version.should.eq(1);
            event.message.should.eq('Hello!');
            event.type.should.eq('MessageDisplayedEvent');
            done();
        });

        it('Should throw a TypeError when an invalid event', (done) => {
            (() => {
                const command = factory.create('invalidEvent');
            }).should.throw(Error);
            done();
        });
    });

    describe('EventBus tests', () => {

        it('Should throw TypeError exception when try to create an abstract EventBus', (done) => {
            (() => {
                const bus = new EventBus();
            }).should.throw(TypeError, 'EventBus is abstract!');
            done();
        });

        it('Should create an specialized EventBus', (done) => {
            const bus = new class SpecializedEventBus extends EventBus { }
            bus.publish({});
            done();
        });
    });
});