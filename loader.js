const Module = {};

Module.extend = require('./src/extend');
Module.Data = require('./src/data');
Module.EventHandler = require('./src/event');
Module.Request = require('./src/request');

module.exports = Module;
