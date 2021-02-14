// imports
const {remote, shell} = require('electron')
const {dialog} = require('electron').remote
const Datastore = require('nedb')
const pdf = remote.require('pdf-parse')
const fs = require('fs')

// vars
var global_category = 'research'
var global_class = ''

// databases
var paperdb = new Datastore({ filename: 'database/database.bd', autoload: true })
var catebd = new Datastore({ filename: 'database/category.bd', autoload: true})

// utils
function spaceToBar(text) {
    return text.replace(/ /g, '-')
}