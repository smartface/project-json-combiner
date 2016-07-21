# project-json-combiner
Combines project.json in smartface workspace environment
In a provided path scans the directory for name matching project.json OR project.<purpose>.json files and combines them.

# Install
```shell
npm i --save project-json-combiner
```

# Usage

Require the module first
```javascript
var projectJSONCombiner = require("project-json-combiner");
```

## Rules
- fs object must be passed
- Scans folder non-recursivly
- File names are case sensitive "_project**.\<anySingleWord\>**.json_"
- It has built in caching mechanisim

## Get combined project.json

```javascript
var fs = require("fs");
projectJSONCombiner.getProjectJSON("./", fs, function(err, projectJSON){
  // handle error if any
  console.log(projectJSON.info.name);
}) ;
```

### Error handling
In case of malformatted json files, JSON parser will throw errors. That first encountered error will trigger the callback with that information. The error object passed also contains `currentFile` property stating which file is faulty.

## Caching
Caching is enabled by default.
```javascript
projectJSONCombiner.cache.enabled = false;  //or true
```

Object is cached for duration of 1 second by default
Caching is enabled by default.
```javascript
projectJSONCombiner.cache.duration = 5000;  //in miliseconds
```