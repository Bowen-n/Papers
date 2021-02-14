const Datastore = require('nedb')
db = new Datastore({ filename: 'database.bd', autoload: true });

var doc1 = {
    title:'UNICORN: Runtime Provenance-Based Detector for Advanced Persistent Threats',
    author:null,
    url:null,
    path:'/Users/wubolun/Bowen/SJTU/Netsec&TS Lab/papers/apt/UNICORN Runtime Provenance-Based Detector for Advanced Persistent Threats.pdf',
    topic:'APT',
    research:'APT Detection',
    remark:null
};


var doc2 = {
    title:'An End-to-End Deep Learning Architecture for Graph Classification',
    author:null,
    url:null,
    path:'/Users/wubolun/Bowen/SJTU/Netsec&TS Lab/papers/gnn/AAAI_2018_DGCNN.pdf',
    topic:'GNN',
    research:'MCBG',
    remark:null
}

db.insert(doc1)
db.insert(doc2)

db.find({}, (err, docs)=>{
    console.log(docs)
})