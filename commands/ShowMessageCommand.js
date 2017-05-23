'use strict';

const Command = require('../core/command');

module.exports = class ShowMessageCommand extends Command {
    get message() { return this._message; }
    set message(value) { this._message = value; }
}