'use strict';

const MessageFactory = require('../messageFactory');

module.exports = class EventFactory extends MessageFactory {
    constructor(eventsPath = './events/') {
        super(eventsPath);
    }
}