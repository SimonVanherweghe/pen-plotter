var fs = require('fs');
var ndjson = require('ndjson'); // npm install ndjson
const {resolve} = require('path');

function parseSimplifiedDrawings(fileName, callback) {
  var drawings = [];
  var fileStream = fs.createReadStream(fileName);
  fileStream
    .pipe(ndjson.parse())
    .on('data', function(obj) {
      if (obj.recognized) {
        drawings.push(obj);
      }
    })
    .on('error', callback)
    .on('end', function() {
      callback(null, drawings);
    });
}

function getQuickDraw(dataPath, index) {
  return new Promise(function(resolve, reject) {
    parseSimplifiedDrawings(dataPath, function(err, drawings) {
      if (err) reject(console.error(err));

      if (index) {
        resolve(drawings[index]);
      } else {
        resolve(drawings[Math.floor(Math.random() * drawings.length)]);
      }
    });
  });
}

module.exports = {getQuickDraw};
