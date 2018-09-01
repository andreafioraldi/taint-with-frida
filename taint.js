(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    'r11': [104, 8],
    'r12': [112, 8],
    'r13': [120, 8],
    'r14': [128, 8],
    'r15': [136, 8],
    'r8': [80, 8],
    'r9': [88, 8],
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

Memory.prototype.toArray = function () {
    function helper(node, arr) {
        if (node === undefined) return arr;

        helper(node.left, arr);
        arr.push(node.interval);
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

},{"./bitmap.js":2,"./interval-tree.js":5}],4:[function(require,module,exports){
'use strict';

var arch = require("./amd64.js");
var core = require("./core.js");

var memory = new core.Memory();
var regs = new core.Registers(arch);

regs.taint("rax");
memory.fromRanges(regs.toRanges("eax", ptr("0xaa00")));

console.log(JSON.stringify(memory.toArray()));

regs.fromBitMap("xmm0", memory.toBitMap(ptr("0xaa02"), 16));
memory.fromRanges(regs.toRanges("xmm0", ptr("0xbb00")));

console.log(JSON.stringify(memory.toArray()));

},{"./amd64.js":1,"./core.js":3}],5:[function(require,module,exports){

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
        inter = intersectionHelper(interval, temp);
        if (inter !== null) result.push(inter);
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2ZyaWRhLWNvbXBpbGUvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFtZDY0LmpzIiwiYml0bWFwLmpzIiwiY29yZS5qcyIsImluZGV4LmpzIiwiaW50ZXJ2YWwtdHJlZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLFFBQVEsS0FBUixHQUFnQixHQUFoQjs7QUFFQTtBQUNBLFFBQVEsU0FBUixHQUFvQjtBQUNoQixVQUFNLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FEVTtBQUVoQixjQUFVLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FGTTtBQUdoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FIVTtBQUloQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FKVTtBQUtoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FMVTtBQU1oQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FOVTtBQU9oQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FQVTtBQVFoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FSVTtBQVNoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FUVTtBQVVoQixlQUFXLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FWSztBQVdoQixlQUFXLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FYSztBQVloQixlQUFXLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FaSztBQWFoQixhQUFTLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FiTztBQWNoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FkVTtBQWVoQixVQUFNLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FmVTtBQWdCaEIsYUFBUyxDQUFDLEdBQUQsRUFBTSxDQUFOLENBaEJPO0FBaUJoQixlQUFXLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FqQks7QUFrQmhCLFVBQU0s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
