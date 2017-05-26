'use strict';

const Event = require('./event');

module.exports = class eventHappenedEvent extends Event {
    set who(value) { this._who = value; }
    get who() { return this._who; }
};