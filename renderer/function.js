function bindPaperlistFunc() {
    bindAddPapers()
    bindDeletePaper()
}

function addPapers() {

    dialog.showOpenDialog({
        message: 'Select papers',
        filters: [{name: 'paper', extensions: ['pdf']}],
        properties: ['openFile', 'multiSelections']
    }).then(result=>{

        filepath_list = result.filePaths
        for(var i=0; i<filepath_list.length; i++){
            var splitted = filepath_list[i].split('/')
            var title_path = splitted[splitted.length-1]

            var new_doc = {
                title: title_path,
                author: null, url: null,
                path: filepath_list[i],
                tags: [],
                remark: null
            }

            paperdb.insert(new_doc)
        }

        // refresh paperlist
        displayPaperlist()

    }).catch(err=>{
        console.log(err)
    })
}

function bindAddPapers() {
    document.querySelector('#add-paper').onclick = ()=>{
        addPapers()
    }
}

function deletePaper() {
    paperdb.remove({title: current_paper[0]})
    // refresh paperlist
    displayPaperlist()
}

function bindDeletePaper() {
    document.querySelector('#delete-paper').onclick = ()=>{
        deletePaper()
    }
}

function bindOverviewEditor() {
    bindEditTitle()
    bindEditUrl()
    bindEditRemark()
    bindEditTags()
}

function disableStylePaste(dom) {
    dom.addEventListener('paste', function(e){
        e.preventDefault()
        var text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    })
}

function bindEditTitle() {
    edit_title = document.querySelector('#title')
    edit_title.addEventListener('blur', function(){
        new_title = this.innerHTML
        old_title = current_paper[0]        
        current_paper = [new_title]
        paperdb.update({title: old_title}, {$set: {title: new_title}}, {})
        displayPaperlist()
    })

    // disable paste with text style
    disableStylePaste(edit_title)
}

function bindEditUrl() {
    edit_url = document.querySelector('#url')
    edit_url.addEventListener('blur', function(){
        paperdb.update({title: current_paper[0]}, {$set: {url: this.innerHTML}}, {})
    })
    disableStylePaste(edit_url)
}

function bindEditRemark() {
    edit_remark = document.querySelector('#remark')
    edit_remark.addEventListener('blur', function(){
        paperdb.update({title: current_paper[0]}, {$set: {remark: this.innerHTML}}, {})
    })
    disableStylePaste(edit_remark)
}

function bindEditTags() {
    edit_tags = document.querySelector('#tags-add-icon')
    edit_tags.addEventListener('click', function(){
        var sub_win = new remote.BrowserWindow({
            width: 1000, minWidth: 600,
            height: 700, minHeight: 300,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule:true
            }
        })
        sub_win.loadFile('./html/edit_tags.html')
        sub_win.webContents.on('did-finish-load', ()=>{
            sub_win.webContents.send('msg', current_paper)
        })
    })
}