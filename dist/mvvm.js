/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _compile = __webpack_require__(1);

	var _compile2 = _interopRequireDefault(_compile);

	var _parser = __webpack_require__(13);

	var _parser2 = _interopRequireDefault(_parser);

	var _observe = __webpack_require__(14);

	var _observe2 = _interopRequireDefault(_observe);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MVVM = function MVVM(params) {
		this.el = document.querySelector(params.el);
		this.model = params.data || {};
		this.cache = [];
		this.direct_array = [];
		new _observe2.default(this.model);
		(0, _compile2.default)(this);
	};

	window.MVVM = MVVM;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(2);

	var _directives = __webpack_require__(3);

	var _directives2 = _interopRequireDefault(_directives);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var type_array = ['v-text', 'v-show', 'v-model', 'v-for', 'v-if', 'v-else'];

	var compile = function compile(vm) {
	    var el = vm.el;
	    addQueue(vm, el);
	    parseQueue(vm);
	};

	var addQueue = function addQueue(vm, nodes) {
	    if (nodes.nodeType == 1) {
	        if (hasDirective(nodes)) {
	            vm.cache.push(nodes);
	        }
	        if (nodes.hasChildNodes()) {
	            nodes.childNodes.forEach(function (item) {
	                addQueue(vm, item);
	            }, this);
	        }
	    }
	};

	var parseQueue = function parseQueue(vm) {
	    vm.cache = vm.cache.map(function (node) {
	        return paserNode(vm, node);
	    }, vm);
	};

	var paserNode = function paserNode(vm, node) {
	    var model = vm.model;
	    var direct_array = vm.direct_array;
	    var scope = {
	        parentNode: node.parentNode,
	        nextNode: node.nextElementSibling,
	        el: node,
	        model: model,
	        direct_array: direct_array
	    };

	    var attributes = (0, _util.toArray)(node.attributes);
	    var textContent = node.textContent;
	    var attrs = [];
	    var vfor;

	    attributes.forEach(function (attr) {
	        var name = attr.name;
	        if (isDirective(name)) {
	            if (name == 'v-for') {
	                vfor = attr;
	            } else {
	                attrs.push(attr);
	            }

	            (0, _util.removeAttribute)(node, name);
	        }
	    });

	    //bug  nodeType=3
	    var textValue = (0, _util.stringParse)(textContent);
	    if (textValue) {
	        attrs.push({
	            name: 'v-text',
	            value: textValue
	        });
	        node.textContent = '';
	    }

	    if (vfor) {
	        scope.attrs = attrs;
	        attrs = [vfor];
	    }

	    attrs.forEach(function (attr) {
	        var name = attr.name;
	        var val = attr.value;
	        var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
	        var Directive = _directives2.default[directiveType];
	        if (Directive) {
	            direct_array.push(new Directive(vm, val, scope));
	        }
	    });

	    return scope;
	};

	var hasDirective = function hasDirective(node) {
	    var flag = false;
	    type_array.forEach(function (attr) {
	        if (node.hasAttribute(attr)) {
	            flag = true;
	        }
	    });
	    if (!flag) {
	        var textContent = node.textContent;
	        if (new RegExp(_util.textReg).test(textContent)) {
	            flag = true;
	        }
	    }
	    return flag;
	};

	var isDirective = function isDirective(attr) {
	    return (/v-(\w.)/.test(attr)
	    );
	};

	exports.default = compile;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var textReg = '^{{(.+)}}$';

	var createAnchor = function createAnchor() {
	    return document.createTextNode(' ');
	};

	var contrastArray = function contrastArray(_old, _new) {
	    var a = [];
	    if (_old.length > _new.length) {
	        for (var i = 0; i < _old.length; i++) {
	            if (_new[i] !== _old[i]) {
	                a.push(i);
	            }
	        }
	        a.type = 'delete';
	    } else if (_old.length < _new.length) {
	        for (var i = 0; i < _new.length; i++) {
	            if (_new[i] !== _old[i]) {
	                a.push(i);
	            }
	        }
	        a.type = 'add';
	    }
	    return a;
	};

	var replaceNode = function replaceNode(node, old) {
	    if (old.parentNode) {
	        old.parentNode.replaceChild(node, old);
	    }
	};

	var judgeNull = function judgeNull(value) {
	    if (value === undefined || value === null || value === '') {
	        return false;
	    }
	    return true;
	};

	var stringParse = function stringParse(str) {
	    var array = new RegExp(textReg).exec(str);
	    if (array) {
	        return array[1];
	    }
	    return '';
	};

	var createFragment = function createFragment() {
	    return document.createDocumentFragment();
	};

	var removeAttribute = function removeAttribute(node, attr) {
	    if (node.hasAttribute(attr)) {
	        node.removeAttribute(attr);
	    }
	};

	var toArray = function toArray(list) {
	    var length = list.length;
	    var array = [];
	    while (length--) {
	        array.push(list[length]);
	    }
	    return array;
	};

	var storageDom = function storageDom(node) {
	    var newPosition = createAnchor();
	    replaceNode(newPosition, node);
	    return newPosition;
	};

	exports.createAnchor = createAnchor;
	exports.contrastArray = contrastArray;
	exports.replaceNode = replaceNode;
	exports.judgeNull = judgeNull;
	exports.stringParse = stringParse;
	exports.createFragment = createFragment;
	exports.removeAttribute = removeAttribute;
	exports.textReg = textReg;
	exports.toArray = toArray;
	exports.storageDom = storageDom;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _else = __webpack_require__(4);

	var _else2 = _interopRequireDefault(_else);

	var _if = __webpack_require__(8);

	var _if2 = _interopRequireDefault(_if);

	var _for = __webpack_require__(9);

	var _for2 = _interopRequireDefault(_for);

	var _show = __webpack_require__(10);

	var _show2 = _interopRequireDefault(_show);

	var _text = __webpack_require__(11);

	var _text2 = _interopRequireDefault(_text);

	var _model = __webpack_require__(12);

	var _model2 = _interopRequireDefault(_model);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = { vif: _if2.default, vfor: _for2.default, vshow: _show2.default, vtext: _text2.default, vmodel: _model2.default };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var VElse = function VElse() {
	    _directive.Directive.apply(this, arguments);
	};

	var velse = (0, _directive.extend)(VElse);

	velse.bind = function () {
	    console.log('velse directive bind');
	    var el = this.el;
	    this.newPosition = (0, _util.storageDom)(el);
	    this._bind();
	};

	velse.update = function () {
	    var el = this.el;
	    var flag = !el.judge;
	    var newPosition = this.newPosition;

	    if (flag) {
	        (0, _util.replaceNode)(el, newPosition);
	    } else {
	        (0, _util.replaceNode)(newPosition, el);
	    }
	};

	exports.default = VElse;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.extend = exports.Directive = undefined;

	var _watcher = __webpack_require__(6);

	var _watcher2 = _interopRequireDefault(_watcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Directive(vm, raw, scope) {
	    this.vm = vm;
	    Object.assign(this, scope);
	    this.raw = raw;
	    var el = this.el;
	    el._directive = el._directive || [];
	    el._directive.push(this);

	    this.bind();
	}

	Directive.prototype = {
	    constructor: Directive,

	    _bind: function _bind() {
	        var vm = this.vm;
	        var expression = this.raw;
	        var watcher = new _watcher2.default(vm, expression, this.update.bind(this));
	        this.update(watcher.value);
	    },

	    unbind: function unbind() {
	        console.log('directive unbind');
	    }
	};

	var extend = function extend(typeDirective) {
	    return typeDirective.prototype = Object.create(Directive.prototype);
	};

	exports.Directive = Directive;
	exports.extend = extend;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _depend = __webpack_require__(7);

	var _depend2 = _interopRequireDefault(_depend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Watcher = function Watcher(vm, expression, update) {
		this.vm = vm;
		// this.cb = cb;
		this.expression = expression;
		this.update = update;
		_depend2.default.target = this;
		this.value = this.getValue();
		_depend2.default.target = null;
	};

	Watcher.prototype.run = function () {
		this.value = this.getValue();
		this.update(this.value);
	};

	Watcher.prototype.getValue = function () {
		var vm = this.vm;
		var model = vm.model;
		var expression = this.expression;
		var getter = getFunction('scope.' + expression);
		return getter(model);
	};

	function getFunction(body) {
		return new Function('scope', 'return ' + body);
	}

	exports.default = Watcher;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function Depend() {
		this.cache = [];
	}

	var dp = Depend.prototype;

	dp.addSub = function (callback) {
		this.cache.push(callback);
	};

	dp.notify = function () {
		this.cache.forEach(function (call) {
			call.run();
		});
	};

	dp.destory = function () {
		this.cache = [];
	};

	exports.default = Depend;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var VIf = function VIf() {
	    _directive.Directive.apply(this, arguments);
	};

	var vif = (0, _directive.extend)(VIf);

	vif.bind = function () {
	    console.log('vif directive bind');
	    var el = this.el;
	    var nextNode = this.nextNode;
	    var parentNode = this.parentNode;
	    if (nextNode && nextNode.hasAttribute('v-else')) {
	        this.elseNode = nextNode;
	        parentNode.removeChild(nextNode);
	    }
	    this.newPosition = (0, _util.storageDom)(el);
	    this._first = true;
	    this._bind();
	};

	vif.update = function (judge) {
	    var el = this.el;
	    var elseNode = this.elseNode;
	    var parentNode = this.parentNode;
	    var newPosition = this.newPosition;

	    if (judge) {
	        if (!this._first && elseNode) {
	            parentNode.removeChild(elseNode);
	        }

	        parentNode.insertBefore(el, newPosition);
	    } else {
	        if (!this._first) {
	            parentNode.removeChild(el);
	        }
	        if (elseNode) {
	            parentNode.insertBefore(elseNode, newPosition);
	        }
	    }
	    this._first = false;
	};

	exports.default = VIf;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _index = __webpack_require__(3);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VFor = function VFor() {
	    _directive.Directive.apply(this, arguments);
	};

	var vfor = (0, _directive.extend)(VFor);

	vfor.bind = function () {
	    console.log('vfor  bind');
	    var el = this.el;
	    var t_array = this.raw.split(/\s+/);
	    this.alias = t_array[0];
	    this.raw = t_array[2];
	    this.newPosition = (0, _util.storageDom)(el);
	    this.arrayCache = [];
	    this.domCache = [];

	    this._bind();
	};

	vfor.update = function (newItems, oldItem) {
	    var _this = this;

	    var arrayCache = this.arrayCache;
	    var parentNode = this.parentNode;
	    var newPosition = this.newPosition;
	    var domCache = this.domCache;
	    if (arrayCache.length == 0) {
	        newItems.forEach(function (item) {
	            var fragment = _this.createFragment(item);
	            var cache = fragment.children[0];
	            parentNode.insertBefore(fragment, newPosition);
	            arrayCache.push(item);
	            domCache.push(cache);
	        });
	    } else {
	        var diff = (0, _util.contrastArray)(arrayCache, newItems);
	        this.correctDom(newItems, oldItem, diff);
	    }
	};

	vfor.createFragment = function (item) {
	    var attrs = this.attrs;
	    var el = this.el;
	    var fragment = (0, _util.createFragment)();
	    var newNode = el.cloneNode(true);
	    var direct_array = this.direct_array;
	    var vm = this.vm;
	    var scope = {
	        node: newNode,
	        model: item,
	        el: el
	    };

	    attrs.forEach(function (attr) {
	        var name = attr.name;
	        var val = attr.value;
	        var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
	        var Directive = _index2.default[directiveType];
	        var directive = new Directive(vm, val, scope);
	        direct_array.push(directive);
	    });

	    fragment.appendChild(newNode);
	    return fragment;
	};

	vfor.correctDom = function (newItems, oldItem, diff) {
	    var _this2 = this;

	    var type = diff.type;
	    var diffArray = diff.slice();
	    var domCache = this.domCache;
	    var arrayCache = this.arrayCache;
	    var newPosition = this.newPosition;
	    var parentNode = this.parentNode;

	    diffArray.forEach(function (index) {
	        var fragment;
	        var newVal = newItems[index];
	        var oldDomCache = domCache[index];
	        fragment = _this2.createFragment(newVal);
	        if (type == 'add') {
	            domCache.push(fragment.children[0]);
	            arrayCache[index] = newItems[index];
	            parentNode.insertBefore(fragment, newPosition);
	        } else if (type == 'delete') {
	            parentNode.removeChild(domCache[index]);
	            delete domCache.splice(index, 1);
	            delete arrayCache.splice(index, 1);
	        } else {
	            domCache[index] = fragment.children[0];
	            arrayCache[index] = newVal;
	            (0, _util.replaceNode)(fragment, oldDomCache);
	        }
	    });
	};

	exports.default = VFor;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var VShow = function VShow() {
	    _directive.Directive.apply(this, arguments);
	};

	var vshow = (0, _directive.extend)(VShow);

	vshow.bind = function () {
	    this._bind();
	};

	vshow.update = function (isShow) {
	    var val = isShow ? 'block' : 'none';
	    this.el.style.display = val;
	};

	exports.default = VShow;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var VText = function VText() {
	    _directive.Directive.apply(this, arguments);
	};

	var vt = (0, _directive.extend)(VText);

	vt.bind = function (val) {
	    this._bind();
	};

	vt.update = function (textContent) {
	    if (typeof textContent == 'function') {
	        var model = this.model;
	        textContent = textContent.apply(model);
	    }

	    this.el.textContent = textContent;
	};

	exports.default = VText;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _directive = __webpack_require__(5);

	var VModel = function VModel() {
	    _directive.Directive.apply(this, arguments);
	};

	var vmodel = (0, _directive.extend)(VModel);

	vmodel.bind = function () {
	    var raw = this.raw;
	    var model = this.vm.model;
	    if (!model.hasOwnProperty(raw)) {
	        model[raw] = '';
	    }
	    this.el.addEventListener('input', onchange.bind(this, raw), false);
	    this._bind();
	};

	vmodel.update = function (content) {
	    this.el.value = content || '';
	};

	var onchange = function onchange(raw) {
	    this.vm.model[raw] = event.target.value;
	};

	exports.default = VModel;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.extend = exports.Parser = undefined;

	var _directive = __webpack_require__(5);

	var _directive2 = _interopRequireDefault(_directive);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Parser = function Parser(raw, scope) {
	    Object.assign(this, scope);
	    this.raw = raw;
	    this.parse();
	};

	Parser.prototype.bind = function () {
	    this.directive = new _directive2.default(this);
	    this.directive.bind();
	};

	var extend = function extend(typeParser) {
	    return typeParser.prototype = Object.create(Parser.prototype);
	};

	exports.Parser = Parser;
	exports.extend = extend;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _depend = __webpack_require__(7);

	var _depend2 = _interopRequireDefault(_depend);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Observe = function Observe(obj) {
	    this.$observe = function (_obj) {
	        var type = Object.prototype.toString.call(_obj);
	        if (type == '[object Object]' || type == '[object Array]') {
	            this.$observeObj(_obj);
	            if (type == '[object Array]') {
	                this.$cloneArray(_obj);
	            }
	        }
	    };

	    this.$observeObj = function (obj) {
	        var t = this;
	        Object.keys(obj).forEach(function (prop) {
	            var val = obj[prop];
	            var dep = new _depend2.default();

	            Object.defineProperty(obj, prop, {
	                get: function get() {
	                    if (_depend2.default.target) {
	                        dep.addSub(_depend2.default.target);
	                    }
	                    return val;
	                },
	                set: function set(newVal) {
	                    var temp = val;
	                    val = newVal;
	                    dep.notify();
	                }
	            });
	            t.$observe(val);
	        });
	    };

	    this.$cloneArray = function (a_array) {
	        var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
	        var arrayProto = Array.prototype;
	        var newProto = Object.create(arrayProto);
	        var t = this;
	        ORP.forEach(function (prop) {
	            Object.defineProperty(newProto, prop, {
	                value: function value(newVal) {
	                    arrayProto[prop].apply(a_array, arguments);
	                    dep.notify();
	                },
	                enumerable: false,
	                configurable: true,
	                writable: true
	            });
	        });
	        a_array.__proto__ = newProto;
	    };

	    this.$observe(obj, []);
	};

	exports.default = Observe;

/***/ }
/******/ ]);