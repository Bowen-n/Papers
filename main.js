const {app, BrowserWindow, globalShortcut, Menu, dialog, shell} = require('electron')
const path = require('path')

function globalMenuTemplate(pWindow) {
    var globalMenuTemplate = [
        {
            role: 'appMenu'
        }, {
            label: 'Edit',
            submenu: [
                {
                    role: 'cut'
                }, {
                    role: 'copy'
                }, {
                    role: 'paste'
                }, {
                    role: 'pasteandmatchstyle'
                }, {
                    role: 'delete'
                }, {
                    role: 'selectall'
                }, {
                    type: 'separator'
                }, {
                    label: 'Add Topic Tag',
                    click() {
                        // global menu add tag
                        pWindow.webContents.send('gm_add_tag', 'topic')
                    }
                }, {
                    label: 'Add Research Tag',
                    click() {
                        pWindow.webContents.send('gm_add_tag', 'research')
                    }
                }, {
                    type: 'separator'
                }, {
                    label: 'Speech',
                    submenu: [
                        {
                            role: 'startspeaking'
                        }, {
                            role: 'stopspeaking'
                        }
                    ]
                }
            ]
        }, {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                }, {
                    type: 'separator'
                }, {
                    role: 'resetzoom'
                }, {
                    role: 'zoomin'
                }, {
                    role: 'zoomout'
                }, {
                    type: 'separator'
                }, {
                    role: 'togglefullscreen'
                }
            ]
        }, {
            role: 'windowMenu'
        }, {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () {
                        shell.openExternal('https://github.com/Bowenduan/Papers')
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

