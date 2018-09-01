'use strict';

var arch = require("./amd64.js");
var core = require("./core.js");

var memory = new core.Memory();
var regs = new core.Registers(arch);

regs.taint("rax")
memory.fromRanges(regs.toRanges("eax", ptr("0xaa00")))

console.log(JSON.stringify(memory.toArray()));

regs.fromBitMap("xmm0", memory.toBitMap(ptr("0xaa02"), 16))
memory.fromRanges(regs.toRanges("xmm0", ptr("0xbb00")))

console.log(JSON.stringify(memory.toArray()));
