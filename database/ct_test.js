const Datastore = require('nedb')
db = new Datastore({ filename: 'category.bd', autoload: true });

var doc1 = {
    class: 'topic',
    tags: ['GNN', 'APT', 'AI']
};

var doc2 = {
    class: 'research',
    tags: ['APT-Detection', 'MCBG']
}

db.insert(doc1)
db.insert(doc2)