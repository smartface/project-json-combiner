//Taken from mixin-deep node module
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(module.exports);
    }
    else {
        var module = {exports :{}};
        factory(module);
        return global.mixinDeep = module.exports;
    }
})(typeof window !== "undefined" ? window : this, function(exports) {
    'use strict';

    function forIn(o, fn, thisArg) {
        for (var key in o) {
            if (fn.call(thisArg, o[key], key, o) === false) {
                break;
            }
        }
    }

    function isExtendable(val) {
        return typeof val !== 'undefined' && val !== null &&
            (typeof val === 'object' || typeof val === 'function');
    }

    function mixinDeep(target, objects) {
        var len = arguments.length,
            i = 0;
        while (++i < len) {
            var obj = arguments[i];
            if (isObject(obj)) {
                forIn(obj, copy, target);
            }
        }
        return target;
    }

    /**
     * Copy properties from the source object to the
     * target object.
     *
     * @param  {*} `val`
     * @param  {String} `key`
     */

    function copy(val, key) {
        var obj = this[key];
        if (isObject(val) && isObject(obj)) {
            mixinDeep(obj, val);
        }
        else {
            this[key] = val;
        }
    }

    /**
     * Returns true if `val` is an object or function.
     *
     * @param  {any} val
     * @return {Boolean}
     */

    function isObject(val) {
        return isExtendable(val) && !Array.isArray(val);
    }

    /**
     * Expose `mixinDeep`
     */

    module.exports = mixinDeep;
});