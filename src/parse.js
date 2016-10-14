import {createAnchor,contrastArray,correctDom,singleDom,replaceNode,judgeNull,stringParse} from './util'

var parse = function () {
    this.$cache = this.$cache.map(function (node) {
        return paserNode.call(this,node);
    }, this);
};

var storageDom = function (node) {
    this.$parentNode = node.parentNode;
    this.$nextNode = node.nextElementSibling;
    this.$node = node;
};

var paserNode = function (node) {
    var scope = {};
    storageDom.call(scope, node);
    var text = node.getAttribute('v-text');
    var show = node.getAttribute('v-show');
    var model = node.getAttribute('v-model');
    var vFor = node.getAttribute('v-for');
    var vIf = node.getAttribute('v-if');
    var vElse = node.hasAttribute('v-else');
    var textContent = node.textContent;
    var $model=this.$model;
    if (textContent) {
        text = stringParse(textContent);
    }

    if (text) {
        scope.text = text;
    }
    if (show) {
        scope.show = show;
    }
    if (model) {
        if (!$model.hasOwnProperty(model)) {
            $model[model] = '';
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
        scope.$list = $model[t_array[2]];
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