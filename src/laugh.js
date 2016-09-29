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

    this.paserNode = function (node) {
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
        var temp = {
            node: node
        };

        if (text) {
            temp.text = text;
        }
        if (show) {
            temp.show = show;
        }
        if (model) {
            if (!obj.hasOwnProperty(model)) {
                obj[model] = '';
            }
            temp.model = model;
            node.addEventListener('input', this.onchange.bind(this, model), false);
        }

        if (vFor) {
            var t_array = vFor.split(/\s+/);
            temp.list = {
                value: t_array[0],
                list: t_array[2]
            };
        }
        if (vIf) {
            temp.if = vIf;
        }

        if (vElse) {
            temp.else = true;
        }

        return temp;
    };

    this.onchange = function (attr) {
        obj[attr] = event.target.value;
    };

    this.textChange = function (node, content) {
        if (typeof content == 'function') {
            content = content.apply(obj);
        }
        node.textContent = content || '';
    };

    this.styleChange = function (node, key, value) {
        node.style[key] = value;
    };

    this.valueChange = function (node, content) {
        node.value = content || '';
    };

    this.listChange = function (node, list) {
        //this.$parentNode=111;

        var textContent = node.getAttribute('v-text');
        var _list = obj[list.list];
        var parentNode=this.operateParentNode(node, _list);
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

    this.ifChange = function (node, judge) {
        var nextNode = node.nextElementSibling;
        if(!nextNode){
            nextNode=node._nextNode;
        }
        node._nextNode=nextNode;
        var flag;
        if (judge) {
            node.removeAttribute('v-if');
            flag = true;
        } else {
            var parentNode = node.parentNode;
            parentNode.removeChild(node);
            flag = false;
        }
        nextNode.judge = flag;
    };

    this.elseChange = function (node) {
        var flag = !node.judge;
        if (flag) {
            node.removeAttribute('v-else');
        } else {
            var parentNode = node.parentNode;
            parentNode.removeChild(node);
        }
    };

    this.operateParentNode = function (node, list) {
        var parentNode=node.parentNode;
        if (!parentNode) {
            parentNode = list._parentNode;
        }

        if (!list._parentNode) {
            list._parentNode = parentNode;
        }
        return parentNode;
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
                this.textChange(item.node, obj[item.text]);
            }

            if (this.judgeNull(item.show)) {
                var value;
                if (obj[item.show]) {
                    value = 'block';
                } else {
                    value = 'none';
                }
                this.styleChange(item.node, 'display', value);
            }

            if (this.judgeNull(item.model)) {
                this.valueChange(item.node, obj[item.model]);
            }

            if (this.judgeNull(item.list)) {
                this.listChange(item.node, item.list);
            }

            if (this.judgeNull(item.if)) {
                this.ifChange(item.node, obj[item.if]);
            }

            if (this.judgeNull(item.else)) {
                this.elseChange(item.node);
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






