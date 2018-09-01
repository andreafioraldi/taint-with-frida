(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var taint = require("./taint");

Interceptor.attach(ptr("0x400603"), function () {
    //main
    console.log("[x] enter main()");
    taint.startTracing();
});

Interceptor.attach(ptr("0x400596"), { //foo
    onEnter: function (args) {
        console.log("[x] enter foo()");
        taint.memory.taint(this.context.rdi, 40);
        taint.report();
    },
    onLeave: function (retval) {
        console.log("[x] leave foo()");
        taint.stopTracing();
        taint.report();
    }
});

},{"./taint":5}],2:[function(require,module,exports){
'use strict';

exports.space = 920;

//"name": [address, size]
exports.registers = {
    'ac': [192, 8],
    'acflag': [192, 8],
    'ah': [17, 1],
    'al': [16, 1],
    'ax': [16, 2],
    'bh': [41, 1],
    'bl': [40, 1],
    'bp': [56, 8],
    'bx': [40, 2],
    'cc_dep1': [152, 8],
    'cc_dep2': [160, 8],
    'cc_ndep': [168, 8],
    'cc_op': [144, 8],
    'ch': [25, 1],
    'cl': [24, 1],
    'cmlen': [880, 8],
    'cmstart': [872, 8],
    'cx': [24, 2],
    'd': [176, 8],
    'dflag': [176, 8],
    'dh': [33, 1],
    'di': [72, 2],
    'dih': [73, 1],
    'dil': [72, 1],
    'dl': [32, 1],
    'dx': [32, 2],
    'eax': [16, 4],
    'ebp': [56, 4],
    'ebx': [40, 4],
    'ecx': [24, 4],
    'edi': [72, 4],
    'edx': [32, 4],
    'emnote': [864, 4],
    'esi': [64, 4],
    'esp': [48, 4],
    'fc3210': [856, 8],
    'fpreg': [776, 64],
    'fpround': [848, 8],
    'fptag': [840, 8],
    'fpu_regs': [776, 64],
    'fpu_tags': [840, 8],
    'fs': [208, 8],
    'fs_const': [208, 8],
    'ftop': [768, 4],
    'gs': [904, 8],
    'gs_const': [904, 8],
    'id': [200, 8],
    'idflag': [200, 8],
    'ip': [184, 8],
    'ip_at_syscall': [912, 8],
    'mm0': [776, 8],
    'mm1': [784, 8],
    'mm2': [792, 8],
    'mm3': [800, 8],
    'mm4': [808, 8],
    'mm5': [816, 8],
    'mm6': [824, 8],
    'mm7': [832, 8],
    'nraddr': [888, 8],
    'pc': [184, 8],
    'r10': [96, 8],
    'r10d': [96, 4],
    'r10w': [96, 2],
    'r10b': [96, 1],
    'r11': [104, 8],
    'r11d': [104, 4],
    'r11w': [104, 2],
    'r11b': [104, 1],
    'r12': [112, 8],
    'r12d': [112, 4],
    'r12w': [112, 2],
    'r12b': [112, 1],
    'r13': [120, 8],
    'r13d': [120, 4],
    'r13w': [120, 2],
    'r13b': [120, 1],
    'r14': [128, 8],
    'r14d': [128, 4],
    'r14w': [128, 2],
    'r14b': [128, 1],
    'r15': [136, 8],
    'r15d': [136, 4],
    'r15w': [136, 2],
    'r15b': [136, 1],
    'r8': [80, 8],
    'r8d': [80, 4],
    'r8w': [80, 2],
    'r8b': [80, 1],
    'r9': [88, 8],
    'r9d': [88, 4],
    'r9w': [88, 2],
    'r9b': [88, 1],
    'rax': [16, 8],
    'rbp': [56, 8],
    'rbx': [40, 8],
    'rcx': [24, 8],
    'rdi': [72, 8],
    'rdx': [32, 8],
    'rip': [184, 8],
    'rsi': [64, 8],
    'rsp': [48, 8],
    'si': [64, 2],
    'sih': [65, 1],
    'sil': [64, 1],
    'sp': [48, 8],
    'sseround': [216, 8],
    'xmm0': [224, 16],
    'xmm1': [256, 16],
    'xmm10': [544, 16],
    'xmm11': [576, 16],
    'xmm12': [608, 16],
    'xmm13': [640, 16],
    'xmm14': [672, 16],
    'xmm15': [704, 16],
    'xmm16': [736, 16],
    'xmm2': [288, 16],
    'xmm3': [320, 16],
    'xmm4': [352, 16],
    'xmm5': [384, 16],
    'xmm6': [416, 16],
    'xmm7': [448, 16],
    'xmm8': [480, 16],
    'xmm9': [512, 16],
    'ymm0': [224, 32],
    'ymm1': [256, 32],
    'ymm10': [544, 32],
    'ymm11': [576, 32],
    'ymm12': [608, 32],
    'ymm13': [640, 32],
    'ymm14': [672, 32],
    'ymm15': [704, 32],
    'ymm16': [736, 32],
    'ymm2': [288, 32],
    'ymm3': [320, 32],
    'ymm4': [352, 32],
    'ymm5': [384, 32],
    'ymm6': [416, 32],
    'ymm7': [448, 32],
    'ymm8': [480, 32],
    'ymm9': [512, 32]
};

},{}],3:[function(require,module,exports){
'use strict';

//https://gist.github.com/binarymax/ab3e917c170ca95268e5

//------------------------------------------
//Compact BitMap datastructure
//Memory efficient array of bool flags

var BitMap = function (size) {
	this._cols = 8;
	this._shift = 3;
	this._rows = (size >> this._shift) + 1;
	this._buf = new ArrayBuffer(this._rows);
	this._bin = new Uint8Array(this._buf);
};

//Gets the bool at offset
BitMap.prototype.get = function (off) {
	var row = off >> this._shift;
	var col = off % this._cols;
	var bit = 1 << col;
	return (this._bin[row] & bit) > 0;
};

//Sets a bit at offset to bool
BitMap.prototype.set = function (off, bool) {
	var row = off >> this._shift;
	var col = off % this._cols;
	var bit = 1 << col;
	if (bool) {
		this._bin[row] |= bit;
	} else {
		bit = 255 ^ bit;
		this._bin[row] &= bit;
	}
};

//Flip a single bit at offset
BitMap.prototype.flip = function (off) {
	var row = Math.floor(off / this._cols);
	var col = off % this._cols;
	var bit = 1 << col;
	this._bin[row] ^= bit;
};

//Reset to all 1's
BitMap.prototype.fill = function () {
	for (var i = 0; i < this._rows; i++) {
		this._bin[i] = 255;
	}
};

//Reset to all 0's
BitMap.prototype.clear = function () {
	for (var i = 0; i < this._rows; i++) {
		this._bin[i] = 0;
	}
};

module.exports = BitMap;

},{}],4:[function(require,module,exports){
'use strict';

var BitMap = require("./bitmap.js");
var IntervalTree = require('./interval-tree.js').IntervalTree;

var Registers = function (arch) {
    this.arch = arch;
    this.regTaintMap = new BitMap(arch.space + 32); //+32 for safe cast
};

Registers.prototype.taint = function (reg) {
    var rm = this.arch.registers[reg];
    for (var i = rm[0]; i < rm[0] + rm[1]; ++i) this.regTaintMap.set(i, true);
};

Registers.prototype.untaint = function (reg) {
    var rm = this.arch.registers[reg];
    for (var i = rm[0]; i < rm[0] + rm[1]; ++i) this.regTaintMap.set(i, false);
};

Registers.prototype.isTainted = function (reg) {
    var rm = this.arch.registers[reg];
    for (var i = rm[0]; i < rm[0] + rm[1]; ++i) if (this.regTaintMap.get(i)) return true;
    return false;
};

Registers.prototype.isFullyTainted = function (reg) {
    var rm = this.arch.registers[reg];
    for (var i = rm[0]; i < rm[0] + rm[1]; ++i) if (this.regTaintMap.get(i)) return true;else return false;
    return false;
};

Registers.prototype.toArray = function () {
    var arr = [];
    for (var r in this.arch.registers) {
        if (this.isTainted(r)) arr.push(r);
    }
    return arr;
};

Registers.prototype.toRanges = function (reg, base) {
    var rm = this.arch.registers[reg];
    var ranges = [];
    for (var i = 0; i < rm[1]; ++i) {
        if (this.regTaintMap.get(rm[0] + i)) {
            var addr = base.add(i);

            if (ranges.length === 0) {
                ranges.push([addr, addr]);
            }
            if (ranges[ranges.length - 1][1].equals(addr)) ranges[ranges.length - 1][1] = addr.add(1);else {
                ranges.push([addr, addr.add(1)]);
            }
        }
    }
    return ranges;
};

Registers.prototype.spread = function (destReg, srcReg) {
    var rm0 = this.arch.registers[destReg];
    var rm1 = this.arch.registers[srcReg];
    for (var i = 0; i < rm0[1]; ++i) this.regTaintMap.set(rm0[0] + i, this.regTaintMap.get(rm1[0] + i));
};

Registers.prototype.fromBitMap = function (reg, bmap) {
    var rm = this.arch.registers[reg];
    for (var i = 0; i < rm[1]; ++i) this.regTaintMap.set(i + rm[0], bmap.get(i));
};

var Memory = function () {
    this.memTaintTree = new IntervalTree();
};

Memory.prototype.taint = function (addr, size) {
    this.memTaintTree.add([addr, addr.add(size)]);
};

Memory.prototype.untaint = function (addr, size) {
    this.memTaintTree.remove([addr, addr.add(size)]);
};

Memory.prototype.isTainted = function (addr, size) {
    return this.memTaintTree.intersects([addr, addr.add(size)]);
};

Memory.prototype.isFullyTainted = function (addr, size) {
    var inter = this.memTaintTree.intersection([addr, addr.add(size)]);
    if (inter.length != 1) return false;
    return inter[0][0].compare(addr) == 0 && inter[0][1].compare(addr.add(size)) == 0;
};

Memory.prototype.toArray = function () {
    function helper(node, arr) {
        if (node === undefined) return arr;

        helper(node.left, arr);
        if (arr.length > 0 && arr[arr.length - 1][1].compare(node.interval[0]) >= 0) //consolidate
            arr[arr.length - 1][1] = node.interval[1];else arr.push(node.interval);
        helper(node.right, arr);

        return arr;
    }

    return helper(this.memTaintTree.root, []);
};

Memory.prototype.fromRanges = function (ranges) {
    for (var i in ranges) {
        this.memTaintTree.add(ranges[i]);
    }
};

Memory.prototype.toBitMap = function (addr, size) {
    var inter = this.memTaintTree.intersection([addr, addr.add(size)]);
    var bmap = new BitMap(size);

    for (var i in inter) {
        for (var j = inter[i][0].sub(addr).toInt32(); j < inter[i][1].sub(addr).toInt32(); ++j) {
            bmap.set(j, true);
        }
    }

    return bmap;
};

exports.Memory = Memory;
exports.Registers = Registers;

},{"./bitmap.js":3,"./interval-tree.js":6}],5:[function(require,module,exports){
'use strict';

var arch = require("./amd64.js");
var core = require("./core.js");

var memory = new core.Memory();
var regs = new core.Registers(arch);

function scaleSHL(addr, scale) {
    switch (scale) {
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

    if (op1.base === undefined) return;

    var addr = ctx[op1.base].add(op1.disp); //ex. ctx["rip"] + 0x32
    if (op1.index !== undefined) addr = addr.add(scaleSHL(ctx[op1.index], op1.scale));

    //if(memory.isTainted(addr, size0)) console.log(instr.address + "   " + instr);

    regs.fromBitMap(op0, memory.toBitMap(addr, size0));
}

function movMemReg(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = operands[0].value;
    var op1 = operands[1].value;

    //var size1 = operands[1].size;

    if (op0.base === undefined) return;

    var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
    if (op0.index !== undefined) addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));

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
    var op0 = instr.operands[0].value;

    regs.untaint(op0);
}

function movMemImm(ctx) {
    var instr = Instruction.parse(ctx.pc);
    var operands = instr.operands;
    var op0 = instr.operands[0].value;
    var size1 = instr.operands[1].size;

    if (op0.base === undefined) return;

    var addr = ctx[op0.base].add(op0.disp); //ex. ctx["rip"] + 0x32
    if (op0.index !== undefined) addr = addr.add(scaleSHL(ctx[op0.index], op0.scale));

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
                    if (operands.length == 2) {
                        var mnemonic = instr.mnemonic;

                        if (operands[0].type == "reg" && operands[1].type == "mem") iterator.putCallout(movRegMem);else if (operands[0].type == "mem" && operands[1].type == "reg") iterator.putCallout(movMemReg);else if (operands[0].type == "reg" && operands[1].type == "reg") iterator.putCallout(movRegReg);else if (mnemonic.startsWith("mov") && operands[0].type == "reg" && operands[1].type == "imm") iterator.putCallout(movRegImm);else if (mnemonic.startsWith("mov") && operands[0].type == "mem" && operands[1].type == "imm") iterator.putCallout(movMemImm);
                        //console.log(instr);
                    }

                    iterator.keep();
                } while ((instr = iterator.next()) !== null);
            } catch (err) {
                console.log(err);
            }
        }
    });

    console.log("[x] started tracing");
}

