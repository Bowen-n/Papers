const {app, BrowserWindow, globalShortcut, Menu, dialog} = require('electron')
const path = require('path')

function globalMenuTemplate(pWindow) {
    var globalMenuTemplate = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: 'About Papers',
                    click: ()=>{app.showAboutPanel()}
                }, {
                    label: 'Quit Papers',
                    accelerator: 'Command+Q',
                    click: ()=>{app.quit()}
                }
            ]
        }, {
            label: 'Edit',
            submenu: [
                {
                    label: 'Add Topic Tag',
                    click: ()=>{
                        // global menu add tag
                        pWindow.webContents.send('gm_add_tag', 'topic')
                    }
                }, {
                    label: 'Add Research Tag',
                    click: ()=>{
                        pWindow.webContents.send('gm_add_tag', 'research')
                    }
                }, {
                    label: '表情与符号',
                    accelerator: 'Option',
                    click: ()=>{
                        app.showEmojiPanel()
                    }
                }
            ]
        }
    ]
    return globalMenuTemplate
}


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
    Menu.setApplicationMenu(Menu.buildFromTemplate(globalMenuTemplate(pWindow)))

    // shortcuts
    globalShortcut.register('F12', ()=>{
        pWindow.webContents.openDevTools()
    })

}

function configure(){
    app.setName('Papers')

    app.setAboutPanelOptions({
        'applicationName': app.getName(),
        'applicationVersion': app.getVersion(),
        'authors': 'Bolun Wu',
    })
}

app.on('ready', ()=>{
    configure()
    createWindow()
})

