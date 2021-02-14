function extractAbstract(text) {
    // var pattern = /abstract([\s\S]*)introduction/i
    text = text.replace(/\n/g, ' ')

    start = text.search(/abstract/i)
    end = text.search(/introduction/i)
    if (start === -1 || end === -1){
        return null
    }

    abstract = text.substring(start+8, end).trim()
    abstract = abstract.substring(0, abstract.length-1)
    var pos = abstract.lastIndexOf('.', abstract.length)
    abstract = abstract.substring(0, pos+1).trim()

    while(abstract[0] == '—'){
        abstract = abstract.substring(1, abstract.length)
    }
    return abstract
}