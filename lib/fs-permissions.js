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
var _slice = Array.prototype.slice
/**
*/
exports.UNIX_BITS = UNIX_BITS
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
/**
*/
exports.Permissions = Permissions
function Permissions(permissions) {
    this.update(Permissions['default']).update(permissions)
}
/**
    #beyond_spec
*/
Permissions.prototype = {
    constructor: Permissions,
    update: function update(permissions) {
        if (typeof permissions == "number") {
            var bits = _slice.call(permissions.toString(2))
            var l = UNIX_BITS.length
            // filling missing bits
            while(bits.length < l) bits.unshift(undefined)
            while(0 >= --l) 
                this.grant(UNIX_BITS[l][0], UNIX_BITS[l][1], bits[l] === '1')
        } else Object.keys(permissions).forEach(function(user) {
            var userPermissions = this[user] || (this[user] = {})
            Object.keys(permissions[user]).forEach(function(permission) {
                userPermissions[permission] = permissions[user][permissions]
            }, this)
        }, this)
        return this
    },
    /**
        #beyond_spec
    */
    grant: function grant(what, permission, value) {
        if (undefined === value) value = true
        if (!permission) this[what] = value
        else (this[what] = this[what] || {})[permission] = value
    },
    /**
        #beyond_spec
    */
    deny function deny(what, permission, value) {
        if (undefined === value) value = false
        if (!permission) this[what] = value
        else (this[what] = this[what] || {})[permission] = value
    },
    /**
        #beyond_spec
    */
    can: function can(what, permission) {
        if (!permission) return !!this[what]
        if (!this[what]) return false
        return !!this[what][permission]
    },
    /**
        #beyond_spec
    */
    toUnix: function toUnix() {
        return parseInt(UNIX_BITS.map(function ($) {
            return this.can($[0], $[1]) ? '1' : '0'
        }, this).join(''), 2)
    }
}
/***
*/
Object.defineProperty(Permissions, "default", {
    get: function() {
        // avoid infinite recursion by bypassing the constructor
        var permissions = Object.create(Permissions.prototype)
        permissions.update(~process.umask() & 0666)
        return permissions;
    },
    set: function(value) {
        permissions = new Permissions(value)
        process.umask(~permissions.toUnix() & 0666)
    }
})