import {createFragment,singleDom,contrastArray,correctDom,judgeNull,removeAttribute} from './util'

var textUpdate = function (item) {
    var node = this.$node;
    var descriptor = item.descriptor;
    var raw = descriptor.raw;
    var vm = item.vm;
    var content = vm[raw];
    if (typeof content == 'function') {
        content = content.apply(vm);
    }
    node.textContent = content || '';
};

var styleUpdate = function (item) {
    var node = this.$node;
    var descriptor = item.descriptor;
    var key = descriptor.key;
    var raw = descriptor.raw;
    var vm = item.vm;
    var value = vm[raw] ? 'block' : 'none';
    node.style[key] = value;
};

var valueUpdate = function (item) {
    var node = this.$node;
    var descriptor = item.descriptor;
    var raw = descriptor.raw;
    var vm = item.vm;
    var content = vm[raw];

    node.value = content || '';
};

var listUpdate = function (item) {
    var parentNode = this.$parentNode;
    var node = this.$node;
    var end = this.$end;
    var list = this.$list;
    var value = this.$key;
    var arrayCache = this.$arrayCache;
    var domCache = this.$domCache;
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
        correctDom(this, diff);
    }
};


var ifUpdate = function (item) {
    var descriptor = item.descriptor;
    var raw = descriptor.raw;
    var vm = item.vm;
    var judge = vm[raw];
    var node = this.$node;
    var nextNode = this.$nextNode;
    var parentNode = this.$parentNode;
    var flag;
    if (judge) {
        removeAttribute(node, 'v-if');
        parentNode.appendChild(node);
        flag = true;
    } else {
        parentNode.removeChild(node);
        flag = false;
    }
    nextNode.judge = flag;
};

var elseUpdate = function () {
    var node = this.$node;
    var flag = !node.judge;
    var parentNode = this.$parentNode;
    if (flag) {
        removeAttribute(node, 'v-else');
        parentNode.appendChild(node);
    } else {
        parentNode.removeChild(node);
    }
};

var update = function () {

};

var render = function () {
    var cache = this.$cache;
    var model = this.$model;
    cache.forEach(function (item) {
        var $direct_array = item.$direct_array;
        $direct_array.forEach(_item=> {
            var descriptor = _item.descriptor;
            var expression = descriptor.expression;
            type_array[expression].call(item, _item);
        });
    });
};


var type_array = {
    'v-text': textUpdate,
    'v-show': styleUpdate,
    'v-model': valueUpdate,
    'v-for': listUpdate,
    'v-if': ifUpdate,
    'v-else': elseUpdate
};
export default render