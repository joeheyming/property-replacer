property-replacer
=================

Write javascript unit tests where you can safely replace object properties and undo the replacement on teardown.  Inspired by perl Test::Resub and python redef

[![Build Status](https://secure.travis-ci.org/joeheyming/property-replacer.png)](http://travis-ci.org/joeheyming/property-replacer)

## Installation

```shell
npm install property-replacer
```

## Usage
Replacer.replace(object, key, anything);
  --> replace any key on an object with anything.
Replacer.reset();
  --> put all replaced properties back to normal.

```javascript
var Replacer = require('property-replacer');
// some constructor
var Cat = function() {
};
Cat.prototype.meow = function() { return 'meow'; };

Replacer.replace(Cat.prototype, 'meow', function() { return 'bark!'; });
var cat = new Cat();
var meow = cat.meow();
// returns bark!

Replacer.reset();
meow = cat.meow();
// returns meow

```
