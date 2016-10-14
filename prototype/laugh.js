function laugh(params) {
    var nodes = document.querySelector(params.el);
    var obj = params.data || {};
    //var parseType=['vtext','vif','velse','vfor','vshow'];
    this.cache = [];
    this.compile = function (dom) {
        this.addQueue(dom);
    };

    this.addQueue = function (nodes) {
        if (nodes.nodeType == 1) {
            this.cache.push(nodes);
            if (nodes.hasChildNodes()) {
                nodes.childNodes.forEach(function (item) {
                    this.addQueue(item);
                }, this)
            }
        }
    };

    this.parse = function () {
        this.cache = this.cache.map(function (node) {
            return this.paserNode(node);
        }, this);
    };

    this.storageDom = function (node) {
        this.$parentNode = node.parentNode;
        this.$nextNode = node.nextElementSibling;
        this.$node = node;
    };

    var createFragment = function () {
        return document.createDocumentFragment();
    };

    this.removeAttribute = function (node, attr) {
        if (node.hasAttribute(attr)) {
            node.removeAttribute(attr);
        }
    };

    this.paserNode = function (node) {
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

    this.onchange = function (attr) {
        obj[attr] = event.target.value;
    };

    this.textChange = function (item, content) {
        var node = item.$node;
        if (typeof content == 'function') {
            content = content.apply(obj);
        }
        node.textContent = content || '';
    };

    this.styleChange = function (item, key, value) {
        var node = item.$node;
        node.style[key] = value;
    };

    this.valueChange = function (item, content) {
        var node = item.$node;
        node.value = content || '';
    };

    this.listChange = function (item) {
        var parentNode = item.$parentNode;
        var node = item.$node;
        var end = item.$end;
        var list = item.$list;
        var value = item.$key;
        var arrayCache = item.$arrayCache;
        var domCache = item.$domCache;
        if (arrayCache.length == 0) {
            list.forEach(function (_item) {
                var fragment = createFragment();
                var newNode = node.cloneNode(true);
                newNode.removeAttribute('v-for');
                singleDom(node, newNode, value, _item);
                fragment.appendChild(newNode);
                parentNode.insertBefore(fragment, end);
                arrayCache.push(_item);
                domCache.push(newNode);
            });
        } else {
            var diff = contrastArray(arrayCache, list);
            correctDom(item, diff);
        }
    };


    this.ifChange = function (item, judge) {
        var node = item.$node;
        var nextNode = item.$nextNode;
        var parentNode = item.$parentNode;
        var flag;
        if (judge) {
            this.removeAttribute(node, 'v-if');
            parentNode.appendChild(node);
            flag = true;
        } else {
            parentNode.removeChild(node);
            flag = false;
        }
        nextNode.judge = flag;
    };

    this.elseChange = function (item) {
        var node = item.$node;
        var flag = !node.judge;
        var parentNode = item.$parentNode;
        if (flag) {
            this.removeAttribute(node, 'v-else');
            parentNode.appendChild(node);
        } else {
            parentNode.removeChild(node);
        }
    };

    this.stringParse = function (str) {
        var reg = /^{{(.+)}}$/;
        var array = reg.exec(str);
        if (array) {
            return array.slice(1);
        }
        return '';
    };

    this.judgeNull = function (value) {
        if (value === undefined || value === null || value === '') {
            return false;
        }
        return true;
    };

    var createAnchor = function () {
        return document.createTextNode(' ');
    };

    var contrastArray = function (_old, _new) {
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

    var correctDom = function (item, diff) {
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
            arrayCache[_item]=list[_item];
        });
    };

    var singleDom = function (node, newNode, value, _item) {
        var textContent = node.getAttribute('v-text');
        if (textContent == value) {
            newNode.textContent = _item;
        } else {
            newNode.textContent = '';
        }
    };

    var replaceNode = function (node, old) {
        old.parentNode.replaceChild(node, old);
    };

    this.render = function () {
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

    this.$watch = function (obj, callback) {
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
                    get: function () {
                        return val;
                    },
                    set: function (newVal) {
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
                    value: function (newVal) {
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

    this.observe = function () {
        this.$watch(obj, this.render.bind(this));
    };

    this.init = function () {
        this.compile(nodes);
        this.parse();
        this.observe();
        this.render();
    };

    this.init();
}






