'use strict';

const Command = require('./command');

module.exports = class coreCommand extends Command {
    get message() { return this._message; }
    set message(value) { this._message = value; }
};