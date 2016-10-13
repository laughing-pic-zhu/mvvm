import {createAnchor,contrastArray,correctDom,singleDom,replaceNode,judgeNull,stringParse} from './util'

var parse = function () {
    this.cache = this.cache.map(function (node) {
        return paserNode(node);
    }, this);
};

var paserNode = function (node) {
    var scope = {};
    this.storageDom.call(scope, node);
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

    if (text) {
        scope.text = text;
    }
    if (show) {
        scope.show = show;
    }
    if (model) {
        if (!obj.hasOwnProperty(model)) {
            obj[model] = '';
        }
        scope.model = model;
        node.addEventListener('input', this.onchange.bind(this, model), false);
    }
    if (vFor) {
        var t_array = vFor.split(/\s+/);
        var newNode = createAnchor();
        scope.$end = newNode;
        scope.$arrayCache = [];
        scope.$domCache = [];
        scope.$list = obj[t_array[2]];
        scope.$key = t_array[0];
        replaceNode(newNode, node);
    }
    if (vIf) {
        scope.if = vIf;
    }

    if (vElse) {
        scope.else = true;
    }

    return scope;
};

export default parse