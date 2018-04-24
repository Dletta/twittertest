var {ipcRenderer} = require('electron')

var Tweets = function () {
  this.tweets = []
  this.filteredTweets = []
  this.filtered = function(ev){
    var string = document.getElementById('search').value
    console.log(string);
    if(string == "*" || ""){
      this.filteredTweets = this.tweets
    } else {
      this.filteredTweets = this.tweets.filter((el) => {
        return el.label.toLowerCase().indexOf(string.toLowerCase()) > -1
      })
    }
  }
  this.time = function(ev){
    var string = document.getElementById('time').value
    console.log(string);
    if(string == "*" || ""){
      this.filteredTweets = this.tweets
    } else {
      this.filteredTweets = this.tweets.filter((el) => {
        return el.time[0].toLowerCase().indexOf(string.toLowerCase()) > -1
      })
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

function compare(a, b) {
  if(a.time.length>b.time.length){
      return -1
  } else if(b.time.length > a.time.length) {
    return 1
  } else {
    return 0
  }
}

ipcRenderer.on('newTweet', (event, data) => {
  data.sort(compare)
  twit.tweets = data
})

var getAccess = function () {
  ipcRenderer.send('getStream', 'getStream received.')
}
