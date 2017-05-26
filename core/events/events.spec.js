'use strict';

const chai = require('chai');
const { Event, EventFactory, EventBus } = require('./');

chai.should();

describe('Events tests', () => {

    describe('Event tests', () => {

        it('Should throw TypeError exception when try to create an abstract Event', (done) => {
            (() => {
                const event = new Event();
                event.type = 'doSomeAction';
                event.version = 1;
                event.type.should.eq('doSomeAction');
                event.version.should.eq(1);
                event.date.should.be.a('date');
                event.date = new Date();
                done();
            }).should.throw(TypeError);
            done();
        });
    });

    describe('EventFactory tests', (done) => {

        it('Should create an event and set its properties', (done) => {
            const factory = new EventFactory('../core/events');
            const event = factory.create('eventHappenedEvent', { version: 2, who: 'Batman' });
            event.version.should.eq(2);
            event.who.should.eq('Batman');
            done();
        });

        it('Should throw a TypeError when an invalid event', (done) => {
            (() => {
                const factory = new EventFactory('../core/');
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