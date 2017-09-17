const Data = {};

Data.Message = function(subject, body) {
    this.subject = subject;
    this.body = body || {};

    /**
     * @param {Message.body} other body to be merged into this message's body
     * @param {boolean} hard whether the merge should overwrite existing key/value pairs (true) or leave them (false) */
    this.merge = function(other, hard = false) {
        for (var key in other) {
            if (this.body.hasOwnProperty(key) && !hard) continue;
            this.body[key] = other[key];
        }
    }
};

/**
 * Strips all private properties, but also functions, undefined and null values from given object.
 * @param {Object} object object to be processed
 * @param {boolean} recursive whether the object should recurse down into member objects
 * @param {boolean} ignorePrefix ifnores all members with given prefix (e.g. __privateMembers with '__') */
Data.getPublicData = function(object, recursive = true, ignorePrefix = '__') {
    var data = {};
    for (key in object) {
        if (key.indexOf(ignorePrefix) === 0) continue;
        if (typeof object[key] === 'function') continue;
        var v = object[key];
        if (typeof v === 'string' || typeof v === 'number') data[key] = v;
        else if (typeof v === 'object' && recursive) data[key] = (v ? Data.getPublicData(v, true, ignorePrefix) : null);
    }
    return data;
};

/**
 * Looks into given object if the key-combination <query> (e.g. 'root.child.name') exists and returns its value.
 * @param {Object} object object to be looked through
 * @param {string} query query for the desired value, keys are seperated with dots */
Data.findValue = function(object, query) {
    var split = query.split('.');
    var value = object[split[0]];
    if (split.length < 2) return value;
    for (var i = 1; i < split.length; i++) {
        value = value[split[i]];
        if (!value) return value;
    }
    return value;
};

module.exports = Data;
