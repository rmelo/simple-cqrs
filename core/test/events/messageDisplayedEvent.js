'use strict';

const Event = require('../../events/event');

module.exports = class MessageDisplayedEvent extends Event {
    get message() { return this._message; }
    set message(value) { this._message = value; }
};