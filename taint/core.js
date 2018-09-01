'use strict';

var BitMap = require("./bitmap.js")
var IntervalTree = require('./interval-tree.js').IntervalTree;

var Registers = function(arch) {
    this.arch = arch;
    this.regTaintMap = new BitMap(arch.space + 32); //+32 for safe cast
}

Registers.prototype.taint = function(reg) {
    var rm = this.arch.registers[reg];
    for(var i = rm[0]; i < (rm[0] + rm[1]); ++i)
        this.regTaintMap.set(i, true);
}

Registers.prototype.untaint = function(reg) {
    var rm = this.arch.registers[reg];
    for(var i = rm[0]; i < (rm[0] + rm[1]); ++i)
        this.regTaintMap.set(i, false);
}

Registers.prototype.toRanges = function(reg, base) {
    var rm = this.arch.registers[reg];
    var ranges = [];
    for(var i = 0; i < rm[1]; ++i) {
        if(this.regTaintMap.get(rm[0] + i)) {
            var addr = base.add(i);
            
            if(ranges.length === 0) {
                ranges.push([addr, addr]);
            }
            if(ranges[ranges.length -1][1].equals(addr))
                ranges[ranges.length -1][1] = addr.add(1);
            else {
                ranges.push([addr, addr.add(1)]);
            }
        }
    }
    return ranges;
}

Registers.prototype.spread = function(destReg, srcReg) {
    var rm0 = this.arch.registers[destReg];
    var rm1 = this.arch.registers[srcReg];
    for(var i = 0; i < rm0[1]; ++i)
        this.regTaintMap.set(rm0[0] + i, this.regTaintMap.get(rm1[0] + i));
}

Registers.prototype.fromBitMap = function(reg, bmap) {
    var rm = this.arch.registers[reg];
    for(var i = 0; i < rm[1]; ++i)
        this.regTaintMap.set(i + rm[0], bmap.get(i));
}



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

exports.Memory = Memory;
exports.Registers = Registers;


