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

	var _parser = __webpack_require__(5);

	var _parser2 = _interopRequireDefault(_parser);

	var _observe = __webpack_require__(7);

	var _observe2 = _interopRequireDefault(_observe);

	var _update = __webpack_require__(14);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MVVM = function MVVM(params) {
	    this.$vm = document.querySelector(params.el);
	    this.$model = params.data || {};
	    this.$cache = [];
	    _compile2.default.call(this, this.$vm);
	    //parse.call(this);
	    _observe2.default.call(this, this.$model, _update2.default);
	    _update2.default.call(this);
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

	var compile = function compile(dom) {
	    addQueue.call(this, dom);
	    parseQueue.call(this);
	};

	var addQueue = function addQueue(nodes) {
	    if (nodes.nodeType == 1) {
	        if (hasDirective(nodes)) {
	            this.$cache.push(nodes);
	        }
	        if (nodes.hasChildNodes()) {
	            nodes.childNodes.forEach(function (item) {
	                addQueue.call(this, item);
	            }, this);
	        }
	    }
	};

	var parseQueue = function parseQueue() {
	    this.$cache = this.$cache.map(function (node) {
	        return paserNode.call(this, node);
	    }, this);
	};

	var paserNode = function paserNode(node) {
	    var direct_array = [];
	    var $model = this.$model;
	    var scope = {
	        parentNode: node.parentNode,
	        nextNode: node.nextElementSibling,
	        node: node,
	        direct_array: direct_array,
	        model: $model
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
	        var Parser = _directives2.default[directiveType];
	        direct_array.push(new Parser(val, scope));
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

	var _if = __webpack_require__(9);

	var _if2 = _interopRequireDefault(_if);

	var _for = __webpack_require__(10);

	var _for2 = _interopRequireDefault(_for);

	var _show = __webpack_require__(11);

	var _show2 = _interopRequireDefault(_show);

	var _text = __webpack_require__(12);

	var _text2 = _interopRequireDefault(_text);

	var _model = __webpack_require__(13);

	var _model2 = _interopRequireDefault(_model);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = { velse: _else2.default, vif: _if2.default, vfor: _for2.default, vshow: _show2.default, vtext: _text2.default, vmodel: _model2.default };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var VElse = function VElse() {
	    _parser.Parser.apply(this, arguments);
	};

	var velse = (0, _parser.extend)(VElse);

	velse.parse = function () {
	    console.log('velse parser parse');
	    var node = this.node;
	    this.newPosition = (0, _util.storageDom)(node);
	    this.bind();
	};

	velse.update = function () {
	    var node = this.node;
	    var flag = !node.judge;
	    var newPosition = this.newPosition;

	    if (flag) {
	        (0, _util.replaceNode)(node, newPosition);
	    } else {
	        (0, _util.replaceNode)(newPosition, node);
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
	exports.extend = exports.Parser = undefined;

	var _util = __webpack_require__(2);

	var _directive = __webpack_require__(6);

	var _directive2 = _interopRequireDefault(_directive);

	var _observe = __webpack_require__(7);

	var _observe2 = _interopRequireDefault(_observe);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//var parse = function () {
	//    this.$cache = this.$cache.map(function (node) {
	//        return paserNode.call(this, node);
	//    }, this);
	//};
	//
	//var storageDom = function (node) {
	//    this.$parentNode = node.parentNode;
	//    this.$nextNode = node.nextElementSibling;
	//    this.$node = node;
	//    this.$direct_array = [];
	//};
	//
	//var onchange = function (attr) {
	//    this.$model[attr] = event.target.value;
	//};
	//
	//var paserNode = function (node) {
	//    var scope = {};
	//    storageDom.call(scope, node);
	//    var text = node.getAttribute('v-text');
	//    var show = node.getAttribute('v-show');
	//    var model = node.getAttribute('v-model');
	//    var vFor = node.getAttribute('v-for');
	//    var vIf = node.getAttribute('v-if');
	//    var vElse = node.hasAttribute('v-else');
	//    var textContent = node.textContent;
	//    var $model = this.$model;
	//    var direct_array = scope.$direct_array;
	//    if (textContent) {
	//        text = stringParse(textContent);
	//    }
	//    if (text) {
	//        scope.text = text;
	//        var descriptor = {
	//            expression: 'v-text',
	//            raw: text
	//        };
	//        removeAttribute(node, 'v-text');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//    }
	//    if (show) {
	//        scope.show = show;
	//        var descriptor = {
	//            expression: 'v-show',
	//            raw: show,
	//            key: 'display'
	//        };
	//        removeAttribute(node, 'v-show');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//    }
	//    if (model) {
	//        if (!$model.hasOwnProperty(model)) {
	//            $model[model] = '';
	//        }
	//        scope.model = model;
	//        var descriptor = {
	//            expression: 'v-model',
	//            raw: model
	//        };
	//        removeAttribute(node, 'v-model');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//        node.addEventListener('input', onchange.bind(this, model), false);
	//    }
	//    if (vFor) {
	//        var t_array = vFor.split(/\s+/);
	//        var newNode = createAnchor();
	//        scope.$end = newNode;
	//        scope.$arrayCache = [];
	//        scope.$domCache = [];
	//
	//        replaceNode(newNode, node);
	//        var descriptor = {
	//            expression: 'v-for',
	//            list: t_array[2],
	//            obj: t_array[0]
	//        };
	//
	//        removeAttribute(node, 'v-for');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//    }
	//    if (vIf) {
	//        scope.if = vIf;
	//        var descriptor = {
	//            expression: 'v-if',
	//            raw: vIf
	//        };
	//        removeAttribute(node, 'v-if');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//    }
	//
	//    if (vElse) {
	//        scope.else = true;
	//        var descriptor = {
	//            expression: 'v-else',
	//            raw: vElse
	//        };
	//        removeAttribute(node, 'v-else');
	//        direct_array.push(new Directive(descriptor, $model, node));
	//    }
	//
	//    return scope;
	//};


	var Parser = function Parser(raw, scope) {
	    Object.assign(this, scope);
	    this.raw = raw;
	    this.parse();
	};

	Parser.prototype.bind = function () {
	    this.directive = new _directive2.default(this);
	    this.directive.mount();
	};

	var extend = function extend(typeParser) {
	    return typeParser.prototype = Object.create(Parser.prototype);
	};

	exports.Parser = Parser;
	exports.extend = extend;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function Directive(parser) {
	    this.parser = parser;
	    //this.vm = vm;
	    //this.el = el;
	    //el._directive = el._directive || [];
	    //el._directive.push(this);
	}

	Directive.prototype = {
	    constructor: Directive,

	    bind: function bind() {
	        console.log('bind');
	    },

	    mount: function mount() {
	        this.bind();
	        console.log('mount');
	    },

	    update: function update() {
	        var parser = this.parser;
	        var model = parser.model;

	        var raw = parser.raw;

	        var val;
	        if ((typeof model === 'undefined' ? 'undefined' : _typeof(model)) != 'object') {
	            val = model;
	        } else {
	            val = model[raw];
	        }
	        parser.update(val);
	    },

	    unbind: function unbind() {
	        console.log('unbind');
	    }
	};

	exports.default = Directive;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _watch = __webpack_require__(8);

	var _watch2 = _interopRequireDefault(_watch);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var observe = function observe(model, update) {
	    _watch2.default.call(this, model, update);
	};

	exports.default = observe;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Watch = function Watch(obj, callback) {
	    this.callback = callback;
	    this.$observe = function (_obj, path) {
	        var type = Object.prototype.toString.call(_obj);
	        if (type == '[object Object]' || type == '[object Array]') {
	            this.$observeObj(_obj, path);
	            if (type == '[object Array]') {
	                this.$cloneArray(_obj, path);
	            }
	        }
	    };

	    this.$observeObj = function (obj, path) {
	        var t = this;
	        Object.keys(obj).forEach(function (prop) {
	            var val = obj[prop];
	            var tpath = path.slice(0);
	            tpath.push(prop);
	            Object.defineProperty(obj, prop, {
	                get: function get() {
	                    return val;
	                },
	                set: function set(newVal) {
	                    var temp = val;
	                    val = newVal;
	                    t.callback(tpath, newVal, temp);
	                }
	            });
	            t.$observe(val, tpath);
	        });
	    };

	    this.$cloneArray = function (a_array, path) {
	        var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
	        var arrayProto = Array.prototype;
	        var newProto = Object.create(arrayProto);
	        var t = this;
	        ORP.forEach(function (prop) {
	            Object.defineProperty(newProto, prop, {
	                value: function value(newVal) {
	                    arrayProto[prop].apply(a_array, arguments);
	                    t.callback(a_array);
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

	//var _array=[1,2];
	//
	//function callback(){
	//    console.log(1)
	//}
	//
	//Watch(_array,callback);

	//_array.push(1);
	exports.default = Watch;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var VIf = function VIf() {
	    _parser.Parser.apply(this, arguments);
	};

	var vif = (0, _parser.extend)(VIf);

	vif.parse = function () {
	    console.log('vif directive bind');
	    var node = this.node;
	    this.newPosition = (0, _util.storageDom)(node);
	    this.bind();
	};

	vif.update = function (judge) {
	    var node = this.node;
	    var nextNode = this.nextNode;
	    var newPosition = this.newPosition;
	    var flag;
	    if (judge) {
	        (0, _util.replaceNode)(node, newPosition);
	        flag = true;
	    } else {
	        (0, _util.replaceNode)(newPosition, node);
	        flag = false;
	    }
	    nextNode.judge = flag;
	};

	exports.default = VIf;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var _util = __webpack_require__(2);

	var _index = __webpack_require__(3);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VFor = function VFor() {
	    _parser.Parser.apply(this, arguments);
	};

	var vfor = (0, _parser.extend)(VFor);

	vfor.parse = function () {
	    console.log('vfor  parse');
	    var node = this.node;
	    var t_array = this.raw.split(/\s+/);
	    this.alias = t_array[0];
	    this.raw = t_array[2];
	    this.newPosition = (0, _util.storageDom)(node);
	    this.arrayCache = [];
	    this.domCache = [];

	    this.bind();
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
	    var node = this.node;
	    var fragment = (0, _util.createFragment)();
	    var newNode = node.cloneNode(true);
	    var direct_array = [];

	    var scope = {
	        node: newNode,
	        direct_array: direct_array,
	        model: item
	    };

	    attrs.forEach(function (attr) {
	        var name = attr.name;
	        var val = attr.value;
	        var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
	        var Parser = _index2.default[directiveType];
	        var parser = new Parser(val, scope);
	        direct_array.push(parser);
	        parser.directive.update();
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var VShow = function VShow() {
	    _parser.Parser.apply(this, arguments);
	};

	var vshow = (0, _parser.extend)(VShow);

	vshow.parse = function () {
	    this.bind();
	};

	vshow.update = function (isShow) {
	    var val = isShow ? 'block' : 'none';
	    this.node.style.display = val;
	};

	exports.default = VShow;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var _directive = __webpack_require__(6);

	var _directive2 = _interopRequireDefault(_directive);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VText = function VText() {
	    _parser.Parser.apply(this, arguments);
	};

	var vt = (0, _parser.extend)(VText);

	vt.parse = function (val) {
	    this.bind();
	};

	vt.update = function (textContent) {
	    if (typeof textContent == 'function') {
	        var model = this.model;
	        textContent = textContent.apply(model);
	    }

	    this.node.textContent = textContent;
	};

	exports.default = VText;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _parser = __webpack_require__(5);

	var VModel = function VModel() {
	    _parser.Parser.apply(this, arguments);
	};

	var vmodel = (0, _parser.extend)(VModel);

	vmodel.parse = function () {
	    this.node.addEventListener('input', onchange.bind(this), false);
	    this.bind();
	};

	vmodel.update = function (content) {
	    this.node.value = content || '';
	};

	var onchange = function onchange() {
	    var raw = this.raw;
	    this.model[raw] = event.target.value;
	};

	exports.default = VModel;

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var render = function render() {
	    var cache = this.$cache;
	    cache.forEach(function (item) {
	        var _arguments = arguments;

	        var direct_array = item.direct_array;
	        direct_array.forEach(function (directive) {
	            directive.directive.update.apply(directive.directive, _arguments);
	        });
	    });
	};

	exports.default = render;

/***/ }
/******/ ]);