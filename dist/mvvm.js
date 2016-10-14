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

	var _observe = __webpack_require__(4);

	var _observe2 = _interopRequireDefault(_observe);

	var _update = __webpack_require__(6);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MVVM = function MVVM(params) {
	    this.$vm = document.querySelector(params.el);
	    this.$model = params.data || {};
	    this.$cache = [];
	    _compile2.default.call(this, this.$vm);
	    _parse2.default.call(this);
	    _observe2.default.call(this);
	    _update2.default.call(this);
	};
	window.MVVM = MVVM;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var compile = function compile(dom) {
	    addQueue.call(this, dom);
	};

	var addQueue = function addQueue(nodes) {
	    if (nodes.nodeType == 1) {
	        this.$cache.push(nodes);
	        if (nodes.hasChildNodes()) {
	            nodes.childNodes.forEach(function (item) {
	                addQueue.call(this, item);
	            }, this);
	        }
	    }
	};

	exports.default = compile;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(3);

	var parse = function parse() {
	    this.$cache = this.$cache.map(function (node) {
	        return paserNode.call(this, node);
	    }, this);
	};

	var storageDom = function storageDom(node) {
	    this.$parentNode = node.parentNode;
	    this.$nextNode = node.nextElementSibling;
	    this.$node = node;
	};

	var paserNode = function paserNode(node) {
	    var scope = {};
	    storageDom.call(scope, node);
	    var text = node.getAttribute('v-text');
	    var show = node.getAttribute('v-show');
	    var model = node.getAttribute('v-model');
	    var vFor = node.getAttribute('v-for');
	    var vIf = node.getAttribute('v-if');
	    var vElse = node.hasAttribute('v-else');
	    var textContent = node.textContent;
	    var $model = this.$model;
	    if (textContent) {
	        text = (0, _util.stringParse)(textContent);
	    }

	    if (text) {
	        scope.text = text;
	    }
	    if (show) {
	        scope.show = show;
	    }
	    if (model) {
	        if (!$model.hasOwnProperty(model)) {
	            $model[model] = '';
	        }
	        scope.model = model;
	        node.addEventListener('input', this.onchange.bind(this, model), false);
	    }
	    if (vFor) {
	        var t_array = vFor.split(/\s+/);
	        var newNode = (0, _util.createAnchor)();
	        scope.$end = newNode;
	        scope.$arrayCache = [];
	        scope.$domCache = [];
	        scope.$list = $model[t_array[2]];
	        scope.$key = t_array[0];
	        (0, _util.replaceNode)(newNode, node);
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
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    } else {
	        for (var i = 0; i < _new.length; i++) {
	            if (_new[i] !== _old[i]) {
	                a.push(i);
	            }
	        }
	    }
	    return a;
	};

	var correctDom = function correctDom(item, diff) {
	    var diffArray = diff.slice();
	    var domCache = item.$domCache;
	    var arrayCache = item.$arrayCache;
	    var node = item.$node;
	    var end = item.$end;
	    var parentNode = item.$parentNode;
	    var value = item.$key;
	    var list = item.$list;
	    diffArray.forEach(function (_item) {
	        var fragment = createFragment();
	        var newNode = node.cloneNode(true);
	        newNode.removeAttribute('v-for');
	        if (list[_item]) {
	            singleDom(node, newNode, value, list[_item]);
	        } else {
	            parentNode.removeChild(domCache[_item]);
	            delete domCache[_item];
	            delete arrayCache[_item];
	            return;
	        }
	        fragment.appendChild(newNode);
	        if (domCache[_item]) {
	            replaceNode(fragment, domCache[_item]);
	        } else {
	            parentNode.insertBefore(fragment, end);
	        }
	        domCache[_item] = newNode;
	        arrayCache[_item] = list[_item];
	    });
	};

	var singleDom = function singleDom(node, newNode, value, _item) {
	    var textContent = node.getAttribute('v-text');
	    if (textContent == value) {
	        newNode.textContent = _item;
	    } else {
	        newNode.textContent = '';
	    }
	};

	var replaceNode = function replaceNode(node, old) {
	    old.parentNode.replaceChild(node, old);
	};

	var judgeNull = function judgeNull(value) {
	    if (value === undefined || value === null || value === '') {
	        return false;
	    }
	    return true;
	};

	var stringParse = function stringParse(str) {
	    var reg = /^{{(.+)}}$/;
	    var array = reg.exec(str);
	    if (array) {
	        return array.slice(1);
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

	exports.createAnchor = createAnchor;
	exports.contrastArray = contrastArray;
	exports.correctDom = correctDom;
	exports.singleDom = singleDom;
	exports.replaceNode = replaceNode;
	exports.judgeNull = judgeNull;
	exports.stringParse = stringParse;
	exports.createFragment = createFragment;
	exports.removeAttribute = removeAttribute;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _watch = __webpack_require__(5);

	var _watch2 = _interopRequireDefault(_watch);

	var _update = __webpack_require__(6);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var observe = function observe() {
	    var model = this.$model;
	    _watch2.default.call(this, model, _update2.default.bind(this));
	};

	exports.default = observe;

/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(3);

	var textChange = function textChange(item, content) {
	    var node = item.$node;
	    if (typeof content == 'function') {
	        content = content.apply(this.$model);
	    }
	    node.textContent = content || '';
	};

	var styleChange = function styleChange(item, key, value) {
	    var node = item.$node;
	    node.style[key] = value;
	};

	var valueChange = function valueChange(item, content) {
	    var node = item.$node;
	    node.value = content || '';
	};

	var listChange = function listChange(item) {
	    var parentNode = item.$parentNode;
	    var node = item.$node;
	    var end = item.$end;
	    var list = item.$list;
	    var value = item.$key;
	    var arrayCache = item.$arrayCache;
	    var domCache = item.$domCache;
	    if (arrayCache.length == 0) {
	        list.forEach(function (_item) {
	            var fragment = (0, _util.createFragment)();
	            var newNode = node.cloneNode(true);
	            newNode.removeAttribute('v-for');
	            (0, _util.singleDom)(node, newNode, value, _item);
	            fragment.appendChild(newNode);
	            parentNode.insertBefore(fragment, end);
	            arrayCache.push(_item);
	            domCache.push(newNode);
	        });
	    } else {
	        var diff = (0, _util.contrastArray)(arrayCache, list);
	        (0, _util.correctDom)(item, diff);
	    }
	};

	var ifChange = function ifChange(item, judge) {
	    var node = item.$node;
	    var nextNode = item.$nextNode;
	    var parentNode = item.$parentNode;
	    var flag;
	    if (judge) {
	        (0, _util.removeAttribute)(node, 'v-if');
	        parentNode.appendChild(node);
	        flag = true;
	    } else {
	        parentNode.removeChild(node);
	        flag = false;
	    }
	    nextNode.judge = flag;
	};

	var elseChange = function elseChange(item) {
	    var node = item.$node;
	    var flag = !node.judge;
	    var parentNode = item.$parentNode;
	    if (flag) {
	        (0, _util.removeAttribute)(node, 'v-else');
	        parentNode.appendChild(node);
	    } else {
	        parentNode.removeChild(node);
	    }
	};

	var render = function render() {
	    var cache = this.$cache;
	    var model = this.$model;
	    cache.forEach(function (item) {
	        if ((0, _util.judgeNull)(item.text)) {
	            item.$textContent = true;
	            textChange(item, model[item.text]);
	        }

	        if ((0, _util.judgeNull)(item.show)) {
	            var value;
	            if (model[item.show]) {
	                value = 'block';
	            } else {
	                value = 'none';
	            }
	            styleChange(item, 'display', value);
	        }

	        if ((0, _util.judgeNull)(item.model)) {
	            valueChange(item, model[item.model]);
	        }

	        if ((0, _util.judgeNull)(item.$list)) {
	            listChange(item);
	        }

	        if ((0, _util.judgeNull)(item.if)) {
	            ifChange(item, model[item.if]);
	        }

	        if ((0, _util.judgeNull)(item.else)) {
	            elseChange(item);
	        }
	    });
	};

	exports.default = render;

/***/ }
/******/ ]);