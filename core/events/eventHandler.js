'use strict';

module.exports = class EventHandler {
    constructor(){
        if (this.constructor.name == 'EventHandler')
            throw new TypeError('EventHandler is abstract!');
    }
    get events() { throw Error('Not implemented') }
}