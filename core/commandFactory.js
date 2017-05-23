'use strict';

const path = require('path');

module.exports = class CommandFactory {
    constructor(commandsPath = '../commands/') {
        this._commandsPath = commandsPath;
    }
    create(type, properties) {
        const _class = require(path.join(this._commandsPath, type));
        const instance = Reflect.construct(_class, []);
        for (let prop in properties) {
            if (Reflect.has(instance, prop)) {
                Reflect.set(instance, prop, properties[prop]);
            }
        }
        return instance;
    }
}