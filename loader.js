const Module = {};

Module.extend = require('./src/extend').enchant;
Module.extendPrototype = require('./src/extend').extend;
Module.Data = require('./src/data');
Module.EventHandler = require('./src/event');
Module.Request = require('./src/request');

module.exports = Module;
