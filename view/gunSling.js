var Gun = require('gun/gun')
require('gun/lib/unset.js')
require('gun-file')
var gun = new Gun( {
  'file-name': 'service.gun',
  'file-mode' : 0666,
  'file-pretty' : true,
  'file-delay' : 100,
  file : false
})

localStorage.clear()

function printData (val, key) {
  console.log(key, val);
}
