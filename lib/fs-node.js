#!/usr/bin/env node
'use strict';

var fs = require('fs')

var SEPARATOR = exports.SEPARATOR = 0 > process.cwd().indexOf('/') ? '\\' : '/'

var MODES = ["read", "write", "append", "update"],
    FLAG_NAMES = {
        exclusive: process.O_EXCL,
        truncate: process.O_TRUNC,
        create: process.O_CREAT,
        xNarwhalSync: process.O_SYNC,
        xNarwhalNoControlTty: process.O_NOCTTY,
        xNarwhalNoFollow: process.O_NOFOLLOW,
        xNarwhalDirectory: process.O_DIRECTORY
    },
    PATTERNS = {
        read: process.O_RDONLY,
        write: process.O_CREAT | process.O_TRUNC | process.O_WRONLY,
        append: process.O_APPEND | process.O_CREAT | process.O_WRONLY,
        'read|update': process.O_RDWR,
        'write|update': process.O_CREAT | process.O_TRUNC | process.O_RDWR,
        'appane|update': process.O_APPEND | process.O_CREAT | process.O_RDWR
    }

function translateFlags(mode) {
    var pattern = MODES.filter(function (key) {
        return mode[key]
    }).join("|")
    var flags = PATTERNS[pattern]
    if (undefined === flag) throw new Error("Unknown open mode: " + pattern)
    return flags | Object.keys(FLAG_NAMES).map(function (flagName) {
        return mode[flagName] && FLAG_NAMES[flagName]
    })
}

function Factory(type, name) {
    switch(type) {
        case 'stat method':
            return function(path, result, error) {
                fs.stat(path, function(e, stats) {
                    if (e) error(e)
                    else result(stats[name]())
                })
            }
        case 'stat property':
            return function(path, result, error) {
                fs.stat(path, function(e, stats) {
                    if (e) error(e)
                    else result(stats[name])
                })
            }
        case 'fs method':
            return function(path, result, error) {
                fs[name](path, function(e, value) {
                    if (e) error(e)
                    else result(value)
                })
            }
        case 'fs 2 param method':
            return function(path, param, result, error) {
                fs[name](path, param, function(e, value) {
                    if (e) error(e)
                    else result(value)
                })
            }
    }
}

function IO(fd) {
    
}
// Map of key values used to generate functions
var PROXY_MAP = {
    'stat method': {
        isFile: 'isFile',
        isLink: 'isSymbolicLink',
        isDirectory: 'isDirectory',
        isBlockDevice: 'isBlockDevice',
        isCharacterDevice: 'isCharacterDevice',
        isFifo: 'isFifo',
        isSocket: 'isSocket'
    },
    'stat property': {
        owner: 'uid',
        group: 'gid',
        size: 'size',
        lastModified: 'mtime'
    },
    'fs method': {
        remove: 'unlink',
        list: 'readdir',
        removeDirectory: 'rmdir',
        readLink: 'readlink'
    },
    'fs 2 param method': {
        move: 'rename',
        symbolicLink: 'symlink',
        hardLink: 'link'
    }
}

// Generating all the functions that from proxy map
Object.keys(PROXY_MAP).forEach(function(type) {
    var group = PROXY_MAP[type]
    Object.keys(group).forEach(function(key) {
        exports[key] = Factory(type, group[key])
    })
})

// exports.openRaw = openRaw #todo
function openRaw(path, mode, permissions, result, error) {
    permissions = new exports.Permissions(permissions).toUnix()
    fs.open(path, translateFlags(mode), permissions, function (e, fd) {
        if (e) error(e)
        else result(new IO(fd))
    })
}

// exports.touch = touch #todo
function touch(path, result, error) {
    permissions = new exports.Permissions(permissions).toUnix()
    fs.open(path, FLAG_NAMES, permissions, function(e, fd) {
        if (e) error(e)
        else result()
    })
}

exports.workingDirectory = workingDirectory
function workingDirectory() {
    // appending separator so that dirs end with `/`
    return exports.normal(FS.join(process.cwd(), SEPARATOR))
}

exports.changeWorkingDirectory = changeWorkingDirectory
function changeWorkingDirectory(path) {
    return process.chdir(path)
}


exports.makeDirectory = makeDirectory
function makeDirectory(path, mode, result, error) {
    mode = new exports.Permissions(mode).toUnix()
    fs.mkdir(path, mode, function(e) {
        if (e) error(e)
        else result()
    })
}


exports.permissions = permissions
function permissions(path, mode, result, error) {
    fs.stat(path, function(e, stats) {
        if (e) error(e)
        else result(new exports.Permissions(mode))
    })
}

exports.changePermissions = changePermissions
function changePermissions(path, permissions, result, error) {
    permissions = new exports.Permissions(permissions)
    fs.chmod(permissions.toUnix(), function(e) {
        if (e) error(e)
        else result()
    })
}

exports.exists = exists
function exists(path) {
    fs.stat(path, function(e, stats) {
        if (e) result(false)
        else result(true)
    })
}

exports.same = same
function same(pathA, pathB, result, error) {
    var first
    function collect(stats) {
        if (e) result(false)
        if (undefined === first) first = stats.ino
        else result(first.dev === stats.dev && first.ino === stats.ino)
    }
    fs.stats(pathA, collect)
    fs.stats(pathB, collect)
}

exports.sameFilesystem = sameFilesystem
function sameFilesystem(pathA, pathB, result, error) {
    var first
    function collect(stats) {
        if (e) result(false)
        if (undefined === first) first = stats.ino
        else result(first.dev === stats.dev) 
    }
    fs.stats(pathA, collect)
    fs.stats(pathB, collect)
}

require('./file-system-async').compose(exports)
