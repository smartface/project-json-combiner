/*globals mixinDeep*/
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        factory(module.exports);
    }
    else {
        return factory(global.projectJSONCombiner = {});
    }
})(typeof window !== "undefined" ? window : this, function(exports) {
    var mixin = require('./mixin-deep.js') || mixinDeep;

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
                reProjectJSON.test((name)) && projectJSONFiles.push(name);
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
                    projectJSON = mixin(projectJSON, obj);
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
});