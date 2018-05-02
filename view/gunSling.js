var Gun = require('gun/gun')
require('gun/lib/unset.js')
require('gun-file')

localStorage.clear()

var gun = new Gun( {
  'file-name': 'service.gun',
  'file-mode' : 0666,
  'file-pretty' : true,
  'file-delay' : 100,
  file : false
})



function printData (obj) {
  obj.map().once(print)
}

function printChildren (obj) {
  obj.map().map().map().once(print)
}

function print(x,y) {
  console.log(`${y} : ${x}`)
}

function linkItem (originId, originRoot, linkId, linkRoot) {

  originRoot.get(originId).get('linked').set(linkRoot.get(linkId))

  linkRoot.get(linkId).get('linked').set(originRoot.get(originId))
}
