const Datastore = require('nedb')
db = new Datastore({ filename: 'category.bd', autoload: true });

var doc1 = {
    name: 'topic',
    content: ['GNN', 'APT']
};

var doc2 = {
    name: 'research',
    content: ['APT Detection', 'MCBG']
}

db.insert(doc1)
db.insert(doc2)