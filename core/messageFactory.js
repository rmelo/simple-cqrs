'use strict';

const path = require('path');

module.exports = class MessageFactory {
    constructor(modulesPath) {
        this._modulesPath = modulesPath;
    }
    create(type, properties) {
        const _class = require(path.join(this._modulesPath, type));
        const instance = Reflect.construct(_class, []);
        for (let prop in properties) {
            if (Reflect.has(instance, prop)) {
                Reflect.set(instance, prop, properties[prop]);
            }
        }
        return instance;
    }
}