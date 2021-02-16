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