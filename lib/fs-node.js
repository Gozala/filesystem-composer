#!/usr/bin/env node
'use strict';

var print = require('sys').print
var fs = require('fs')

var FS = require('./file-system-async').compose({
    SEPARATOR: '/',
    workingDirectory: function workingDirectory() {
        return FS.normal(FS.join(process.cwd(), FS.SEPERATOR))
    },
    changeWorkingDirectory: function changeWorkingDirectory(path) {
        return process.cwd(FS.absolute(path))
    },
    isFile: function isFile(path, result, error) {
        fs.stat(path, function(e, stats) {
            if (e) error(e)
            else result(stats.isFile())
        })
    },
    isDirectory: function isDirectory(path, result, error) {
        fs.stat(path, function(e, stats) {
            if (e) error(e)
            else result(stats.isDirectory())
        })
    },
    isLink: function isLink(path, result, error) {
        fs.stat(path, function(e, stats) {
            if (e) error(e)
            else result(stats.isSymbolicLink())
        })
    },
    list: function list(path, result, error) {
        fs.readdir(path, function(e, files) {
            if (e) error(e)
            else result(files)
        })
    }
})

for (var key in FS) exports[key] = FS[key]
