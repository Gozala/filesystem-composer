/*spec

= Specification =

== Types ==

Arguments used throughout this document will have the following types, unless
explicitly specified otherwise:

* '''path''' is either a String, an Object with a toString() method, or an
Object with a valueOf() method that returns an Object with a toString() method.
In the case where path is an Object, the object must return the same string
for the same path on the same system, provided the path in canonicalizable.

* '''mode''' is an Object describing the open mode for a file. Each property
is subject to a true or falsey test. Meaningful properties include read,
write, append, truncate, create, and exclusive. ''Note: any value is
equivalent to false if the property is omitted.''

* '''permissions''' is an instance of Permissions, or a duck-type thereof.

The "fs-base" module exports the following constructors:

* '''Permissions''', a class that describes file system permissions. Instances
of Permissions are initially deep copies of all transitively owned properties
of Permissions.default and have a eponymous property for the optional
"constructor" argument of the constructor.
** Mandatory properties on all platforms are Boolean values owner.read and
owner.write.
** Mandatory properties on UNIX platforms platforms are Boolean values
owner.{read, write, execute}, group.{read, write, execute} and other.{read,
write, execute}.
** Permissions.default must initially reflect the current default file
creation permissions in the host environment; i.e. in a UNIX environment,
Permissions.default would reflect the inverse of umask. Where this is not
possible, compliant implementations must initialize Permissions.default to
{{owner: {read: true, write: true}}

*/
// 'use strict' Octal literals are not allowed in strict mode

var Trait = require('light-traits').Trait

var _slice = Array.prototype.slice

var UNIX_BITS = [
  ["setUid", undefined],
  ["setGid", undefined],
  ["sticky", undefined],
  ["owner", "read"],
  ["owner", "write"],
  ["owner", "execute"],
  ["group", "read"],
  ["group", "write"],
  ["group", "execute"],
  ["other", "read"],
  ["other", "write"],
  ["other", "execute"]
]

var PermissionsTrait = Trait({
  update: function update(permissions) {
    if ('number' == typeof permissions) {
      var bits = _slice.call(permissions.toString(2))
      var l = UNIX_BITS.length
      // filling missing bits
      while (bits.length < l) bits.unshift(undefined)
      while (0 <= --l)
        this.grant(UNIX_BITS[l][0], UNIX_BITS[l][1], bits[l] === '1')
    } else Object.keys(permissions).forEach(function(user) {
      var userPermissions = this[user] || (this[user] = {})
      if ('object' == typeof permissions[user]) {
        Object.keys(permissions[user]).forEach(function(permission) {
          userPermissions[permission] = permissions[user][permissions]
        }, this)
      } else {
        this[user] = permissions[user]
      }
    }, this)
    return this
  },
  grant: function grant(what, permission, value) {
    if (undefined === value) value = true
    if (!permission) this[what] = value
    else (this[what] || (this[what] = {}))[permission] = value
  },
  deny: function deny(what, permission, value) {
    if (undefined === value) value = false
    if (!permission) this[what] = value
    else (this[what] = this[what] || {})[permission] = value
  },
  can: function can(what, permission) {
    if (!permission) return !!this[what]
    if (!this[what]) return false
    return !!this[what][permission]
  },
  toUnix: function toUnix() {
    return parseInt(UNIX_BITS.map(function ($) {
      return this.can($[0], $[1]) ? '1' : '0'
    }, this).join(''), 2)
  }
})

exports.FSPermissionsTrait = Trait({
  _umask: Trait.required,
  _permissions: Trait.required,
  _changePermissions: Trait.required,
  defaultPermissions: function defaultPermissions(value) {
    if (undefined === value) {
      var permissions = PermissionsTrait.create(this.Permissions.prototype)
      permissions.update(~this._umask() & 0666)
      return permissions
    } else {
      var permissions = Permissions(value)
      this._umask(~permissions.toUnix() & 0666)
      return permissions
    }
  },
  Permissions: function Permissions(options) {
    var permissions = PermissionsTrait.create(Permissions.prototype)
    permissions.update(this.defaultPermissions()).update(options)
    return permissions
  },
  permissions: function permissions(path) {
    this._permissions.apply(this, arguments)
  },
  changePermissions: function changePermissions(path, permissions, callback) {
    this._changePermissions(path, this.Permissions(permissions), callback)
  }
})