function stopTracing() {
    Stalker.unfollow(Process.getCurrentThreadId());

    console.log("[x] stopped tracing");
}

function report() {
    console.log(" tainted registers: " + JSON.stringify(regs.toArray()));
    console.log(" tainted memory   : " + JSON.stringify(memory.toArray()));
}

exports.memory = memory;
exports.regs = regs;
exports.startTracing = startTracing;
exports.stopTracing = stopTracing;
exports.report = report;

},{"./amd64.js":2,"./core.js":4}],6:[function(require,module,exports){

// modified from https://github.com/mgechev/javascript-algorithms/blob/master/src/data-structures/interval-tree.js

/**
 * Interval tree is an ordered tree data structure to hold intervals.
 *
 * @example
 *
 * var IT = require('path-to-algorithms/src/data-structures/interval-tree');
 * var intervalTree = new IT.IntervalTree();
 *
 * intervalTree.add([0, 100]);
 * intervalTree.add([101, 200]);
 * intervalTree.add([10, 50]);
 * intervalTree.add([120, 220]);
 *
 * console.log(intervalTree.contains(150)); // true
 * console.log(intervalTree.contains(250)); // false
 * console.log(intervalTree.intersects([210, 310])); // true
 * console.log(intervalTree.intersects([310, 320])); // false
 *
 * @module data-structures/interval-tree
 */
(function (exports) {

  'use strict';

  /**
   * Node which describes an interval.
   *
   * @public
   * @constructor
   * @param {Number} start Start of the interval.
   * @param {Number} end End of the interval.
   * @param {Node} left Left child node.
   * @param {Node} right Right child node.
   */

  exports.Node = function (start, end, left, right) {
    /**
     * Node interval.
     * @member {Array}
     */
    this.interval = [start, end];
    /**
     * Max endpoint in subtree which starts from this node.
     * @member {Number}
     */
    this.max = ptr("0");
    /**
     * Parent node.
     * @member {Node}
     */
    this.parentNode = null;
    /**
     * Left child node.
     * @member {Node}
     */
    this.left = left;
    /**
     * Right child node.
     * @member {Node}
     */
    this.right = right;
  };

  /**
   * Interval tree.
   *
   * @public
   * @constructor
   */
  exports.IntervalTree = function () {
    /**
     * Root node of the tree.
     * @member {Node}
     */
    this.root = null;
  };

  function addNode(node, side, interval) {
    var child = new exports.Node(interval[0], interval[1]);
    child.max = interval[1];
    child.parentNode = node;
    node[side] = child;
    if (node.max.compare(interval[1]) < 0) {
      while (child) {
        if (child.max.compare(interval[1]) < 0) {
          child.max = interval[1];
        }
        child = child.parentNode;
      }
    }
  }

  function addHelper(node, interval) {
    if (node.interval[0].compare(interval[0]) > 0) {
      if (node.left) {
        addHelper(node.left, interval);
      } else {
        addNode(node, 'left', interval);
      }
    } else {
      if (node.right) {
        addHelper(node.right, interval);
      } else {
        addNode(node, 'right', interval);
      }
    }
  }

  /**
   * Add new interval to the tree.
   *
   * @public
   * @param {Array} intreval Array with start and end points of the interval.
   */
  exports.IntervalTree.prototype.add = function (interval) {
    if (!this.root) {
      this.root = new exports.Node(interval[0], interval[1]);
      this.root.max = interval[1];
      return;
    }
    addHelper(this.root, interval);
  };

  function contains(point, node) {
    if (!node) {
      return false;
    }
    if (node.interval[0].compare(point) <= 0 && node.interval[1].compare(point) >= 0) {
      return true;
    }
    var result = false;
    var temp;
    ['left', 'right'].forEach(function (key) {
      temp = node[key];
      if (temp) {
        if (temp.max > point) {
          result = result || contains(point, temp);
        }
      }
    });
    return result;
  }

  /**
   * Checks or point belongs to at least one intarval from the tree.<br><br>
   * Complexity: O(log N).
   *
   * @public
   * @method
   * @param {Number} point Point which should be checked.
   * @return {Boolean} True if point belongs to one of the intervals.
   */
  exports.IntervalTree.prototype.contains = function (point) {
    return contains(point, this.root);
  };

  function intersects(a, b) {
    return a[0].compare(b[0]) <= 0 && a[1].compare(b[0]) >= 0 || a[0].compare(b[1]) <= 0 && a[1].compare(b[1]) >= 0 || b[0].compare(a[0]) <= 0 && b[1].compare(a[0]) >= 0 || b[0].compare(a[1]) <= 0 && b[1].compare(a[1]) >= 0;
  }

  function intersectsHelper(interval, node) {
    if (!node) {
      return false;
    }
    if (intersects(node.interval, interval)) {
      return true;
    }
    var result = false;
    var temp;
    ['left', 'right'].forEach(function (side) {
      temp = node[side];
      if (temp && temp.max.compare(interval[0]) >= 0) {
        result = result || intersectsHelper(interval, temp);
      }
    });
    return result;
  }

  /**
   * Checks or interval belongs to at least one intarval from the tree.<br><br>
   * Complexity: O(log N).
   *
   * @public
   * @method
   * @param {Array} interval Interval which should be checked.
   * @return {Boolean} True if interval intersects with one of the intervals.
   */
  exports.IntervalTree.prototype.intersects = function (interval) {
    return intersectsHelper(interval, this.root);
  };

  function intersection(a, b) {
    if (a === null || b === null) return null;
    if (b[0].compare(a[1]) > 0 || a[0].compare(b[1]) > 0) return null;

    var o = new Array(2);
    if (a[0].compare(b[0]) >= 0) o[0] = a[0];else o[0] = b[0];
    if (a[1].compare(b[1]) <= 0) o[1] = a[1];else o[1] = b[1];
    return o;
  }

  function intersectionHelper(interval, node) {
    if (!node) {
      return null;
    }
    var result = [];
    var inter = intersection(node.interval, interval);
    if (inter !== null) result.push(inter);
    var temp;
    ['left', 'right'].forEach(function (side) {
      temp = node[side];
      if (temp && temp.max.compare(interval[0]) >= 0) {
        var interArr = intersectionHelper(interval, temp);
        if (inter !== null) result = result.concat(interArr);
      }
    });
    return result;
  }

  exports.IntervalTree.prototype.intersection = function (interval) {
    return intersectionHelper(interval, this.root);
  };

  function heightHelper(node) {
    if (!node) {
      return 0;
    }
    return 1 + Math.max(heightHelper(node.left), heightHelper(node.right));
  }

  /**
   * Returns height of the tree.
   *
   * @public
   * @method
   * @return {Number} Height of the tree.
   */
  exports.IntervalTree.prototype.height = function () {
    return heightHelper(this.root);
  };

  /**
   * Returns node with the max endpoint in subtree.
   *
   * @public
   * @method
   * @param {Node} node Root node of subtree.
   * @return {Node} Node with the largest endpoint.
   */
  exports.IntervalTree.prototype.findMax = function (node) {
    var stack = [node];
    var current;
    var max = -Infinity;
    var maxNode;
    while (stack.length) {
      current = stack.pop();
      if (current.left) {
        stack.push(current.left);
      }
      if (current.right) {
        stack.push(current.right);
      }
      if (current.interval[1].compare(max) > 0) {
        max = current.interval[1];
        maxNode = current;
      }
    }
    return maxNode;
  };

  // adjust the max value
  exports.IntervalTree.prototype._removeHelper = function (interval, node) {
    if (!node) {
      return;
    }
    if (node.interval[0] === interval[0] && node.interval[1] === interval[1]) {
      // When left and right children exists
      if (node.left && node.right) {
        var replacement = node.left;
        while (replacement.left) {
          replacement = replacement.left;
        }
        var temp = replacement.interval;
        replacement.interval = node.interval;
        node.interval = temp;
        this._removeHelper(replacement.interval, node);
      } else {
        // When only left or right child exists
        var side = 'left';
        if (node.right) {
          side = 'right';
        }
        var parentNode = node.parentNode;
        if (parentNode) {
          if (parentNode.left === node) {
            parentNode.left = node[side];
          } else {
            parentNode.right = node[side];
          }
          if (node[side]) {
            node[side].parentNode = parentNode;
          }
        } else {
          this.root = node[side];
          // last node removed
          if (this.root) {
            this.root.parentNode = null;
          }
        }
      }
      // Adjust the max value
      var p = node.parentNode;
      if (p) {
        var maxNode = this.findMax(p);
        var max = maxNode.interval[1];
        while (maxNode) {
          if (maxNode.max === node.interval[1]) {
            maxNode.max = max;
            maxNode = maxNode.parentNode;
          } else {
            maxNode = false;
          }
        }
      }
    } else {
      // could be optimized
      this._removeHelper(interval, node.left);
      this._removeHelper(interval, node.right);
    }
  };

  /**
   * Remove interval from the tree.
   *
   * @public
   * @method
   * @param {Array} intreval Array with start and end of the interval.
   */
  exports.IntervalTree.prototype.remove = function (interval) {
    return this._removeHelper(interval, this.root);
  };
})(typeof window === 'undefined' ? module.exports : window);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2ZyaWRhLWNvbXBpbGUvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImZvby5qcyIsInRhaW50L2FtZDY0LmpzIiwidGFpbnQvYml0bWFwLmpzIiwidGFpbnQvY29yZS5qcyIsInRhaW50L2luZGV4LmpzIiwidGFpbnQvaW50ZXJ2YWwtdHJlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksUUFBUSxRQUFRLFNBQVIsQ0FBWjs7QUFFQSxZQUFZLE1BQVosQ0FBbUIsSUFBSSxVQUFKLENBQW5CLEVBQW9DLFlBQVk7QUFBRTtBQUM5QyxZQUFRLEdBQVIsQ0FBWSxrQkFBWjtBQUNBLFVBQU0sWUFBTjtBQUNILENBSEQ7O0FBS0EsWUFBWSxNQUFaLENBQW1CLElBQUksVUFBSixDQUFuQixFQUFvQyxFQUFFO0FBQ2xDLGFBQVMsVUFBUyxJQUFULEVBQWU7QUFDcEIsZ0JBQVEsR0FBUixDQUFZLGlCQUFaO0FBQ0EsY0FBTSxNQUFOLENBQWEsS0FBYixDQUFtQixLQUFLLE9BQUwsQ0FBYSxHQUFoQyxFQUFxQyxFQUFyQztBQUNBLGNBQU0sTUFBTjtBQUNILEtBTCtCO0FBTWhDLGFBQVMsVUFBUyxNQUFULEVBQWlCO0FBQ3RCLGdCQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNBLGNBQU0sV0FBTjtBQUNBLGNBQU0sTUFBTjtBQUNIO0FBVitCLENBQXBDOzs7QUNQQTs7QUFFQSxRQUFRLEtBQVIsR0FBZ0IsR0FBaEI7O0FBRUE7QUFDQSxRQUFRLFNBQVIsR0FBb0I7QUFDaEIsVUFBTSxDQUFDLEdBQUQsRUFBTSxDQUFOLENBRFU7QUFFaEIsY0FBVSxDQUFDLEdBQUQsRUFBTSxDQUFOLENBRk07QUFHaEIsVUFBTSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBSFU7QUFJaEIsVUFBTSxDQUFDLEVBQUQsRUFBSyxDQUFMLENBSlU7QUFLaEIsVUFBTSxDQUFDLEVBQUQs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QUF2QjtBQUNBLGVBQU8sWUFBWSxJQUFuQixFQUF5QjtBQUN2Qix3QkFBYyxZQUFZLElBQTFCO0FBQ0Q7QUFDRCxZQUFJLE9BQU8sWUFBWSxRQUF2QjtBQUNBLG9CQUFZLFFBQVosR0FBdUIsS0FBSyxRQUE1QjtBQUNBLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNBLGFBQUssYUFBTCxDQUFtQixZQUFZLFFBQS9CLEVBQXlDLElBQXpDO0FBQ0QsT0FURCxNQVNPO0FBQ0w7QUFDQSxZQUFJLE9BQU8sTUFBWDtBQUNBLFlBQUksS0FBSyxLQUFULEVBQWdCO0FBQ2QsaUJBQU8sT0FBUDtBQUNEO0FBQ0QsWUFBSSxhQUFhLEtBQUssVUFBdEI7QUFDQSxZQUFJLFVBQUosRUFBZ0I7QUFDZCxjQUFJLFdBQVcsSUFBWCxLQUFvQixJQUF4QixFQUE4QjtBQUM1Qix1QkFBVyxJQUFYLEdBQWtCLEtBQUssSUFBTCxDQUFsQjtBQUNELFdBRkQsTUFFTztBQUNMLHVCQUFXLEtBQVgsR0FBbUIsS0FBSyxJQUFMLENBQW5CO0FBQ0Q7QUFDRCxjQUFJLEtBQUssSUFBTCxDQUFKLEVBQWdCO0FBQ2QsaUJBQUssSUFBTCxFQUFXLFVBQVgsR0FBd0IsVUFBeEI7QUFDRDtBQUNGLFNBVEQsTUFTTztBQUNMLGVBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFaO0FBQ0E7QUFDQSxjQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2IsaUJBQUssSUFBTCxDQUFVLFVBQVYsR0FBdUIsSUFBdkI7QUFDRDtBQUNGO0FBQ0Y7QUFDRDtBQUNBLFVBQUksSUFBSSxLQUFLLFVBQWI7QUFDQSxVQUFJLENBQUosRUFBTztBQUNMLFlBQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQWQ7QUFDQSxZQUFJLE1BQU0sUUFBUSxRQUFSLENBQWlCLENBQWpCLENBQVY7QUFDQSxlQUFPLE9BQVAsRUFBZ0I7QUFDZCxjQUFJLFFBQVEsR0FBUixLQUFnQixLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXBCLEVBQXNDO0FBQ3BDLG9CQUFRLEdBQVIsR0FBYyxHQUFkO0FBQ0Esc0JBQVUsUUFBUSxVQUFsQjtBQUNELFdBSEQsTUFHTztBQUNMLHNCQUFVLEtBQVY7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQWxERCxNQWtETztBQUNMO0FBQ0EsV0FBSyxhQUFMLENBQW1CLFFBQW5CLEVBQTZCLEtBQUssSUFBbEM7QUFDQSxXQUFLLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsS0FBSyxLQUFsQztBQUNEO0FBQ0YsR0EzREQ7O0FBNkRBOzs7Ozs7O0FBT0EsVUFBUSxZQUFSLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLEdBQXdDLFVBQVUsUUFBVixFQUFvQjtBQUMxRCxXQUFPLEtBQUssYUFBTCxDQUFtQixRQUFuQixFQUE2QixLQUFLLElBQWxDLENBQVA7QUFDRCxHQUZEO0FBSUQsQ0FoVkQsRUFnVkcsT0FBTyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDLE9BQU8sT0FBdkMsR0FBaUQsTUFoVnBEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIifQ==
