const uuid = require('uuid/v4');

/**
 * Request that is sent to the remote socket and expected to be returned, calling .done(fn(data)) when successful and
 * .error(fn(data)) when request failed. If the standard convention is being followed, the reason for a failure is
 * stored in data.message;
 * Please note that the remote end has to have a listening event with the same subject in order to be processed,
 * due to Request's behaviour of only digesting its own messages.
 * @param {WebSocket} socket the socket to be used for communication */
const Request = function(socket) {
    this.__pending = {};
    this.__socket = socket;
    /**
     * @instance
     * @private */
    this.__emit = (subject, body) => {
        body.rqid = uuid();
        this.__pending[body.rqid] = this.__hook();
        this.__socket.emit(subject, body);
        this.__socket.on(subject + '_' + body.rqid, this.__on);
        return this.__pending[body.rqid];
    };
    /**
     * @instance
     * @private */
    this.__on = (r) => {
        var hook = (r.rqid ? this.__pending[r.rqid] : null);
        if (hook.__done && typeof hook.__done === 'function') hook.__done(r);
        if (r.success) {
            if (r.success === true &&
                hook.__success &&
                typeof hook.__success === 'function') hook.__success(r);
            else
            if (hook.__error &&
                typeof hook.__error === 'function') hook.__error(r);
        }
        delete this.__pending[r.rqid];
    };
    /***
     * Sends the initial request message to the remote socket, creating a new rqid.
     * You can assign callbacks directly to this function, like .send('enter').success((r) => { });
     * Possible callbacks are:
     *      .success(function(data) { ... })
     *      .fail(function(data) { ... })
     *      .done(function(data) { ... })
     * .done() will always be called, no matter whether the request was successful.
     * This can be used to implement custom error handling, for example
     * @param {string} subject the subject of the message used to identify the event on the remote socket
     * @param {object} data request data object
     * @return {callbackProvier} */
    this.send = (subject, data) => {
        return this.__emit(subject, { data: data });
    };
    /**
     * Returns message <original>, marked as successful, directly to the correct remote callback using the rqid.
     * @param {object} original the original full message body that should be responded to
     * @param {object} data optiona data object */
    this.success = (original, data) => {
        this.__socket.emit(original.rqid, { success: true, data: data });
    };
    /**
     * Returns message <original>, marked as failed, directly to the correct remote callback using the rqid.
     * @param {object} original the original full message body that should be responded to
     * @param {string} message reason why this request failed, as string */
    this.fail = (original, message) => {
        this.__socket.emit(original.rqid, { success: false, message: message });
    };
    this.__hook = () => {
        return {
            done: function(fn) {
                this.__done = fn;
                return this;
            },
            success: function(fn) {
                this.__success = fn;
                return this;
            },
            error: function(fn) {
                this.__error = fn;
                return this;
            }
        };
    };
};

module.exports = Request;
