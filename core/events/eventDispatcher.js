'use strict';

const EventBus = require('./eventBus');

module.exports = class EventDispatcher extends EventBus {
    constructor() {
        super();
        this._handlers = new Map();
    }
    get handlers() { return this._handlers; }
    register(handler) {
        handler.events.forEach((event) => {
            let handlers = this._handlers.get(event) || [];
            handlers.push(handler);
            this._handlers.set(event, handlers);
        });
        return this;
    }
    publish(event) {
        let handlers = this._handlers.get(event.type);
        handlers.forEach((handler) => {
            handler.handle(event);
        }, this);
    }
};