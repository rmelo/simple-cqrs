'use strict'

module.exports = class Event {

	constructor() {
		if (this.constructor.name == 'Event')
			throw new TypeError('Event is abstract!')
		this._type = this.constructor.name
		this._date = new Date()
		this._version = 0
	}

	set type(value) { this._type = value }
	get type() { return this._type }

	get version() { return this._version }
	set version(value) { this._version = value }

	get date() { return this._date }
	set date(value) { this._date = value }
}