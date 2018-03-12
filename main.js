const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'b4evMsxPWWbofvf0VaXxQH8UJ',
  consumer_secret: 'KE5j1olB0inA1fnfFsVdD9EeiMh59tcjFGweadUl5U1YzwzlFh',
  access_token_key: '2557688262-RmsnZO41C18Cq2PEqLJj8Hy5IHucAoTkzmxOQRh',
  access_token_secret: ' s7DQkoEH9tWx1j4dZkI377XkazP0Iw9RGTveFyC7RAp0j'
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
<<<<<<< HEAD
  twit.stream('statuses/filter', {'locations':'-122.5731,47.2662,-121.918,47.8685'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
=======
  /*twit.search('Seattle OR Seattle Museum', {}, function(err, data) {
    console.log(err);
    win.webContents.send('newTweet', data)
  });*/
  twit.stream('statuses/filter', {'track':'seattle art museum'}, function(stream) {
    stream.on('data', function (data) {
      win.webContents.send('newTweet', data)
>>>>>>> a5e27bf0179beea9534f5a6092467edfa1fc4ddd
    });
  });
}

ipcMain.on('getStream', (event, msg) =>{
  console.log(msg);
  getStream()
})
