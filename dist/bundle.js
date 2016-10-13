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

	var _parse = __webpack_require__(2);

	var _parse2 = _interopRequireDefault(_parse);

	var _observe = __webpack_require__(3);

	var _observe2 = _interopRequireDefault(_observe);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var init = function init(params) {
	    this.$vm = document.querySelector(params.el);
	    this.$model = params.data || {};
	    this.$cache = [];

	    (0, _compile2.default)(this.$vm);
	    (0, _parse2.default)();
	    (0, _observe2.default)();
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var compile = function compile(dom) {
	    addQueue(dom);
	};

	var addQueue = function addQueue(nodes) {
	    if (nodes.nodeType == 1) {
	        this.cache.push(nodes);
	        if (nodes.hasChildNodes()) {
	            nodes.childNodes.forEach(function (item) {
	                addQueue(item);
	            });
	        }
	    }
	};

	exports.default = compile;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var parse = function parse() {
	    this.cache = this.cache.map(function (node) {
	        return paserNode(node);
	    }, this);
	};

	var paserNode = function paserNode(node) {
	    var scope = {};
	    this.storageDom.call(scope, node);
	    var text = node.getAttribute('v-text');
	    var show = node.getAttribute('v-show');
	    var model = node.getAttribute('v-model');
	    var vFor = node.getAttribute('v-for');
	    var vIf = node.getAttribute('v-if');
	    var vElse = node.hasAttribute('v-else');
	    var textContent = node.textContent;
	    if (textContent) {
	        text = this.stringParse(textContent);
	    }

	    if (text) {
	        scope.text = text;
	    }
	    if (show) {
	        scope.show = show;
	    }
	    if (model) {
	        if (!obj.hasOwnProperty(model)) {
	            obj[model] = '';
	        }
	        scope.model = model;
	        node.addEventListener('input', this.onchange.bind(this, model), false);
	    }
	    if (vFor) {
	        var t_array = vFor.split(/\s+/);
	        var newNode = createAnchor();
	        scope.$end = newNode;
	        scope.$arrayCache = [];
	        scope.$domCache = [];
	        scope.$list = obj[t_array[2]];
	        scope.$key = t_array[0];
	        replaceNode(newNode, node);
	    }
	    if (vIf) {
	        scope.if = vIf;
	    }

	    if (vElse) {
	        scope.else = true;
	    }

	    return scope;
	};

	exports.default = parse;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _watch = __webpack_require__(4);

	var _watch2 = _interopRequireDefault(_watch);

	var _update = __webpack_require__(5);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var observe = function observe() {
	    (0, _watch2.default)(obj, _update2.default.bind(this));
	};

	exports.default = observe;

/***/ },
/* 4 */
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
	                    t.callback(path, newVal);
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
	exports.default = Watch;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var render = function render() {
	    var cache = this.cache;
	    cache.forEach(function (item) {
	        if (this.judgeNull(item.text)) {
	            item.$textContent = true;
	            this.textChange(item, obj[item.text]);
	        }

	        if (this.judgeNull(item.show)) {
	            var value;
	            if (obj[item.show]) {
	                value = 'block';
	            } else {
	                value = 'none';
	            }
	            this.styleChange(item, 'display', value);
	        }

	        if (this.judgeNull(item.model)) {
	            this.valueChange(item, obj[item.model]);
	        }

	        if (this.judgeNull(item.$list)) {
	            this.listChange(item);
	        }

	        if (this.judgeNull(item.if)) {
	            this.ifChange(item, obj[item.if]);
	        }

	        if (this.judgeNull(item.else)) {
	            this.elseChange(item);
	        }
	    }, this);
	};

	exports.default = render;

/***/ }
/******/ ]);