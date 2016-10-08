function laugh(params) {
    var nodes = document.querySelector(params.el);
    var obj = params.data || {};
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

    this.pasers = function () {
        this.cache = this.cache.map(function (node) {
            return this.paserNode(node);
        }, this);
    };

    this.storageDom=function(node){
        this.$parentNode=node.parentNode;
        this.$nextNode=node.nextElementSibling;
        this.$node=node;
        //this.$parent=node.parentNode;
    };

    this.paserNode = function (node) {
        var scope={};
        this.storageDom.call(scope,node);
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
            scope.list = {
                value: t_array[0],
                list: t_array[2]
            };

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
        var node=item.$node;
        if (typeof content == 'function') {
            content = content.apply(obj);
        }
        node.textContent = content || '';
    };

    this.styleChange = function (item, key, value) {
        var node=item.$node;
        node.style[key] = value;
    };

    this.valueChange = function (item, content) {
        var node=item.$node;
        node.value = content || '';
    };

    this.listChange = function (item, list) {
        var parentNode=item.$parentNode;
        var node=item.$node;
        var textContent = node.getAttribute('v-text');
        var _list = obj[list.list];
        var value = list.value;
        parentNode.textContent='';
        _list.forEach(function (item) {
            var newNode = node.cloneNode(true);
            newNode.removeAttribute('v-for');
            if (textContent == value) {
                newNode.textContent = item;
            } else {
                newNode.textContent = '';
            }
            parentNode.appendChild(newNode);
        })
    };

    this.ifChange = function (item, judge) {
        var node=item.$node;
        var nextNode=item.$nextNode;
        var parentNode=item.$parentNode;
        var flag;
        if (judge) {
            node.removeAttribute('v-if');
            parentNode.appendChild(node);
            flag = true;
        } else {
            parentNode.removeChild(node);
            flag = false;
        }
        nextNode.judge = flag;
    };

    this.elseChange = function (item) {
        var node=item.$node;
        var flag = !node.judge;
        var parentNode=item.$parentNode;
        if (flag) {
            node.removeAttribute('v-else');
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

    this.render = function () {
        var cache = this.cache;
        cache.forEach(function (item) {
            if (this.judgeNull(item.text)) {
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

            if (this.judgeNull(item.list)) {
                this.listChange(item, item.list);
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
        this.pasers();
        this.observe();
        this.render();
    };

    this.init();
}






