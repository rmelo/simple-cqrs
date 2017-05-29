'use strict';

const chai = require('chai');
const { Event, EventFactory, EventBus, EventHandler } = require('../events');
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

            const creationDate = event;

            event.type.should.be.eq('MessageDisplayedEvent');

            event.message = 'hello!';
            event.type = 'messageDisplayedEvent';
            event.date = new Date();

            event.type.should.be.eq('messageDisplayedEvent');
            event.date.should.not.be.eq(creationDate);

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

    describe('EventHandler tests', () => {

        const factory = new EventFactory(__dirname + '/events');
        const wrongHandler = new class WrongEventHandler extends EventHandler { };

        it('Should throw an Error when register null event', (done) => {
            (() => {
                wrongHandler.register('', () => { });
            }).should.throw(Error, 'Event must be non-null');
            done();
        });

        it('Should throw an Error when register null function', (done) => {
            (() => {
                wrongHandler.register('event', null);
            }).should.throw(Error, 'Func must be a non-null function');
            done();
        });

        it('Should register some events, get events and dispatche then', (done) => {
            let result = false;
            let result2 = false;
            const messageHandler = new class MessageEventHandler extends EventHandler {
                constructor() {
                    super();
                    this.register('messageDisplayedEvent', (event) => {
                        result = true;
                    });
                }
            };
            messageHandler.handle({ type: 'messageDisplayedEvent', message: 'hello!' });
            result.should.be.true;
            messageHandler.events.should.lengthOf(1);
            messageHandler.events.should.contains('messageDisplayedEvent');
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