/*globals mixinDeep*/
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(module.exports);
    }
    else {
        return factory(global.projectJSONCombiner = {});
    }
})(typeof window !== "undefined" ? window : this, function(exports) {
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


    function combineProjectJSON(configPath, fs, callback) {
        var reProjectJSON = /project(\.\w+)?\.json/;
        fs.readdir(configPath, function(err, list) {
            if (err) {
                callback(err);
                return;
            }

            var projectJSONFiles = [];

            list.forEach(function(name) {
                if (typeof name !== "string")
                    name = name.name;
                reProjectJSON.lastIndex = 0;
                reProjectJSON.test((name)) && projectJSONFiles.push(
                    getPath(configPath, name));
            });

            var projectJSON = {};

            readNextFile(function(err, projectJSON) {
                if (!err) {
                    cache.stamp = new Date();
                    cache.projectJSON = projectJSON;
                }
                callback(err, projectJSON);
            });

            function readNextFile(cb) {
                var fileToRead = projectJSONFiles.pop();
                if (!fileToRead) {
                    cb(null, projectJSON);
                    return;
                }
                fs.readFile(fileToRead, "utf8", function(err, data) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    var obj;
                    try {
                        obj = JSON.parse(data);
                    }
                    catch (ex) {
                        ex.currentFile = fileToRead;
                        cb(ex);
                        return;
                    }
                    projectJSON = mixinDeep(projectJSON, obj);
                    readNextFile(cb);
                });
            }
        });
    }


    var cache = {
        enabled: true,
        duration: 1000,

    };

    function getProjectJSON(configPath, fs, callback) {
        if (cache.enabled && cache.stamp) {
            var currentDate = new Date();
            var difference = currentDate - cache.stamp;
            if (difference <= cache.duration) {
                callback(null, cache.projectJSON);
            }
            else {
                combineProjectJSON(configPath, fs, callback);
            }
        }
        else {
            combineProjectJSON(configPath, fs, callback);
        }
    }

    exports.cache = cache;
    exports.getProjectJSON = getProjectJSON;

    function getPath(base, file) {
        /*if (typeof module === "object")
            return file;*/
        return base + "/" + file;
    }

});