
function bindPaperlistFunc() {
    bindAddPapers()
    bindDragDropPapers()
    bindDeletePaper()
    bindSearchPaper()
}

function _addPaperToDatabase(title, path) {
    var new_doc = {
        title: title,
        author: null,
        abstract: null,
        publisher: null,
        url: null,
        path: path,
        tags: [],
        remark: null
    }
    paperdb.insert(new_doc)
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
            _addPaperToDatabase(title_path, filepath_list[i])
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

function bindDragDropPapers() {
    var paperlist = document.querySelector('.paperlist-paper')

    paperlist.addEventListener('dragover', function(e){
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
        this.setAttribute('id', 'paper-drag')
    })

    paperlist.addEventListener('dragleave', function(e){
        this.setAttribute('id', 'paper-no-drag')
    })

    paperlist.addEventListener('drop', function(e){
        this.setAttribute('id', 'paper-no-drag')
        var files = e.dataTransfer.files
        for(var i=0; i<files.length; i++){
            _addPaperToDatabase(files[i].name, files[i].path)
        }
        displayPaperlist()
    })
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
        showWarning('A paper must be selected.')
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
        showWarning('A paper must be selected.')
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
    bindEditAbstract()
    bindEditPublisher()
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

function bindEditAbstract() {
    edit_abstract = document.querySelector('#abstract')
    edit_abstract.addEventListener('blur', function(){
        paperdb.update({_id: current_paper[0]}, {$set: {abstract: this.innerHTML}}, {})
    })
    disableStylePaste(edit_abstract)
}

function bindEditPublisher() {
    edit_publisher = document.querySelector('#publisher')
    edit_publisher.addEventListener('blur', function(){
        paperdb.update({_id: current_paper[0]}, {$set: {publisher: this.innerHTML}}, {})
    })
    disableStylePaste(edit_publisher)
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

function addGlobalTag(type) {
    var sub_win = new remote.BrowserWindow({
        width: 500, minWidth: 500,
        height: 300, minHeight: 300,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    sub_win.loadFile('./html/add_tag.html')
    sub_win.webContents.on('did-finish-load', ()=>{
        var message = {
            type: type,
            win_id: remote.getCurrentWindow().webContents.id
        }
        sub_win.webContents.send('msg', message)
        sub_win.on('close', ()=>{
            sub_win = null
        })
    })

    ipcRenderer.on('global_tags', (event, msg)=>{
        var tag_type = msg.type
        var new_tag = msg.new_tag
        var sub_win_id = msg.win_id
        console.log(tag_type)
        catedb.update({class: tag_type}, {$push: {tags: new_tag}}, {}, (err)=>{
            ipcRenderer.sendTo(sub_win_id, 'status', new_tag)
            displayLibrary()
        })
    })
}