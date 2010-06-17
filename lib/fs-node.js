#!/usr/bin/env node
'use strict';

var print = require('sys').print
var fs = require('fs')

exports.SEPARATOR = SEPARATOR
var SEPARATOR = 0 > process.cwd().indexOf('/') ? '\\' : '/'

// exports.openRaw = openRaw #todo
function openRaw(path, mode, permissions, result, error) {

}

exports.move = move
function move(source, target, result, error) {
    fs.rename(source, target function(e) {
        if (undefined !== e) error(e)
        else result()
    })
}

exports.remove = remove
function remove(path) {
    fs.unlink(path, function(e) {
        if (undefined !== e) error(e)
        else result()
    })
}

// exports.touch = touch #todo
function touch(path) {
    
}

exports.workingDirectory = workingDirectory
function workingDirectory() {
    // appending seperator so that dirs end with `/`
    return exports.normal(FS.join(process.cwd(), SEPARATOR))
}

exports.changeWorkingDirectory = changeWorkingDirectory
function changeWorkingDirectory(path) {
    return process.chdir(String(path))
}

exports.isFile = isFile
function isFile(path, result, error) {
    fs.stat(path, function(e, stats) {
        if (undefined !== e) error(e)
        else result(stats.isFile())
    })
}

exports.isDirectory = isDirectory
function isDirectory(path, result, error) {
    fs.stat(path, function(e, stats) {
        if (e) error(e)
        else result(stats.isDirectory())
    })
}

exports.isLink = isLink
function isLink(path, result, error) {
    fs.stat(path, function(e, stats) {
        if (e) error(e)
        else result(stats.isSymbolicLink())
    })
}

exports.list = list
function list(path, result, error) {
    fs.readdir(path, function(e, files) {
        if (e) error(e)
        else result(files)
    })
}

exports.makeDirectory = makeDirectory
function makeDirectory(path, mode, result, error) {
    mode = Permissions(mode).toUnix()
    fs.mkdir(path, mode, function(e) {
        if (e) error(e)
        else result()
    })
}

exports.removeDirectory = removeDirectory
function removeDirectory(path, result, error) {
    fs.rmdir(path, function(e) {
        if (e) error(e)
        else result()
    })
}


require('./file-system-async').compose(exports)
