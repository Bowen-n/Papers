
function bindPaperlistFunc() {
    bindAddPapers()
    bindDeletePaper()
    bindSearchPaper()
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

function _deletePaper(paper_btn){
    // used in paper button right menu
    // selected paper may not be current_paper[0]
    paper_btn_id = paper_btn.getAttribute('id')
    paperdb.remove({_id: paper_btn_id})
    if(paper_btn_id == current_paper[0]){
        current_paper = []
        clearOverview()
    }
    
    displayPaperlist()
}

function deletePaper() {
    // used by delete button, a paper must be selected
    // selected paper must be current_paper[0]
    if(current_paper.length == 0){
        dialog.showMessageBox({
            type: 'warning',
            message: 'A paper must be selected.',
            buttons: ['OK']
        })
    }
    paperdb.remove({_id: current_paper[0]})
    current_paper = []
    displayPaperlist()
    clearOverview()
}

function bindDeletePaper() {
    document.querySelector('#delete-paper').onclick = ()=>{
        deletePaper()
    }
}

function searchGoogleScholarUrl(keywords) {
    return `https://scholar.google.com/scholar?hl=zh-CN&as_sdt=0%2C5&q=${keywords}&btnG=`
}

function _searchPaper(paper_btn) {
    paperdb.findOne({_id: paper_btn.getAttribute('id')}, (err, doc)=>{
        shell.openExternal(searchGoogleScholarUrl(doc.title))
    })
}

function searchPaper() {
    if(current_paper.length == 0){
        dialog.showMessageBox({
            type: 'warning',
            message: 'A paper must be selected.',
            buttons: ['OK']
        })
    }
    paperdb.findOne({_id: current_paper[0]}, (err, doc)=>{
        shell.openExternal(searchGoogleScholarUrl(doc.title))
    })
}

function bindSearchPaper() {
    document.querySelector('#search-paper').onclick = ()=>{
        searchPaper()
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
        paperdb.update({_id: current_paper[0]}, {$set: {title: this.innerHTML}}, {})
        displayPaperlist()
    })

    // disable paste with text style
    disableStylePaste(edit_title)
}

function bindEditUrl() {
    edit_url = document.querySelector('#url')
    edit_url.addEventListener('blur', function(){
        paperdb.update({_id: current_paper[0]}, {$set: {url: this.innerHTML}}, {})
    })
    disableStylePaste(edit_url)
}

function bindEditRemark() {
    edit_remark = document.querySelector('#remark')
    edit_remark.addEventListener('blur', function(){
        paperdb.update({_id: current_paper[0]}, {$set: {remark: this.innerHTML}}, {})
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
            var message = [current_paper, remote.getCurrentWindow().webContents.id]
            sub_win.webContents.send('msg', message)
        })
    })

    ipcRenderer.on('utags', (event, new_tags)=>{
        paperdb.update({_id: current_paper[0]}, {$set: {tags: new_tags}}, {}, ()=>{
            updateOverview(current_paper[0])
        })
    })
}