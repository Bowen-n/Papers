const {app, BrowserWindow, globalShortcut, Menu, dialog} = require('electron')

function createWindow () {

    var pWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1000,
        webPreferences: {
        nodeIntegration: true,
        enableRemoteModule:true
      }
    })
    pWindow.loadFile('html/index.html')
    pWindow.on('close', ()=>{
        pWindow = null
    })
    
    // shortcuts
    globalShortcut.register('F12', ()=>{
        pWindow.webContents.openDevTools()
    })

}

app.on('ready', ()=>{
    createWindow()
})

