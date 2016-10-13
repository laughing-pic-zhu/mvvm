import {createFragment} from './util'

var textChange = function (item, content) {
    var node = item.$node;
    if (typeof content == 'function') {
        content = content.apply(this.$model);
    }
    node.textContent = content || '';
};

var styleChange = function (item, key, value) {
    var node = item.$node;
    node.style[key] = value;
};

var valueChange = function (item, content) {
    var node = item.$node;
    node.value = content || '';
};

var listChange = function (item) {
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


var ifChange = function (item, judge) {
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

var elseChange = function (item) {
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

var render = function () {
    var cache = this.cache;
    cache.forEach(function (item) {
        if (judgeNull(item.text)) {
            item.$textContent = true;
            textChange(item, obj[item.text]);
        }

        if (judgeNull(item.show)) {
            var value;
            if (obj[item.show]) {
                value = 'block';
            } else {
                value = 'none';
            }
            styleChange(item, 'display', value);
        }

        if (judgeNull(item.model)) {
            valueChange(item, obj[item.model]);
        }

        if (judgeNull(item.$list)) {
            listChange(item);
        }

        if (judgeNull(item.if)) {
            ifChange(item, obj[item.if]);
        }

        if (judgeNull(item.else)) {
            elseChange(item);
        }

    });
};

export default render