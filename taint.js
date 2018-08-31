'use strict';

var appModule = Process.enumerateModulesSync()[0];
var appStart = appModule.base;
var appEnd = appStart.add(appModule.size);

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

var taintedRegs = [];
var taintedAddrs = [];

//{"type":"mem","value":{"base":"rip","scale":1,"disp":2181026}}

function movRegMem(ctx) {
    var instr = Instruction.parse(ctx.pc)
    if(instr.operands[1].value.base !== undefined) {
        var addr = ctx[instr.operands[1].value.base].add(instr.operands[1].value.disp); //ex. ctx["rip"] + 0x32
        if(instr.operands[1].value.index !== undefined)
            addr += ctx[instr.operands[1].value.index] * instr.operands[1].value.scale;
        
        for(var i in taintedAddrs) {
            var r = taintedAddrs[i];
            if(addr.compare(r[0]) >= 0 && addr.compare(r[1]) < 0) {
                console.log(" <READ " + addr + ">  " + instr);
                break;
            }
        }
    }
}

function movMemReg(ctx) {
    
}

function movRegReg(ctx) {
    var instr = Instruction.parse(ctx.pc)
    var dst = regId[instr.operands[0].value]
    var dst_idx = taintedRegs.indexOf(dst)
    if(dst_idx === -1) { //dst is not tainted
        if(taintedRegs.indexOf(instr.operands[1].value) !== -1) {//src is tainted
            taintedRegs.push(dst);
            //console.log(instr.address + "   " + instr + "   " + JSON.stringify(taintedRegs));
        }
    }
    else {
        if(taintedRegs.indexOf(instr.operands[1].value) === -1) {//src is not tainted
            taintedRegs[dst_idx] = undefined;
            //console.log(instr.address + "   " + instr + "   " + JSON.stringify(taintedRegs));
        }
    }
}

function movRegImm(ctx) {
    var instr = Instruction.parse(ctx.pc)
    //console.log("log " + instr);
    var dst = instr.operands[0].value
    var dst_idx = taintedRegs.indexOf(dst)
    if(dst_idx !== -1) { //dst is tainted
        taintedRegs[dst_idx] = undefined;
        console.log(instr.address + "   " + instr + "   " + JSON.stringify(taintedRegs));
    }
}

function startTracing() {
    Stalker.follow(Process.getCurrentThreadId(), {
        transform: function (iterator) {
          var instr = iterator.next();
          
          try {
              do {
                
                if(instr.mnemonic.startsWith("movzx")) {
                    if(instr.operands[0].type == "reg" && instr.operands[1].type == "mem")
                        iterator.putCallout(movRegMem);
                    else if(instr.operands[0].type == "mem" && instr.operands[1].type == "reg")
                        iterator.putCallout(movMemReg);
                    else if(instr.operands[0].type == "reg" && instr.operands[1].type == "reg")
                        iterator.putCallout(movRegReg);
                    else if(instr.operands[0].type == "reg" && instr.operands[1].type == "imm")
                        iterator.putCallout(movRegImm);
                    //console.log(instr);
                }
                
                iterator.keep();
              } while ((instr = iterator.next()) !== null);
          }
          catch(err) { console.log(err); }
        }
    });
}


Interceptor.attach(ptr("0x4005F8"), function () { //main
    console.log("[x] start tracing");
    startTracing();
});

Interceptor.attach(ptr("0x400596"), function () { //foo
    console.log("[x] start taint");
    taintedAddrs.push([this.context.rdi, this.context.rdi.add(30)]);
    console.log(" tainted memory: " + JSON.stringify(taintedAddrs));
    //console.log(this.context.pc + " . " + Instruction.parse(this.context.pc))
});


Interceptor.attach(ptr("0x4005F7"), function () { //ret foo
    console.log("[x] end taint");
    console.log(JSON.stringify(taintedAddrs));
});


