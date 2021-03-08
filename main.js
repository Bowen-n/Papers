const {app, BrowserWindow, globalShortcut, Menu, dialog} = require('electron')

var globalMenuTemplate = [
    {
        label: app.getName(),
        submenu: [
            {label: 'About Papers'},
            {
                label: 'Quit Papers',
                accelerator: 'Command+Q',
                click: ()=>{app.quit()}
            }
        ]
    }
]

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
    
    // Global Menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(globalMenuTemplate))

    // shortcuts
    // globalShortcut.register('F12', ()=>{
    //     pWindow.webContents.openDevTools()
    // })

}

app.on('ready', ()=>{
    createWindow()
})

