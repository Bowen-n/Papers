
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
                        dialog.showMessageBox({
                            type: 'warning',
                            message: 'Url is empty.',
                            buttons: ['OK']
                        })
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

