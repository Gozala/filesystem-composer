'use strict'

var Trait = require('light-traits').Trait

exports.FSLinksTrait = Trait({
  _link: Trait.required,
  _hardLink: Trait.required,
  _readLink: Trait.required,
  link: function link(source, target) {
    this._link.apply(this, arguments)
  },
  hardLink: function hardLink(source, target) {
    this._hardLink.apply(this, arguments)
  },
  readLink: function readLink(path) {
    this._readLink.apply(this, arguments)
  }
})
