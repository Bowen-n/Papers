
function createLibraryButton(content, type) {
    var library_btn = document.createElement('span')
    library_btn.setAttribute('class', 'library-'+type+'-button')
    library_btn.setAttribute('id', spaceToBar(content))
    library_btn.innerHTML = content
    return library_btn
}

function bindLibraryButton(library_btn) {

    library_btn.onclick = function(){
        switch(library_btn.getAttribute('class')){
            case 'library-topic-button':{
                library_btn.setAttribute('class', 'library-topic-button-selected')
                tags_filter.push(library_btn.innerHTML)
                break
            }
            case 'library-topic-button-selected':{
                library_btn.setAttribute('class', 'library-topic-button')
                tags_filter.remove(library_btn.innerHTML)
                break
            }
            case 'library-research-button':{
                library_btn.setAttribute('class', 'library-research-button-selected')
                tags_filter.push(library_btn.innerHTML)
                break
            }
            case 'library-research-button-selected':{
                library_btn.setAttribute('class', 'library-research-button')
                tags_filter.remove(library_btn.innerHTML)
                break
            }
            default: break
        }

        current_paper = Object()
        displayPaperlist()
        clearOverview()
        
    }

    library_btn.addEventListener('contextmenu', (e)=>{
        e.preventDefault()
        var libraryBtnMenu = Menu.buildFromTemplate(
            libraryBtnMenuTemplate(library_btn))
        libraryBtnMenu.popup({window: remote.getCurrentWindow()})
    })
}

function createPaperButton(doc) {
    var paper_btn = document.createElement('span')
    paper_btn.setAttribute('class', 'paperlist-button')
    paper_btn.setAttribute('id', doc._id)
    paper_btn.innerHTML = doc.title
    return paper_btn
}

function bindPaperButton(paper_btn) {

    paper_btn.onclick = function(){
        if(clickFlag){
            clickFlag = clearTimeout(clickFlag)
        }
        clickFlag = setTimeout(()=>{
            if(paper_btn.getAttribute('class') == 'paperlist-button'){
                if(!isObjEmpty(current_paper)){
                    document.getElementById(current_paper.id).setAttribute('class', 'paperlist-button')
                    current_paper = Object()
                }
                paper_btn.setAttribute('class', 'paperlist-button-selected')
                current_paper.id = paper_btn.getAttribute('id')
                current_paper.title = paper_btn.innerHTML
            } else {
                paper_btn.setAttribute('class', 'paperlist-button')
            }

            updateOverview(paper_btn.getAttribute('id'))

        }, 120)
    }

    paper_btn.ondblclick = function(){
        if(clickFlag){
            clickFlag = clearTimeout(clickFlag)
        }
        paperdb.findOne({_id: paper_btn.getAttribute('id')}, (err, doc)=>{
            shell.openPath(doc.path)
        })
    }

    paper_btn.addEventListener('contextmenu', function(e){
        e.preventDefault()
        var paperBtnMenu = Menu.buildFromTemplate(
            paperBtnMenuTemplate(paper_btn))
        paperBtnMenu.popup({window: remote.getCurrentWindow()})
    })

}

function updateOverview(paper_id) {
    if(isObjEmpty(current_paper)){
        return
    }
    paperdb.findOne({_id: paper_id}, (err, doc)=>{
        // display overview
        document.querySelector('.overview-table').style.display = 'table'

        if(doc.abstract != null){
            document.querySelector('#abstract').innerHTML = doc.abstract
        } else {
            var dataBuffer = fs.readFileSync(doc.path);
            pdf(dataBuffer).then(data=>{
                var abstract = extractAbstract(data.text)
                document.querySelector('#abstract').innerHTML = abstract
                paperdb.update({_id: paper_id}, {$set: {abstract: abstract}}, {})
            }).catch((e)=>{
                showWarning(e.message)
            })
        }

        document.querySelector('#title').innerHTML = doc.title
        document.querySelector('#publisher').innerHTML = doc.publisher
        document.querySelector('#url').innerHTML = doc.url
        document.querySelector('#remark').innerHTML = doc.remark
        document.querySelector('#tags').innerHTML = displayList(doc.tags)
    })
}

function clearPaperList() {
    var paperlist = document.querySelector('.paperlist-paper')
    var paperlist_button = ['.paperlist-button', '.paperlist-button-selected']
    for(var i=0; i<paperlist_button.length; i++){
        var paper_btn_list = document.querySelectorAll(paperlist_button[i])
        for(var j=0; j<paper_btn_list.length; j++){
            paperlist.removeChild(paper_btn_list[j])
        }
    }
}

function clearLibrary() {
    var library_topic = document.querySelector('.library-topic')
    var library_research = document.querySelector('.library-research')
    var library_topic_btns = document.querySelectorAll('.library-topic-button')
    var library_research_btns = document.querySelectorAll('.library-research-button')
    for(var i=0; i<library_topic_btns.length; i++){
        library_topic.removeChild(library_topic_btns[i])
    }
    for(var j=0; j<library_research_btns.length; j++){
        library_research.removeChild(library_research_btns[j])
    }
}

function clearOverview() {
    // var overview = document.querySelector('.overview')
    var table = document.querySelector('.overview-table')
    table.style.display = 'none'
}

// display library
// topic tags and research tags
function displayLibrary() {
    clearLibrary()
    clearOverview()
    var library_topic = document.querySelector('.library-topic')
    var library_research = document.querySelector('.library-research')

    catedb.findOne({class: 'topic'}, (err, doc)=>{
        if(doc == null){
            return
        }
        var topic_tags = doc.tags
        for(var i=0; i<topic_tags.length; i++){
            var library_btn = createLibraryButton(topic_tags[i], 'topic')
            bindLibraryButton(library_btn)
            library_topic.appendChild(library_btn)
        }
    })

    catedb.findOne({class: 'research'}, (err, doc)=>{
        if(doc == null){
            return
        }
        var research_tags = doc.tags
        for(var i=0; i<research_tags.length; i++){
            var research_btn = createLibraryButton(research_tags[i], 'research')
            bindLibraryButton(research_btn)
            library_research.appendChild(research_btn)
        }
    })

    document.querySelector('.library').addEventListener('contextmenu', function(e){
        e.preventDefault()
        var libraryMenu = Menu.buildFromTemplate(libraryMenuTemplate())
        libraryMenu.popup({window: remote.getCurrentWindow()})
    })
}

function displayPaperlist() {
    clearPaperList()

    sub_query = []
    for(var i=0; i<tags_filter.length; i++){
        sub_query.push({tags: {$elemMatch: tags_filter[i]}})
    }
    query = {$and: sub_query}
    paperdb.find(query, (err, docs)=>{
        if(err){
            console.log(err)
            return
        }
        for(var i=0; i<docs.length; i++){
            paper_btn = createPaperButton(docs[i])
            bindPaperButton(paper_btn)
            document.querySelector('.paperlist-paper').appendChild(paper_btn)
        }
    })
    // tags_filter
}

window.onload = function() {

    // display two main parts
    displayLibrary()
    displayPaperlist()

    // func
    bindPaperlistFunc()

    // overview func
    bindOverviewEditor()

    bindIpcRenderer()

}
