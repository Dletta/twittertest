var {ipcRenderer} = require('electron')

var Tweets = function () {
  this.tweets = []
  this.add = function (item) {
    if(this.tweets.length < 10) {
      this.tweets.push(item)
    } else {
      this.tweets.shift()
      this.tweets.push(item)
    }
  }
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

ipcRenderer.on('newTweet', (event, data) => {
  twit.tweets = data
})

var getAccess = function () {
  ipcRenderer.send('getStream', 'getStream received.')
}
