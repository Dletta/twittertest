const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const url = require('url')
var twitter = require('ntwitter');



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
  twit.stream('statuses/filter', {'locations':'-122.670518,47.210218,-121.368207,48.181262'}, function(stream) {
    stream.on('error', function(err){
      console.log(`Got error: ${err}`);
    })

    stream.on('data', function (data) {
      var data = filterData(data)
      win.webContents.send('newTweet', data)
    });
  });
}

ipcMain.on('getStream', (event, msg) =>{
  console.log(msg);
  getStream()
})



/* Utility Functions */


/*
* Function that filters the data down to text, created_at and adds our own timestamp
*/

function filterData (data) {
  var temp = {}
  temp["location"] = data["place"]
  temp["coordinates"] = data["coordinates"]
  temp["timestamp"] = data["timestamp_ms"]
  temp["text"] = data["text"]
  return temp
}

/* Output: {
*"location":object,
*"coordinates": null or array of coordinates,
*"timestamp":ms since 1968,
*"text":tweetText}*/
