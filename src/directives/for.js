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
    var domCache = this.domCache;
    if (arrayCache.length == 0) {
        newItems.forEach(item=> {
            var fragment = this.createFragment(item);
            var cache=fragment.children[0];
            parentNode.insertBefore(fragment, newPosition);
            arrayCache.push(item);
            domCache.push(cache);
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

    fragment.appendChild(newNode);
    return fragment;
};

vfor.correctDom = function (newItems, oldItem, diff) {
    var type = diff.type;
    var diffArray = diff.slice();
    var domCache = this.domCache;
    var arrayCache = this.arrayCache;
    var newPosition = this.newPosition;
    var parentNode = this.parentNode;

    diffArray.forEach(index=> {
        var fragment;
        var newVal = newItems[index];
        var oldDomCache = domCache[index];
        fragment = this.createFragment(newVal);
        if (type == 'add') {
            domCache.push(fragment.children[0]);
            arrayCache[index] = newItems[index];

            parentNode.insertBefore(fragment, newPosition);
        } else if(type == 'delete'){
            parentNode.removeChild(domCache[index]);
            delete domCache.splice(index, 1);
            delete arrayCache.splice(index, 1);
        }else{
            domCache[index]=fragment.children[0];
            arrayCache[index]=newVal;
            replaceNode(fragment,oldDomCache);
        }
    });
};

export default VFor