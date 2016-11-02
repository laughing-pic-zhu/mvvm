import { Directive, extend } from '../directive'
import { storageDom, replaceNode, createFragment, contrastArray } from '../util'
import directives from './index';
import { defineProperty } from '../observe';

var VFor = function() {
    Directive.apply(this, arguments);
};

var vfor = extend(VFor);

vfor.bind = function() {
    console.log('vfor  bind');
    var el = this.el;
    var t_array = this.raw.split(/\s+/);
    this.alias = t_array[0];
    this.raw = t_array[2];
    this.newPosition = storageDom(el);
    this.arrayCache = [];
    this.domCache = [];

    this._bind();
};

vfor.update = function(newItems, oldItem) {
    var arrayCache = this.arrayCache;
    var parentNode = this.parentNode;
    var newPosition = this.newPosition;
    var domCache = this.domCache;
    if (arrayCache.length == 0) {
        newItems.forEach(item => {
            var fragment = this.createFragment(item);
            var cache = fragment.children[0];
            parentNode.insertBefore(fragment, newPosition);
            arrayCache.push(item);
            domCache.push(cache);
        });
    } else {
        var diff = contrastArray(arrayCache, newItems);
        this.correctDom(newItems, oldItem, diff);
    }
};

vfor.createFragment = function(item) {
    var attrs = this.attrs;
    var el = this.el;
    var fragment = createFragment();
    var newNode = el.cloneNode(true);
    var direct_array = this.direct_array;
    var vm = this.vm;

    var _scope = Object.create(vm);
    _scope.model = Object.create(_scope.model);
    _scope.el = newNode;

    defineProperty(_scope.model, this.alias, item);
    
    attrs.forEach(function(attr) {
        var name = attr.name;
        var val = attr.value;
        var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
        var Directive = directives[directiveType];
        var directive = new Directive(vm, val, _scope);
        direct_array.push(directive);
    });

    fragment.appendChild(newNode);
    return fragment;
};

vfor.correctDom = function(newItems, oldItem, diff) {
    var type = diff.type;
    var diffArray = diff.slice();
    var domCache = this.domCache;
    var arrayCache = this.arrayCache;
    var newPosition = this.newPosition;
    var parentNode = this.parentNode;

    diffArray.forEach(index => {
        var fragment;
        var newVal = newItems[index];
        var oldDomCache = domCache[index];
        fragment = this.createFragment(newVal);
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
            replaceNode(fragment, oldDomCache);
        }
    });
};

export default VFor