function createLibraryButton(content, type) {
    var library_btn = document.createElement('span')
    library_btn.setAttribute('class', 'library-button')
    library_btn.setAttribute('id', spaceToBar(content))
    library_btn.setAttribute('type', type)
    library_btn.setAttribute('status', 'up')
    library_btn.innerHTML = content
    return library_btn
}

function bindLibraryButton(library_btn) {
    var paperlist = document.querySelector('.paperlist')

    library_btn.onclick = function(){
        if(library_btn.getAttribute('type') == 'topic'){
            if(library_btn.getAttribute('status') == 'up'){
                library_btn.setAttribute('status', 'down')
                library_btn.setAttribute('style', 
                'color:white; background-color: rgb(241, 150, 82);')
                tags_filter.push(library_btn.innerHTML)
            } else {
                library_btn.setAttribute('status', 'up')
                library_btn.setAttribute('style', 
                'color:rgb(112, 112, 112); background-color: transparent')
                tags_filter.remove(library_btn.innerHTML)
            }
        } else {
            if(library_btn.getAttribute('status') == 'up'){
                library_btn.setAttribute('status', 'down')
                library_btn.setAttribute('style',
                'color:white; background-color: rgb(79, 142, 247);')
                tags_filter.push(library_btn.innerHTML)
            } else {
                library_btn.setAttribute('status', 'up')
                library_btn.setAttribute('style', 
                'color:rgb(112, 112, 112); background-color: transparent')
                tags_filter.remove(library_btn.innerHTML)
            }
        }
    }
    // library_btn.onclick = function(){
    //     clearPaperList()
    //     clearOverview()
    //     global_class = library_btn.innerHTML

    //     paperdb.find(
    //         {$or: [{'research': this.innerHTML}, {'topic': this.innerHTML}]}, 
    //         (err, docs)=>{
    //         for(var j=0; j<docs.length; j++){
    //             var paper_btn = createPaperButton(docs[j].title)
    //             bindPaperButton(paper_btn)
    //             paperlist.appendChild(paper_btn)
    //         }
    //     })
    // }
}

function createPaperButton(content) {
    var paper_btn = document.createElement('button')
    paper_btn.setAttribute('class', 'paperlist-button')
    paper_btn.setAttribute('id', spaceToBar(content))
    paper_btn.innerHTML = content
    return paper_btn
}

function bindPaperButton(paper_btn) {
    var abstract_p = document.querySelector('#abstract')
    var table = document.querySelector('.overview-table')
    var delete_btn = document.querySelector('#delete-paper')
    var remove_btn = document.querySelector('#remove-paper')

    paper_btn.onclick = function(){
        paperdb.findOne({title: this.innerHTML}, (err, docs)=>{
            table.style.display = 'table' // display paper info
            
            var dataBuffer = fs.readFileSync(docs.path);
            pdf(dataBuffer).then(data=>{
                var abstract = extractAbstract(data.text)
                abstract_p.innerHTML = abstract
            })

            delete_btn.onclick = function(){
                deletePaper(paper_btn)
            }

            remove_btn.onclick = function(){
                removePaper(paper_btn)
            }
        })
    }
}

function clearPaperList() {
    var paperlist = document.querySelector('.paperlist')
    var paper_btn_list = document.querySelectorAll('.paperlist-button')
    for(var j=0; j<paper_btn_list.length; j++){
        paperlist.removeChild(paper_btn_list[j])
    }
}

function clearLibrary() {
    var library = document.querySelector('.library')
    var library_btn_list = document.querySelectorAll('.library-button')
    for(var j=0; j<library_btn_list.length; j++){
        library.removeChild(library_btn_list[j])
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
    // clearLibrary()
    clearOverview()
    var library_topic = document.querySelector('.library-topic')
    var library_research = document.querySelector('.library-research')

    catedb.findOne({class: 'topic'}, (err, doc)=>{
        var topic_tags = doc.tags
        for(var i=0; i<topic_tags.length; i++){
            var library_btn = createLibraryButton(topic_tags[i], 'topic')
            bindLibraryButton(library_btn)
            library_topic.appendChild(library_btn)
        }
    })

    catedb.findOne({class: 'research'}, (err, doc)=>{
        var research_tags = doc.tags
        for(var i=0; i<research_tags.length; i++){
            var research_btn = createLibraryButton(research_tags[i], 'research')
            bindLibraryButton(research_btn)
            library_research.appendChild(research_btn)
        }
    })
}


window.onload = function() {

    displayLibrary()
    bindLibraryRightMenu()
    bindAddPapers()
    
}
