const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const url = require('url')
var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'b4evMsxPWWbofvf0VaXxQH8UJ',
  consumer_secret: 'KE5j1olB0inA1fnfFsVdD9EeiMh59tcjFGweadUl5U1YzwzlFh',
  access_token_key: '2557688262-RmsnZO41C18Cq2PEqLJj8Hy5IHucAoTkzmxOQRh',
  access_token_secret: 's7DQkoEH9tWx1j4dZkI377XkazP0Iw9RGTveFyC7RAp0j'
});

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'view/index.html'),
    protocol: 'file',
    slashes: true
  }))

  /* devtools */
  win.webContents.openDevTools()

  win.on('closed', () => {
    win=null
  })
}

// Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })


app.on('ready', createWindow)
console.log('ready');

ipcMain.on('ready', (event, msg) =>{
  console.log(msg);
  event.sender.send('clientLog', 'handshake complete.')
})

function getStream () {
  /*twit.search('Seattle OR Seattle Museum', {}, function(err, data) {
    console.log(err);
    win.webContents.send('newTweet', data)
  });*/
  twit.stream('statuses/filter', {'locations':'-122.670518,47.210218,-121.368207,48.181262'}, function(stream) {
    stream.on('error', function(err){
      console.log(`Got error: ${err}`);
    })

    stream.on('data', function (data) {
      var data = filterData(data) /* removed columns that are not necessary for trending data and add our own timestamp */
      Words.input.push(data)

      /*
      var data = JSON.stringify(data) + os.EOL
      fs.appendFile('tweetsSeattle.txt', data, (err)=>{
        if (err) throw err;
      })
      */
    });
  });
}

ipcMain.on('getStream', (event, msg) =>{
  console.log(msg);
  getStream()
})


/*
* Example Tweet after Filter
{"created_at":"Fri Mar 16 15:29:01 +0000 2018","text":"@TravisMayfield THAT SURECWASCA QUICK VACATION TRAVIS.✌","timestamp":"2018-03-16 7:29:01"}
*/

/* Utility Functions */

/*
* Object that receives text as input.
* We call it's process function periodically to process one text item to words
* Another process will sort words with timestamps. Input is the timestamp with text from tweet.
*/
var gWordFactory = function () {
  this.input = []
  this.process = function() {
    if(this.input.length >= 1 ){
        var data = this.input.shift()
        var time = data["timestamp"]
        var words = []
        words = data["text"].split(" ")
        if(words.length >= 1){
          for(let i=0;i<words.length;i++){
            var temp = {}
            temp["label"] = words[i]
            temp["time"] = time
            Data.input.push(temp)
          }
        }
    }
  }
}

/* Output is {label: word, time: timestring} */

var gDataFactory = function () {
  this.input = []
  this.words = []
  this.process = function() {
    if(this.input.length >= 1) {
      var data = this.input.shift()
      if(this.words.length >= 1){
        if(this.words.some(e => e.label == data.label)){
          this.words.forEach(elem => {
            if(elem.label == data.label ){
              elem.time.push(data.time)
            }
          })
        } else {
          var temp = new DataRecord(data.label)
          temp.time.push(data.time)
          this.words.push(temp)
        }
      } else {
        var temp = new DataRecord(data.label)
        temp.time.push(data.time)
        this.words.push(temp)
      }
    }
  win.webContents.send('newTweet', this.words)
  }
}

var DataRecord = function(lab) {
  this.label = lab
  this.time = []
}

var Words = new gWordFactory()

function processWords (){
  Words.process()
}

var Data = new gDataFactory()

function processData() {
  Data.process()
}

setInterval(processWords, 1000)
setInterval(processData, 1000)

/*
* Function that filters the data down to text, created_at and adds our own timestamp
*/

function filterData (data) {
  var temp = {}
  temp["created_at"] = data["created_at"]
  temp["timestamp"] = new Date().toString()
  temp["text"] = data["text"]
  return temp
}
