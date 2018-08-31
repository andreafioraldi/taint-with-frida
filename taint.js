'use strict';

var appModule = Process.enumerateModulesSync()[0];
var appStart = appModule.base;
var appEnd = appStart.add(appModule.size);

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

var regSize = {
    "rax": 8, "rbx": 8, "rcx": 8, "rdx": 8, "rdi": 8, "rsi": 8,
    "eax": 4, "ebx": 4, "ecx": 4, "edx": 4, "edi": 4, "esi": 4,
    "ax": 2, "bx": 2, "cx": 2, "dx": 2, "di": 2, "si": 2,
    "al": 1, "bl": 1, "cl": 1, "dl": 1, "dil": 1, "sil": 1,
};

var regId = {
    "rax": 0, "rbx": 1, "rcx": 2, "rdx": 3, "rdi": 4, "rsi": 5,
    "eax": 0, "ebx": 1, "ecx": 2, "edx": 3, "edi": 4, "esi": 5,
    "ax": 0, "bx": 1, "cx": 2, "dx": 3, "di": 4, "si": 5,
    "al": 0, "bl": 1, "cl": 2, "dl": 3, "dil": 4, "sil": 5,
};

var registers = [
    ["rax", "eax", "ax", "al"],
    ["rbx", "ebx", "bx", "bl"],
    ["rcx", "ecx", "cx", "cl"],
    ["rdx", "edx", "dx", "dl"],
    ["rdi", "edi", "di", "dil"],
    ["rsi", "esi", "si", "sil"],
];

var taintedRegs = [];
var taintedAddrs = [];

function taintReg(reg) {
    if(taintedRegs.indexOf(reg) !== -1)
        return;
    
    var ra = registers[regId[reg]];
    for(var i = ra.indexOf(reg); i < ra.length; ++i) {
        taintedRegs.push(ra[i]);
    }
}

function untaintReg(reg) {
    var ra = registers[regId[reg]];
    for(var i = ra.indexOf(reg); i < ra.length; ++i) {
        var idx = taintedRegs.indexOf(ra[i]);
        if(idx !== -1)
            taintedRegs.splice(idx, 1);
    }
}

function findTaintedMem(addr) {
    for(var i in taintedAddrs)
        if(taintedAddrs[i].equals(addr))
            return i;
    return -1;
}

function taintMem(addr) {
    if(findTaintedMem(addr) === -1)
        taintedAddrs.push(addr);
}

function untaintMem(addr) {
    for(var i in taintedAddrs) {
        if(taintedAddrs[i] .equals(addr)) {
            taintedAddrs.splice(i, 1);
            return;
        }
    }
}


function movRegMem(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value;
    var op1 = instr.operands[1].value;
    
    if(op1.base !== undefined) {
        var addr = ctx[op1.base].add(op1.disp); //ex. ctx["rip"] + 0x32
        if(op1.index !== undefined)
            addr = addr.add(scaleSHL(ctx[op1.index], op1.scale));
        
        if(findTaintedMem(addr) !== -1) {
            console.log(" <READ  " + addr + ">  \t" + instr.address + " " + instr);
            taintReg(op0)
        }
        else if(taintedRegs.indexOf(op0) !== -1) { //mem not tainted
            console.log(" <READ  " + addr + ">  \t" + instr.address + " " + instr);
            untaintReg(op0);
        }
    }

}

function movMemReg(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value;
    var op1 = instr.operands[1].value;
    
    if(op0.base !== undefined) {
        var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
        if(op0.index !== undefined)
            addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));
        
        if(findTaintedMem(addr) !== -1) {
            console.log(" <WRITE " + addr + ">  \t" + instr.address + " " + instr);
            if(!(op1 in regId) || taintedRegs.indexOf(op1) === -1) //not tainted reg
                untaintMem(addr);
        }
        else if(taintedRegs.indexOf(op1) !== -1) { //mem not tainted
            console.log(" <WRITE " + addr + ">  \t" + instr.address + " " + instr);
            taintMem(addr);
        }
    }
}

function movRegReg(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value;
    var op1 = instr.operands[1].value;
    if(!(op0 in regId))
        return;
    
    if(taintedRegs.indexOf(op0) !== -1 && (!(op1 in regId) || taintedRegs.indexOf(op1) === -1)) {
        console.log(" <REGS  " + op0 + " <- " + op1 + ">  \t\t" + instr.address + " " + instr);
        untaintReg(op0);
    }
    else if(taintedRegs.indexOf(op0) === -1 && taintedRegs.indexOf(op1) !== -1) {
        console.log(" <REGS  " + op0 + " <- " + op1 + ">  \t\t" + instr.address + " " + instr);
        taintReg(op0);
    }
}

function movRegImm(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value
    
    if(taintedRegs.indexOf(op0) !== -1) console.log(" <IMMREG " + op0 + ">        \t\t" + instr.address + " " + instr);
    untaintReg(op0);
}

function movMemImm(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var op0 = instr.operands[0].value;
    if(op0.base !== undefined) {
        var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
        if(op0.index !== undefined)
            addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));
        
        if(findTaintedMem(addr) !== -1) console.log(" <IMM   " + addr + ">  \t" + instr.address + " " + instr);
        untaintMem(addr);
    }
}

function startTracing() {
    Stalker.follow(Process.getCurrentThreadId(), {
        transform: function (iterator) {
          var instr = iterator.next();
          
          try {
              do {
                
                //if(instr.mnemonic.startsWith("mov")) {
                if(instr.operands.length == 2) {
                    if(instr.operands[0].type == "reg" && instr.operands[1].type == "mem")
                        iterator.putCallout(movRegMem);
                    else if(instr.operands[0].type == "mem" && instr.operands[1].type == "reg")
                        iterator.putCallout(movMemReg);
                    else if(instr.operands[0].type == "reg" && instr.operands[1].type == "reg")
                        iterator.putCallout(movRegReg);
                    else if(instr.mnemonic.startsWith("mov") && instr.operands[0].type == "reg" && instr.operands[1].type == "imm")
                        iterator.putCallout(movRegImm);
                    else if(instr.mnemonic.startsWith("mov") && instr.operands[0].type == "mem" && instr.operands[1].type == "imm")
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

function taintReport() {
    console.log(" tainted registers: " + JSON.stringify(taintedRegs));
    var ranges = [];
    taintedAddrs.sort();
    for(var i in taintedAddrs) {
        var a = taintedAddrs[i];
        if(ranges.length === 0) {
            ranges.push([a, a]);
        }
        if(ranges[ranges.length -1][1].equals(a))
            ranges[ranges.length -1][1] = a.add(1);
        else {
            ranges.push([a, a.add(1)]);
        }
    }
    console.log(" tainted memory   : " + JSON.stringify(ranges));
}



