function createLibraryButton(content) {
    var library_btn = document.createElement('button')
    library_btn.setAttribute('class', 'library-button')
    library_btn.setAttribute('id', spaceToBar(content))
    library_btn.innerHTML = content
    return library_btn
}

function bindLibraryButton(library_btn) {
    var paperlist = document.querySelector('.paperlist')

    library_btn.onclick = function(){
        clearPaperList()
        clearOverview()
        global_class = library_btn.innerHTML

        paperdb.find(
            {$or: [{'research': this.innerHTML}, {'topic': this.innerHTML}]}, 
            (err, docs)=>{
            for(var j=0; j<docs.length; j++){
                var paper_btn = createPaperButton(docs[j].title)
                bindPaperButton(paper_btn)
                paperlist.appendChild(paper_btn)
            }
        })
    }
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

// display library according to category
// category: 'topic' or 'research'
function displayLibrary(category) {
    clearLibrary()
    clearOverview()
    var library = document.querySelector('.library')

    catebd.find({name: category}, (err, docs)=>{
        var topic_list = docs[0].content
        for(var i=0; i<topic_list.length; i++){
            var library_btn = createLibraryButton(topic_list[i])
            bindLibraryButton(library_btn)
            library.appendChild(library_btn)
        }
    })
}


window.onload = function() {

    displayLibrary(global_category)
    bindLibraryRightMenu()
    bindAddPapers()
    
}
