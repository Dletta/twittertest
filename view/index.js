var {ipcRenderer} = require('electron')
const util = require('util')



var Tweets = function () {
  this.tweets = []
  this.process = function(data) {
    /*create objects for each data information that is not an object
    * makes it easier for working with the gunDB
    */
    data.words = data.text.split(" ")
    for(let i=0;i<data.words.length;i++){
      data.words[i] = {word: data.words[i]}
    }
    data.text = {text:data.text}
    data.timestamp = {timestamp:data.timestamp}
    /*Enter Data and capture Id for linking */
    data.wordId = []
    for(let i=0;i<data.words.length; i++){
      data.wordId.push(words.set(data.words[i]))
    }
    data.placeId = place.set(data.place)
    data.timeId = time.set(data.timestamp)
    data.textId = text.set(data.text)
    /* Link data with each other */
    data.timeId.set(data.textId)
    data.timeId.set(data.placeId)
    data.textId.set(data.timeId)
    data.textId.set(data.placeId)
    data.placeId.set(data.textId)
    data.placeId.set(data.timeId)
    for(let i=0;i<data.wordId;i++){
      data.timeId.set(data.wordId[i])
      data.textId.set(data.wordId[i])
      data.placeId.set(data.wordId[i])
      data.wordId[i].set(data.timeId)
      data.wordId[i].set(data.textId)
      data.wordId[i].set(data.placeId)
    }
  }
}

var twit = new Tweets()

var app = new Vue({
  el: "#cont",
  data: twit
})

console.log('ready');
/* Setup of the main roots */
var time = gun.get('time').put({label:'time'})
var text = gun.get('text').put({label:'text'})
var words = gun.get('words').put({label:'words'})
var place = gun.get('place').put({label:'place'})

ipcRenderer.send('ready', 'Window ready')

ipcRenderer.on('clientLog', (event, msg) => {
  console.log(msg);
})


/* Input: {
*"location":object,
*"coordinates": object,
*"timestamp":ms since 1968,
*"text":tweetText}*/

ipcRenderer.on('newTweet', (event, data) => {
  twit.tweets.push(data)
  twit.process(data)
})

var getAccess = function () {
  ipcRenderer.send('getStream', 'getStream received.')
}
