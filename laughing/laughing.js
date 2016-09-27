function mvvm(obj, nodes) {
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
        var bind = node.getAttribute('v-bind');
        var temp = {
            node: node
        };
        if (text) {
            temp.text=text;
        }
        if (show) {
            temp.show=show;
        }
        if (bind) {
            temp.bind=bind;
            node.addEventListener('input', this.onchange.bind(this, bind), false);
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
        node.textContent = content;
    };

    this.styleChange = function (node, key, value) {
        node.style[key] = value;
    };

    this.valueChange = function (node, content) {
        node.value = content;
    };

    this.judgeNull=function(value){
        if(value===undefined||value===null||value===''){
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
            if (this.judgeNull(item.bind)) {
                this.valueChange(item.node, obj[item.bind]);
            }
        }, this);
    };

    this.observe=function(){
        new Watch(obj,this.render.bind(this));
    };

    this.init = function () {
        this.compile(nodes);
        this.pasers();
        this.observe();
        this.render();
    };

    this.init();
}



