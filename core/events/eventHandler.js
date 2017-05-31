'use strict';

module.exports = class EventHandler {

    constructor() {
        this._handlers = new Map();
        this._events = new Array();
    }

    register(event, func) {
        if (!event)
            throw Error('Event must be non-null');
        if (!func)
            throw Error('Func must be a non-null function');

        let handlers = this._handlers.get(event) || [];
        handlers.push(func);

        this._handlers.set(event, handlers);
        this._events.push(event);
        
        return this;
    }
    handle(event) {
        const handlers = this._handlers.get(event.type);
        handlers.forEach((func) => {
            func(event);
        }, this);
    }
    get events() { return this._events; }
}