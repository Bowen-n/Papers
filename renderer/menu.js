
function paperBtnMenuTemplate(paper_btn) {
    var template = [
        {
            label: 'copy',
            accelerator: 'command+c',
            click: ()=>{ clipboard.writeText(paper_btn.innerHTML) }
        },
        {
            label: 'delete',
            click: ()=>{ _deletePaper(paper_btn) }
        }
    ]
    return template
}

