'use strict';

var BitMap = require("./bitmap.js")
var IntervalTree = require('./interval-tree.js').IntervalTree;

var Memory = function() {
    this.memTaintTree = new IntervalTree();
}

Memory.prototype.taint = function(addr, size) {
    this.memTaintTree.add([addr, addr.add(size)]);
}

Memory.prototype.untaint = function(addr, size) {
    this.memTaintTree.remove([addr, addr.add(size)]);
}

Memory.prototype.toArray = function() {
    function helper(node, arr) {
        if(node === undefined) return arr;
        
        helper(node.left, arr);
        arr.push(node.interval);
        helper(node.right, arr);
        
        return arr;
    }
    
    return helper(this.memTaintTree.root, []);
}

Memory.prototype.fromRanges = function(ranges) {
    for(var i in ranges) {
        this.memTaintTree.add(ranges[i]);
    }
}

Memory.prototype.toBitMap = function(addr, size) {
    var inter = this.memTaintTree.intersection([addr, addr.add(size)]);
    var bmap = new BitMap(size);
    
    for(var i in inter) {
        for(var j = inter[i][0].sub(addr).toInt32(); j < inter[i][1].sub(addr).toInt32(); ++j) {
            bmap.set(j, true);
        }
    }
    
    return bmap;
}

module.exports = Memory;
