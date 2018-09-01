'use strict';

var BitMap = require("./bitmap.js")

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

module.exports = Registers;



