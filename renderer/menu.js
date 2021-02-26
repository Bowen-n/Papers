
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
            label: 'Copy',
            click: ()=>{ clipboard.writeText(paper_btn.innerHTML) }
        },
        {
            label: 'Search',
            click: ()=>{ _searchPaper(paper_btn) }
        },
        {
            label: 'Delete',
            click: ()=>{ _deletePaper(paper_btn) }
        }
    ]
    return template
}

