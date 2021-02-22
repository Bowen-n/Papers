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
    var add_btn = document.querySelector('#add-paper')
    add_btn.onclick = ()=>{
        addPapers()
    }
}

function deletePaper(paper_btn) {
    var title = paper_btn.innerHTML
    paperdb.remove({title: title})
    // refresh paperlist
    document.querySelector('#'+spaceToBar(global_class)).click()
}

function removePaper(paper_btn) {
    var title = paper_btn.innerHTML

    update_doc = {}
    if(global_category == 'research'){
        update_doc.research = null
    } else if(global_category == 'topic'){
        update_doc.topic = null
    }

    paperdb.findOne({title: title}, (err, docs)=>{
        console.log(docs)
        if(global_category == 'research'){
            docs.research = null
        } else if(global_category == 'topic'){
            docs.topic = null
        }
        console.log(docs)

        if(docs.topic == null && docs.research == null){
            paperdb.remove({title: title})
        } else {
            paperdb.update({title: title}, docs, {})
        }

        // refresh paperlist
        document.querySelector('#'+spaceToBar(global_class)).click()
    })
}

function bindOverviewEditor() {
    bindEditTitle()
    bindEditUrl()
    bindEditRemark()
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