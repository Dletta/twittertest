var {ipcRenderer} = require('electron')
const util = require('util')



var Tweets = function () {
  this.tweets = []
  this.time = []
  this.place = []
  this.word = []
  this.text = []
  this.process = function(data) {
    /* Split text into words
    */
    data.words = data.text.split(" ")
    /*Enter Data, link with ID which is string or number */
    place.get(data.place["full_name"]).put({type:"node", data:data.place})
    time.get(data.timestamp).put({type:"node", data:data.timestamp})
    text.get(data.text).put({type:"node", data:data.text})
    for(let i=0;i<data.words.length;i++){
      words.get(data.words[i]).put({type:"node",data:data.words[i]})
    }

    linkItem(data.place["full_name"], place, data.timestamp, time)

    linkItem(data.place["full_name"], place, data.text, text)

    linkItem(data.timestamp, time, data.text, text)

    for(let i=0;i<data.words.length;i++){

      linkItem(data.words[i], words, data.timestamp, time)

      linkItem(data.words[i], words, data.text, text)

      linkItem(data.words[i], words, data.place["full_name"], place)
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

var time = gun.get('time').put({type:'root'})
var text = gun.get('text').put({type:'root'})
var words = gun.get('words').put({type:'root'})
var place = gun.get('place').put({type:'root'})
/* Setting up Graph */
var nodes = new vis.DataSet([
  {id:"Gun",label:"Root"},
  {id:"15252",label:"15252"},
])

var edges = new vis.DataSet([
  {from:"Gun", to:"15252"}
])

var cont = document.getElementById('mynetwork')

var graphData = {
  nodes: nodes,
  edges: edges
}
var options = {}
var network = new vis.Network(cont, graphData,options)

/* Main JS communication events */

ipcRenderer.send('ready', 'Window ready')

ipcRenderer.on('clientLog', (event, msg) => {
  console.log(msg);
})


/* Input: {
*"place":object,
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
