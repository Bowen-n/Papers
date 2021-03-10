// imports
const {remote, shell, ipcRenderer, clipboard} = require('electron')
const {Menu, dialog} = require('electron').remote
const Datastore = require('nedb')
const pdf = remote.require('pdf-parse')
const fs = require('fs')
var path = require('path')

// vars
var tags_filter = []
var current_paper = Object()
var clickFlag = null

// databases
var paperdb = new Datastore({ filename: path.resolve(__dirname, '../database/database.bd'), autoload: true })
var catedb = new Datastore({ filename: path.resolve(__dirname, '../database/category.bd'), autoload: true})

// utils
function spaceToBar(text) {
    text = text.replace(/ /g, '-')
	text = text.replace(/\./g, '-')
	text = text.replace(/:/g, '-')
	return text
}

function displayList(list) {
	var ret_str = ''
	for(var i=0; i<list.length; i++){
		ret_str = ret_str + list[i] + ' '
	}
	return ret_str
}

function showWarning(message) {
	dialog.showMessageBox({
		type: 'warning',
		message: message,
		buttons: ['OK']
	})
}

function isObjEmpty(obj){
	if(Object.keys(obj).length === 0){
		return true
	} else {
		return false
	}
}

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
