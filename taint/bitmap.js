'use strict';

//https://gist.github.com/binarymax/ab3e917c170ca95268e5

//------------------------------------------
//Compact BitMap datastructure
//Memory efficient array of bool flags
var BitMap = function(size){
	this._cols  = 8;
	this._shift = 3;
	this._rows  = (size>>this._shift)+1;
	this._buf   = new ArrayBuffer(this._rows);
	this._bin   = new Uint8Array(this._buf);
};

//Gets the bool at offset
BitMap.prototype.get = function(off){
	var row = off>>this._shift;
	var col = off%this._cols;
	var bit = 1<<col;
	return (this._bin[row]&bit)>0;
};

//Sets a bit at offset to bool
BitMap.prototype.set = function(off,bool){
	var row = off>>this._shift;
	var col = off%this._cols;
	var bit = 1<<col;
	if (bool) {
		this._bin[row] |= bit;
	} else {
		bit = 255 ^ bit;
		this._bin[row] &= bit;
	}
};

//Flip a single bit at offset
BitMap.prototype.flip = function(off){
	var row = Math.floor(off/this._cols);
	var col = off%this._cols;
	var bit = 1<<col;
	this._bin[row] ^= bit;
};

//Reset to all 1's
BitMap.prototype.fill = function() {
	for(var i=0;i<this._rows;i++) {
		this._bin[i] = 255;
	}
};

//Reset to all 0's
BitMap.prototype.clear = function() {
	for(var i=0;i<this._rows;i++) {
		this._bin[i] = 0;
	}
};

module.exports = BitMap;


