'use strict';

module.exports = class EventBus{
    constructor() {
        if (this.constructor.name == 'EventBus')
            throw new TypeError('EventBus is abstract!');
    }
    publish(event) { }
}