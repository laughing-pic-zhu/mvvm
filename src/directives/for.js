import {Parser,extend} from '../parser'
import {storageDom,replaceNode,createFragment,contrastArray} from '../util'
import directives from './index';

var VFor = function () {
    Parser.apply(this, arguments);
};

var vfor = extend(VFor);

vfor.parse = function () {
    console.log('vfor  parse');
    var node = this.node;
    var t_array = this.raw.split(/\s+/);
    this.alias = t_array[0];
    this.raw = t_array[2];
    this.newPosition = storageDom(node);
    this.arrayCache = [];
    this.domCache = [];

    this.bind();
};

vfor.update = function (newItems, oldItem) {
    var arrayCache = this.arrayCache;
    var parentNode = this.parentNode;
    var newPosition = this.newPosition;
    if (arrayCache.length == 0) {
        newItems.forEach(item=> {
            var fragment=this.createFragment(item);
            parentNode.insertBefore(fragment, newPosition);
            arrayCache.push(item);

        });
    } else {
        var diff = contrastArray(arrayCache, newItems);
        this.correctDom(newItems, oldItem, diff);
    }
};

vfor.createFragment = function (item) {
    var attrs = this.attrs;
    var node = this.node;
    var fragment = createFragment();
    var newNode = node.cloneNode(true);
    var direct_array = [];
    var domCache = this.domCache;

    var scope = {
        node: newNode,
        direct_array: direct_array,
        model: item
    };

    attrs.forEach(function (attr) {
        var name = attr.name;
        var val = attr.value;
        var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
        var Parser = directives[directiveType];
        var parser = new Parser(val, scope);
        direct_array.push(parser);
        parser.directive.update();
    });
    domCache.push(newNode);
    fragment.appendChild(newNode);
    return fragment;
};

vfor.correctDom = function (newItems, oldItem, diff) {
    var diffArray = diff.slice();
    var domCache = this.domCache;
    var arrayCache = this.arrayCache;
    var newPosition = this.newPosition;
    var parentNode = this.parentNode;

    diffArray.forEach(_item=> {
        var fragment;
        var newVal = newItems[_item];
        var oldDomCache=domCache[_item];
        if (newVal) {
            fragment=this.createFragment(newVal);
            if (oldDomCache) {
                replaceNode(fragment, domCache[_item]);
            } else {
                parentNode.insertBefore(fragment, newPosition);
            }
            arrayCache[_item] = newItems[_item];
        } else {
            parentNode.removeChild(domCache[_item]);
            delete domCache.splice(_item,1);
            delete arrayCache.splice(_item,1);
        }
    });
};

export default VFor