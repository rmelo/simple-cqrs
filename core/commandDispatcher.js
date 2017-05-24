'use strict';

const CommandFactory = require('./commandFactory');

module.exports = class CommandDispatcher {
    constructor(commandFactory = new CommandFactory()) {
        this._handlers = new Map();
        this._commandFactory = commandFactory;
    }
    register(type, handler) {
        if (type.constructor === String) {
            if (this._handlers.get(type))
                throw new Error(`Already exists a handler for ${type}`);
            this._handlers.set(type, handler);
        } else if (type.constructor === Array) {
            type.forEach(function (t) {
                this.register(t, handler);
            }, this);
        }
    }
    send(command) {
        const defination = this._handlers.get(command.type);
        if (typeof defination === 'object') {
            if (defination.factory) {
                const handler = defination.factory();
                handler.handle(command);
            }
        } else if (typeof defination === 'function') {
            defination(command);
        } else {
            throw new Error(`There's no handler registered for command ${command.type}`);
        }
    }
}