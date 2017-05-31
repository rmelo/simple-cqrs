'use strict';

const
    chai = require('chai'),
    sinon = require('sinon');

chai.should();
chai.use(require('sinon-chai'));

const { Event, EventFactory, EventBus, EventHandler, EventDispatcher } = require('../events');
const MessageDisplayedEvent = require('./events/messageDisplayedEvent');

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

    describe('EventDispatcher tests', () => {

        let result1 = false;
        let result2 = false;
        let result3 = false;

        const dispatcher = new EventDispatcher();
        const handler1 = new class Handler extends EventHandler {
            constructor() {
                super();
                this.register('messageDisplayedEvent', (event) => {
                    result1 = true;
                });
            }
        };

        const handler2 = new class Handler extends EventHandler {
            constructor() {
                super();
                this.register('messageDisplayedEvent', (event) => {
                    result2 = true;
                });
            }
        };

        const handler3 = new class Handler extends EventHandler {
            constructor() {
                super();
                this.register('messageDisplayedEvent', (event) => {
                    result2 = true;
                })
                this.register('messageClearedEvent', (event) => {
                    result3 = true;
                });
            }
        };

        it('Should not publish an event', (done) => {
            dispatcher.publish({ type: 'inexistentEvent' });
            done();
        });

        it('Should register an first event handler', (done) => {
            dispatcher.register(handler1);
            dispatcher.handlers.size.should.eq(1);
            dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(1);
            done();
        });

        it('Should register an second event handler', (done) => {
            dispatcher.register(handler2);
            dispatcher.handlers.size.should.eq(1);
            dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(2);
            done();
        });

        it('Should register the last event handler with multiple functions', (done) => {
            dispatcher.register(handler3);
            dispatcher.handlers.size.should.eq(2);
            dispatcher.handlers.get('messageDisplayedEvent').should.lengthOf(3);
            done();
        });

        it('Should register publish a event', (done) => {
            const spy = sinon.spy(dispatcher, 'publish');
            const spyHandler1 = sinon.spy(handler1, 'handle');
            const spyHandler2 = sinon.spy(handler2, 'handle');
            const spyHandler3 = sinon.spy(handler3, 'handle');

            dispatcher.publish({ type: 'messageDisplayedEvent' });
            dispatcher.publish({ type: 'messageClearedEvent' });

            spyHandler1.should.been.calledOnce;
            spyHandler2.should.been.calledOnce;
            spyHandler3.should.been.calledTwice;

            done();
        });
    });
});