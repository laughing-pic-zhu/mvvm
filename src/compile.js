import {textReg} from './util';
var type_array = [
    'v-text', 'v-show', 'v-model', 'v-for', 'v-if', 'v-else'
];

var compile = function (dom) {
    addQueue.call(this, dom);
};

var addQueue = function (nodes) {
    if (nodes.nodeType == 1) {
        if(hasDirective(nodes)){
            this.$cache.push(nodes);
        }
        if (nodes.hasChildNodes()) {
            nodes.childNodes.forEach(function (item) {
                addQueue.call(this, item);
            }, this)
        }
    }
};

var hasDirective = function (node) {
    var flag = false;
    type_array.forEach(attr=> {
        if (node.hasAttribute(attr)) {
            flag = true;
        }
    });
    if (!flag) {
        var textContent = node.textContent;
        if (new RegExp(textReg).test(textContent)) {
            flag=true;
        }
    }
    return flag;
};

export default compile