'use strict'

var Trait = require('light-traits').Trait

exports.FSAttributesTrait = Trait(
{ // returns the size of a file in bytes, or throws an exception if the
  // path does not correspond to an accessible path, or is not a
  // regular file or a link. If path is a link, returns the size of the
  // final link target, rather than the link itself.  
  // Care should be taken that this number returned is suitably large
  // (i.e. that we can get useful figures for files over 1GB
  // (30bits+sign bit). If the size of a file cannot be represented by
  // a JavaScript number, "size" must throw a RangeError.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Number}
   */
  size: function size(path) {
    throw new Error('not implemented yet')
  }
  // returns the time that a file was last modified as a Date object.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Date}
   */
, lastModified: function lastModified(path) {
    throw new Error('not implemented yet')
  }
})

