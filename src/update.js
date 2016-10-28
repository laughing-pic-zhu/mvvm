import {createFragment,singleDom,contrastArray} from './util'

var textUpdate = function (directive) {
    var node = this.$node;
    var descriptor = directive.descriptor;
    var raw = descriptor.raw;
    var vm = directive.vm;
    var content = vm[raw];
    if (typeof content == 'function') {
        content = content.apply(vm);
    }
    node.textContent = content || '';
};

var styleUpdate = function (directive) {
    var node = this.$node;
    var descriptor = directive.descriptor;
    var key = descriptor.key;
    var raw = descriptor.raw;
    var vm = directive.vm;
    var value = vm[raw] ? 'block' : 'none';
    node.style[key] = value;
};

var valueUpdate = function (directive) {
    var node = this.$node;
    var descriptor = directive.descriptor;
    var raw = descriptor.raw;
    var vm = directive.vm;
    var content = vm[raw];

    node.value = content || '';
};

var listUpdate = function (directive) {
    var descriptor=directive.descriptor;
    var vm = directive.vm;
    var list=vm[descriptor.list];
    var obj=descriptor.obj;

    var parentNode = this.$parentNode;
    var node = this.$node;
    var end = this.$end;
    var arrayCache = this.$arrayCache;
    var domCache = this.$domCache;

    if (arrayCache.length == 0) {
        list.forEach(function (_item) {
            var fragment = createFragment();
            var newNode = node.cloneNode(true);
            singleDom(node, newNode, obj, _item);
            fragment.appendChild(newNode);
            parentNode.insertBefore(fragment, end);
            arrayCache.push(_item);
            domCache.push(newNode);
        });
    } else {
        var diff = contrastArray(arrayCache, list);
        correctDom.call(this,directive,diff);
    }
};

var correctDom = function (directive,diff) {
    var diffArray = diff.slice();
    var domCache = this.$domCache;
    var arrayCache = this.$arrayCache;
    var node = this.$node;
    var end = this.$end;
    var parentNode = this.$parentNode;

    var descriptor=directive.descriptor;
    var obj = descriptor.obj;
    var vm=directive.vm;
    var list = vm[descriptor.list];
    diffArray.forEach(function (_item) {
        var fragment = createFragment();
        var newNode = node.cloneNode(true);
        if (list[_item]) {
            singleDom(node, newNode, obj, list[_item]);
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

var ifUpdate = function (directive) {
    var descriptor = directive.descriptor;
    var raw = descriptor.raw;
    var vm = directive.vm;
    var judge = vm[raw];
    var node = this.$node;
    var nextNode = this.$nextNode;
    var parentNode = this.$parentNode;
    var flag;
    if (judge) {
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
        parentNode.appendChild(node);
    } else {
        parentNode.removeChild(node);
    }
};

var render = function () {
    var cache = this.$cache;
    cache.forEach(function (item) {
        var direct_array = item.direct_array;
        direct_array.forEach(directive=> {
            directive.directive.update();
            //type_array[expression].call(item, directive);
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