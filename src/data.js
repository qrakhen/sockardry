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
Data.getPublicData = function(object, recursive = true, ignorePrefix = '__', ignoreKeys = []) {
    var data = {};
    for (key in object) {
        if (ignorePrefix && key.indexOf(ignorePrefix) === 0) continue;
        if (ignoreKeys && ignoreKeys.indexOf(key) > -1) continue;
        if (typeof object[key] === 'function') continue;
        var v = object[key];
        if (typeof v !== 'object') data[key] = v;
        else if (typeof v === 'object' && recursive) data[key] = (v ? Data.getPublicData(v, true, ignorePrefix, ignoreKeys) : null);
    }
    return data;
};

/**
 * extracts all 'public' properties from an object, recursively per default.
 * private properties can either be defined by having the same prefix (i.e. '__privateProperty')
 * or by providing all key names that should be ignored.
 * can also be combined, in case it is needed to also hide some public properties.
 * @param {boolean} r Recursive, if true, will go through all child objects
 * @param {string} p PrivatePrefix, string to detect private properties by their key names (i.e. '__' for '__privateProp'). a falsey value will disable this check.
 * @param {array} i IgnoredKeys, array of strings standing for keys that will be ignored (i.e. [ 'internalId', 'hugeChildObjectWeDontNeedAndThusIgnore' ])
 * @returns {Object} extracted data object */
Object.prototype.extract = function(r, p, i) {
	var d = {};
    for(k in this) {
        var v = this[k];
        if ((p && k.indexOf(p) == 0) ||
            (i && i.indexOf(k) > -1) ||
            typeof v == 'function') continue;
        if (typeof v == 'object' && r) d[k] = __.extract(r, p);
        else d[k] = v;
    }
    return d;
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
