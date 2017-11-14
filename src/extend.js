
const Request = require('./request.js');
const EventWatcher = require('./event.js');
const Factory = {};

/**
 * Extends a socket.io socket prototype with 3 functions:
 *  - addRequest(name)
 *  - sendRequest(subject, data)
 *  - addWatcher(subject) */
Factory.extend = (socketPrototype) => {
    if (typeof socketPrototype.addRequest == 'undefined') {
        socketPrototype.addRequest = function(name) {
            if (typeof this.__requests == 'undefined') this.__requests = {};
            if (typeof this.__requests[name] != 'undefined') throw new Error('another request called ' + name + ' already exists!');
            var request = new Request(this);
            this.__requests[name] = request;
            return request;
        };
        socketPrototype.sendRequest = function(subject, data) {
            return new Request(this).send(subject, data);
        };
        socketPrototype.addWatcher = function(subject) {
            if (typeof this.__events == 'undefined') this.__events = {};
            if (typeof this.__requests[name] != 'undefined') throw new Error('another event watcher for ' + subject + ' already exists!');
            var watcher = new EventWatcher(subject, this);
            this.__events[watcher.subject] = watcher;
            return watcher;
        };
    }
};

module.exports = Factory.extend;
