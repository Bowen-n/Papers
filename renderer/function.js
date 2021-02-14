function addPapers() {
    if(global_class == ''){
        dialog.showMessageBox({
            type: 'warning',
            message: 'Please select a class first.'
        })
        return
    }

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
                remark: null
            }
            if(global_category == 'research'){
                new_doc.research = global_class
                new_doc.topic = null
            } else if(global_category == 'topic'){
                new_doc.research = null
                new_doc.topic = global_class
            }
            paperdb.insert(new_doc)
        }

        // refresh paperlist
        document.querySelector('#'+spaceToBar(global_class)).click()
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