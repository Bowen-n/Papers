// imports
const {remote, shell} = require('electron')
const {dialog} = require('electron').remote
const Datastore = require('nedb')
const pdf = remote.require('pdf-parse')
const fs = require('fs')

// vars
var global_category = 'research'
var global_class = ''
var tags_filter = []

// databases
var paperdb = new Datastore({ filename: 'database/database.bd', autoload: true })
var catedb = new Datastore({ filename: 'database/category.bd', autoload: true})

// utils
function spaceToBar(text) {
    return text.replace(/ /g, '-')
}

// prototype
String.prototype.format = function (args) {
    return this.replace(/\{(\w+)\}/g, function (s, i) {
        return args[i];
    });
};

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)	{ 
			return i;
		};
	}
	return -1; 
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};


