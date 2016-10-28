import {Parser,extend} from '../parser'
import {storageDom,replaceNode,createFragment} from '../util'
import directives from './index';

var VFor = function () {
    Parser.apply(this,arguments);
};

var vfor = extend(VFor);

vfor.parse = function () {
    console.log('vfor  parse');
    var node=this.node;
    var t_array = this.raw.split(/\s+/);
    this.alias=t_array[0];
    this.raw=t_array[2];
    this.newPosition=storageDom(node);
    this.arrayCache = [];
    this.domCache = [];

    this.bind();
};

vfor.update = function (items,item) {
    var parentNode = this.parentNode;
    var node = this.node;
    var newPosition = this.newPosition;
    var arrayCache = this.arrayCache;
    var domCache = this.domCache;
    var attrs=this.attrs;
    if (arrayCache.length == 0) {
        items.forEach(function (_item) {
            var fragment = createFragment();
            var newNode = node.cloneNode(true);
            var direct_array=[];
            var scope={
                node: newNode,
                direct_array: direct_array,
                model: _item
            };

            attrs.forEach(function(attr){
                var name = attr.name;
                var val = attr.value;
                var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
                var Parser = directives[directiveType];
                var parser=new Parser(val,scope);
                direct_array.push(parser);
                parser.directive.update();
            });

            //singleDom(node, newNode, item, _item);
            fragment.appendChild(newNode);
            parentNode.insertBefore(fragment, newPosition);
            arrayCache.push(_item);
            domCache.push(newNode);
        });
    } else {
        var diff = contrastArray(arrayCache, items);
        correctDom.call(this,items,item,diff);
    }
};

var correctDom = function (items,item,diff) {
    var diffArray = diff.slice();
    var domCache = this.domCache;
    var arrayCache = this.arrayCache;
    var node = this.node;
    var newPosition = this.newPosition;
    var parentNode = this.parentNode;

    diffArray.forEach(function (_item) {
        var fragment = createFragment();
        var newNode = node.cloneNode(true);
        var val=items[item];
        if (val) {
            singleDom(node, newNode, alias, val);
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
            parentNode.insertBefore(fragment, newPosition);
        }
        domCache[_item] = newNode;
        arrayCache[_item]=items[_item];
    });
};

export default VFor