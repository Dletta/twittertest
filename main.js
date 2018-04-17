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
      var data = filterData(data)
      win.webContents.send('newTweet', data)
      var data = JSON.stringify(data) + os.EOL
      /*
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
{"created_at":"Fri Mar 16 15:29:01 +0000 2018","id":974668868110073900,"id_str":"974668868110073856","text":"@TravisMayfield THAT SURECWASCA QUICK VACATION TRAVIS.✌","display_text_range":[16,55],"source":"<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":974644716871405600,"in_reply_to_status_id_str":"974644716871405568","in_reply_to_user_id":23519114,"in_reply_to_user_id_str":"23519114","in_reply_to_screen_name":"TravisMayfield","user":{"id":3065115373,"id_str":"3065115373","name":"Stanley Bedker","screen_name":"slbedker","location":"Seattle, WA","url":null,"description":"single Christian man.","translator_type":"none","protected":false,"verified":false,"followers_count":50,"friends_count":271,"listed_count":1,"favourites_count":4036,"statuses_count":834,"created_at":"Fri Mar 06 15:34:09 +0000 2015","utc_offset":null,"time_zone":null,"geo_enabled":true,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://abs.twimg.com/images/themes/theme1/bg.png","profile_background_image_url_https":"https://abs.twimg.com/images/themes/theme1/bg.png","profile_background_tile":false,"profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"profile_image_url":"http://pbs.twimg.com/profile_images/966746575610331136/MJGxUcOW_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/966746575610331136/MJGxUcOW_normal.jpg","default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":{"id":"300bcc6e23a88361","url":"https://api.twitter.com/1.1/geo/id/300bcc6e23a88361.json","place_type":"city","name":"Seattle","full_name":"Seattle, WA","country_code":"US","country":"United States","bounding_box":{"type":"Polygon","coordinates":[[[-122.436232,47.495315],[-122.436232,47.734319],[-122.224973,47.734319],[-122.224973,47.495315]]]},"attributes":{}},"contributors":null,"is_quote_status":false,"quote_count":0,"reply_count":0,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[],"urls":[],"user_mentions":[{"screen_name":"TravisMayfield","name":"Travis Mayfield 🌈🔥","id":23519114,"id_str":"23519114","indices":[0,15]}],"symbols":[]},"favorited":false,"retweeted":false,"filter_level":"low","lang":"en","timestamp_ms":"1521214141286"}

/* Utility Function */

/*
* Object that receives text as input.
* We call it's process function periodically to process one text item to words
* Another process will sort words with timestamps. Input is the timestamp with text from tweet.
*/
var gObject = function () {
  this.input = []
  this.output = []
  this.process = function() {
    if(this.input.length > 1){
        var data = this.input.shift()
    }
  }
}

function filterData (data) {
  var temp = {}
  temp["created_at"] = data["created_at"]
  temp["timestamp"] = new Date()
  temp["text"] = data["text"]
  return temp
}
