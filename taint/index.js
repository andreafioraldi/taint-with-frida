'use strict';

var arch = require("./amd64.js");
var core = require("./core.js");

var memory = new core.Memory();
var regs = new core.Registers(arch);

function scaleSHL(addr, scale) {
    switch(scale) {
        case 1:
        return addr;
        case 2:
        return addr.shl(1);
        case 4:
        return addr.shl(2);
        case 8:
        return addr.shl(3);
    }
}


function movRegMem(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = operands[0].value;
    var op1 = operands[1].value;
    var size0 = operands[0].size;
    
    if(op1.base === undefined)
        return;
    
    var addr = ctx[op1.base].add(op1.disp); //ex. ctx["rip"] + 0x32
    if(op1.index !== undefined)
        addr = addr.add(scaleSHL(ctx[op1.index], op1.scale));
    
    //if(memory.isTainted(addr, size0)) console.log(instr.address + "   " + instr);
    
    regs.fromBitMap(op0, memory.toBitMap(addr, size0));
}

function movMemReg(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = operands[0].value;
    var op1 = operands[1].value;
    
    //var size1 = operands[1].size;
    
    if(op0.base === undefined)
        return;
    
    var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
    if(op0.index !== undefined)
        addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));
    
    //if(regs.isTainted(op1)) console.log("write " + instr.address + "   " + instr);
    
    memory.fromRanges(regs.toRanges(op1, addr));
}

function movRegReg(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = operands[0].value;
    var op1 = operands[1].value;
    
    regs.spread(op0, op1);
}

function movRegImm(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value
    
    regs.untaint(op0);
}

function movMemImm(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = instr.operands[0].value;
    var size1 = instr.operands[1].size;
    
    if(op0.base === undefined)
        return;
    
    var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
    if(op0.index !== undefined)
        addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));
    
    memory.untaint(addr, size1);
}

function startTracing() {
    Stalker.follow(Process.getCurrentThreadId(), {
        transform: function (iterator) {
          var instr = iterator.next();
          
          try {
              do {
                var operands = instr.operands;
                //if(instr.mnemonic.startsWith("mov")) {
                if(operands.length == 2) {
                    var mnemonic = instr.mnemonic;
                    
                    if(operands[0].type == "reg" && operands[1].type == "mem")
                        iterator.putCallout(movRegMem);
                    else if(operands[0].type == "mem" && operands[1].type == "reg")
                        iterator.putCallout(movMemReg);
                    else if(operands[0].type == "reg" && operands[1].type == "reg")
                        iterator.putCallout(movRegReg);
                    else if(mnemonic.startsWith("mov") && operands[0].type == "reg" && operands[1].type == "imm")
                        iterator.putCallout(movRegImm);
                    else if(mnemonic.startsWith("mov") && operands[0].type == "mem" && operands[1].type == "imm")
                        iterator.putCallout(movMemImm);
                    //console.log(instr);
                }
                
                iterator.keep();
              } while ((instr = iterator.next()) !== null);
          }
          catch(err) { console.log(err); }
        }
    });
    
    console.log("[x] started tracing");
}


function stopTracing() {
    Stalker.unfollow(Process.getCurrentThreadId());
    
    console.log("[x] stopped tracing");
}

function report() {
    //console.log(" tainted registers: " + JSON.stringify(taintedRegs));
    
    console.log(" tainted memory   : " + JSON.stringify(memory.toArray()));
}


exports.memory = memory;
exports.regs = regs;
exports.startTracing = startTracing;
exports.stopTracing = stopTracing;
exports.report = report;



