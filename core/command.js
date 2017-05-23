'use strict';

module.exports = class Command {
    constructor() {
        if (this.constructor.name == 'Command')
            throw new TypeError('Command is abstract!');
        this._type = this.constructor.name;
    }
    get type() { return this._type; }
    set type(value) { this._type = value; }
};