var {ipcRenderer} = require('electron')

var Tweets = function () {
  this.tweets = []
}

var twit = new Tweets()

var app = new Vue({
  el: "#cont",
  data: twit
})

console.log('ready');

ipcRenderer.send('ready', 'Window ready')

ipcRenderer.on('clientLog', (event, msg) => {
  console.log(msg);
})


/* Input: {
*"location":object,
*"coordinates": null or array of coordinates,
*"timestamp":ms since 1968,
*"text":tweetText}*/

ipcRenderer.on('newTweet', (event, data) => {
  twit.tweets.push(data)
})

var getAccess = function () {
  ipcRenderer.send('getStream', 'getStream received.')
}
