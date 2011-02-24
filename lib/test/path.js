'use strict'

exports.create = function create(fs) {
  function StringArray($) { return '"' + $ + '"' }
  
  return (
  { 'test `base`': function(assert) {
    ; [ ['', '', 'Empty string yields empty response']
      , ['/', '', 'Root alone yields empty response']
      , ['/foo/', '', 'Directory references yields empty response']
      , ['/foo', 'foo']
      , ['/foo/bar.js', 'bar.js']
      , ['foo/bar.js', 'bar.js']
      ].forEach(function($) {
        assert.equal
        ( fs.base($[0])
        , $[1]
        , $[2] || 'require("fs").base("' + $[0] + '") == "' + $[1] + '"'
        )
        assert.equal
        ( fs.Path($[0]).base()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").base() == "' + $[1] + '"'
        )
        assert.equal
        ( fs.path($[0]).base()
        , $[1]
        , $[2] || 'require("fs").path("' + $[0] + '").base() == "' + $[1] + '"'
        )
      })
    }
  , 'test `directory`': function(assert) {
    ; [ ['', '.']
      , ['.', '.']
      , ['foo', '.']
      , ['foo.txt', '.']
      , ['foo/', '.']
      , ['foo/bar/', 'foo/']
      , ['foo/bar/baz.txt', 'foo/bar/']
      , ['/', '/']
      , ['/foo.txt', '/']
      , ['/foo/', '/']
      , ['/foo/bar/', '/foo/']
      , ['/foo/bar/baz.txt', '/foo/bar/']
      ].forEach(function($) {
        assert.equal
        ( fs.directory($[0])
        , $[1]
        , $[2] || 'require("fs").directory("' + $[0] + '") == "' + $[1] + '"'
        )
        assert.equal
        ( fs.Path($[0]).directory()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").directory() == "' + $[1] + '"'
        )
        assert.equal
        ( fs.path($[0]).directory()
        , $[1]
        , $[2] || 'require("fs").path("' + $[0] + '").directory() == "' + $[1] + '"'
        )
       })
    }
  , 'test `extension`': function(assert) {
    ; [ ['', '']
      , ['.', '']
      , ['..', '']
      , ['.a', '']
      , ['..a', '']
      , ['.a.b', '.b']
      , ['a.b', '.b']
      , ['a.b.c', '.c']
      , ['/', '']
      , ['/.', '']
      , ['/..', '']
      , ['/..a', '']
      , ['/.a.b', '.b']
      , ['/a.b', '.b']
      , ['/a.b.c', '.c']
      , ['foo/', '']
      , ['foo/.', '']
      , ['foo/..', '']
      , ['foo/..a', '']
      , ['foo/.a.b', '.b']
      , ['foo/a.b', '.b']
      , ['foo/a.b.c', '.c']
      , ['/foo/', '']
      , ['/foo/.', '']
      , ['/foo/..', '']
      , ['/foo/..a', '']
      , ['/foo/.a.b', '.b']
      , ['/foo/a.b', '.b']
      , ['/foo/a.b.c', '.c']
      ].forEach(function($) {
        assert.equal
        ( fs.extension($[0])
        , $[1]
        , $[2] || 'require("fs").extension("' + $[0] + '") == "' + $[1] + '"'
        )
        assert.equal
        ( fs.Path($[0]).extension()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").extension() == "' + $[1] + '"'
        )
        assert.equal
        ( fs.path($[0]).extension()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").extension() == "' + $[1] + '"'
        )
      })
    }
  , 'test `normal`': function(assert) {
    ; [ ['', '']
      , ['.', '']
      , ['./', '']
      , ['../', '../']
      , ['../a', '../a']
      , ['../a/', '../a/']
      , ['a/..', '']
      , ['a/../', '']
      , ['a/../b', 'b']
      , ['a/../b/', 'b/']
      , ['a/../../', '../']
      , ['a/../../b', '../b']
      , ['./../', '../']
      ].forEach(function($) {
        assert.equal
        ( fs.normal($[0])
        , $[1]
        , $[2] || 'require("fs").normal("' + $[0] + '") == "' + $[1] + '"'
        )
        assert.equal
        ( fs.Path($[0]).normal()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").normal() == "' + $[1] + '"'
        )
        assert.equal
        ( fs.path($[0]).normal()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").normal() == "' + $[1] + '"'
        )
      })
    }
  , 'test `relative`': function(assert) {
    ; [ ['', '', '']
      , ['.', '', '']
      , ['', '.', '']
      , ['.', '.', '']
      , ['', '..', '../']
      , ['', '../', '../']
      , ['a', 'b', 'b']
      , ['../a', '../b', 'b']
      , ['../a/b', '../a/c', 'c']
      , ['a/b', '..', '../../']
      , ['a/b', 'c', '../c']
      , ['a/b', 'c/d', '../c/d']
      , ["a", "a/b/c", "a/b/c"]
      , ["a/", "a/b/c", "b/c"]
      ].forEach(function($) {
        assert.equal
        ( fs.relative($[0], $[1])
        , $[2]
        , $[3] || 'require("fs").relative("' + $[0] + ', "' + $[1] + '") == "' + $[2] + '"'
        )
        assert.equal
        ( fs.Path($[0]).relative($[1])
        , $[2]
        , $[3] || 'require("fs").Path("' + $[0] + '").relative("' + $[1] + '") == "' + $[2] + '"'
        )
        assert.equal
        ( fs.Path($[0]).relative($[1])
        , $[2]
        , $[3] || 'require("fs").Path("' + $[0] + '").relative("' + $[1] + '") == "' + $[2] + '"'
        )
      })
    }
  , 'test `resolve`': function(assert) {
      ;[[['/'], '/']
      , [['/a'], '/a']
      , [['/a/'], '/a/']
      , [['/a', '/b'], '/b']
      , [['/a', '/b/'], '/b/']
      , [['/', 'a'], '/a']
      , [['/', 'a/'], '/a/']
      , [['/a', 'a'], '/a']
      , [['/a', 'a/'], '/a/']
      , [['/a/', 'a'], '/a/a']
      , [['/a/', 'a/'], '/a/a/']
      , [['..'], '../']
      , [['..', 'a'], '../a']
      , [['..', 'a/'], '../a/']
      , [['.'], '']
      , [['.', 'a'], 'a']
      , [['.', 'a/'], 'a/']
      , [['a', '.'], '']
      , [['a', '.', 'a'], 'a']
      , [['a', '.', 'a/'], 'a/']
      , [['a', '..'], '../']
      , [['a', '..', 'a'], '../a']
      , [['a', '..', 'a/'], '../a/']
      , [['a/', '..'], '']
      , [['a/', '..', 'a'], 'a']
      , [['a/', '..', 'a/'], 'a/']
      , [['a/b', ''], 'a/b'],
      ].forEach(function($) {
        assert.equal
        ( fs.resolve.apply(fs, $[0])
        , $[1]
        , $[2] || 'require("fs").resolve(' + $[0].map(StringArray).join(',') + ') == "' + $[1] + '"'
        )
      })
    }
  , 'test `join`': function(assert) {
      ;[['/', 'a', '/a']
      , ['.', 'a', 'a']
      , ['.', '..', '../']
      , ['.', '../', '../']
      ].forEach(function($) {
      assert.equal
        ( fs.join($[0], $[1])
        , $[2]
        , $[3] || 'require("fs").join("' + $[0] + ', "' + $[1] + '") == "' + $[2] + '"'
        )
        assert.equal
        ( fs.Path($[0]).join($[1])
        , $[2]
        , $[3] || 'require("fs").Path("' + $[0] + '").join("' + $[1] + '") == "' + $[2] + '"'
        )
        assert.equal
        ( fs.Path($[0]).join($[1])
        , $[2]
        , $[3] || 'require("fs").Path("' + $[0] + '").join("' + $[1] + '") == "' + $[2] + '"'
        )
      })
    }
  , 'test `split`': function(assert) {
    ; [ ['',[]]
      , ['foo/bar/', ['foo','bar','']]
      , ['foo/bar', ['foo','bar']]
      , ['/', ['','']]
      , ['/foo/bar', ['','foo','bar']]
      , ['/foo/bar/', ['','foo','bar','']]
      , ['/foo/bar.js', ['','foo','bar.js']]
      ].forEach(function($) {
        assert.deepEqual
        ( fs.split($[0])
        , $[1]
        , $[2] || 'require("fs").split("' + $[0] + '") ≈≈ "[' + $[1].map(StringArray) + ']"'
        )
        assert.deepEqual
        ( fs.Path($[0]).split()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").split() ≈≈ "[' + $[1].map(StringArray) + ']"'
        )
        assert.deepEqual
        ( fs.path($[0]).split()
        , $[1]
        , $[2] || 'require("fs").Path("' + $[0] + '").split() ≈≈ "[' + $[1].map(StringArray) + ']"'
        )
      })
    }
  })
}
