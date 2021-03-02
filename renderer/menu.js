
function paperBtnMenuTemplate(paper_btn) {
    var template = [
        {
            label: 'Open',
            click: ()=>{
                paperdb.findOne({title: paper_btn.innerHTML}, (err, doc)=>{
                    shell.openPath(doc.path)
                })
            }
        },

        {
            label: 'Open Url',
            click: ()=>{ 
                paperdb.findOne({title: paper_btn.innerHTML}, (err, doc)=>{
                    if(doc.url == null){
                        showWarning('Url is empty.')
                    } else {
                        shell.openExternal(doc.url)
                    }
                })
            }
        },

        {
            label: 'Copy Title',
            click: ()=>{ clipboard.writeText(paper_btn.innerHTML) }
        },

        {
            label: 'Delete',
            click: ()=>{ _deletePaper(paper_btn) }
        },

        {
            label: 'Search in Google Scholar',
            click: ()=>{ _searchPaper(paper_btn) }
        },
    ]
    return template
}

function libraryMenuTemplate(){
    var template = [
        {
            label: 'Add Tag',
            submenu: [
                {
                    label: 'Add Topic Tag',
                    click: ()=>{ addGlobalTag('topic') }
                },
                {
                    label: 'Add Research Tag',
                    click: ()=>{ addGlobalTag('research')}
                }
            ]
        }
    ]
    return template
}
