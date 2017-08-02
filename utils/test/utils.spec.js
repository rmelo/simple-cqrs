/* global describe it */
'use strict'

const
  chai = require('chai'),
  utils = require('../coverUtils')

chai.should()
chai.use(require('sinon-chai'))

describe('Utils tests', () => {
  describe('CoverUtils tests', () => {
    var SomeClass = class SomeClass {
      get prop1 () { return this._prop1 }
      set prop1 (value) { this._prop1 = value }
      toJSON () {
        return {}
      }
    }

    var WrongClass = class WrongClass extends SomeClass {
      get prop2 () { return 0 }
      set prop2 (value) { this._prop2 = value }
    }

    var PartialClass = class PartialClass extends SomeClass {
      get prop3 () { return 0 }
      set prop4 (value) { }
    }

    it('Should test all properties of a class', (done) => {
      utils.coverProperties(SomeClass)
      done()
    })

    it('Should throw an error when a property is wrong', (done) => {
      (() => {
        utils.coverProperties(WrongClass)
      }).should.throw(Error)
      done()
    })

    it('Should skip some properties', (done) => {
      utils.coverProperties(PartialClass)
      done()
    })

    it('Should skip when gave a non-class', (done) => {
      utils.coverProperties({})
      done()
    })
  })
})
