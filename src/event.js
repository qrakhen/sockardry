const uuid = require('uuid/v4');

/***
 * A web socket event handler that is used to listen to messages of a given subject only from his remote socket
 * When a message comes in, the callback provided in .listen(fn(data)) is used, if there was an error on the other
 * side, .error(fn(data)) is called instead.
 * Can also be used to emit events to the remote, using .trigger(data), .success(data) or .fail(message)
 * @param {WebSocket} socket the socket to be used for communication
 * @param {string} subject the event that should be listened to and emitted from this handler */
const EventWatcher = function(subject, socket) {
    this.subject = subject;
    this.__socket = socket;
    this.__socket.on(subject, (r) => { this.__on(r); });
    this.__emit = (body) => {
        this.__socket.emit(this.subject, body);
    };
    this.__on = (r) => {
        if (r.success && r.success === false) {
            if (this.__error && typeof this.__error === 'function') this.__error(r);
        } else {
            this.__listen(r);
        }
    };
    this.emit = (data) => {
        this.__emit({ success: true, data: data });
    };
    this.fail = (message) => {
        this.__emit({ success: false, message: message });
    };
    this.listen = (fn) => {
        this.__listen = fn;
    };
    this.error = (fn) => {
        this.__error = fn;
    };
};

module.exports = EventWatcher;
