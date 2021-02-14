// library right menu
function libraryRightMenu() {
    var menu_template = [
        {
            label: 'New Class',
            accelerator: 'command+z'
        },
        {
            label: 'Change Category',
            click: ()=>{
                if(global_category === 'research'){
                    global_category = 'topic'
                } else if (global_category === 'topic') {
                    global_category = 'research'
                }
                displayLibrary(global_category)
            }
        }
    ]
    var menu = remote.Menu.buildFromTemplate(menu_template)
    menu.popup({window: remote.getCurrentWindow()})
}

function bindLibraryRightMenu() {
    var library = document.querySelector('.library')
    library.addEventListener('contextmenu', (e)=>{
        e.preventDefault()
        libraryRightMenu()
    })
}