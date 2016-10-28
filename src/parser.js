import {createAnchor,contrastArray,singleDom,replaceNode,judgeNull,stringParse,removeAttribute} from './util'
import Directive from './directive';
import observe from './observe';
//var parse = function () {
//    this.$cache = this.$cache.map(function (node) {
//        return paserNode.call(this, node);
//    }, this);
//};
//
//var storageDom = function (node) {
//    this.$parentNode = node.parentNode;
//    this.$nextNode = node.nextElementSibling;
//    this.$node = node;
//    this.$direct_array = [];
//};
//
//var onchange = function (attr) {
//    this.$model[attr] = event.target.value;
//};
//
//var paserNode = function (node) {
//    var scope = {};
//    storageDom.call(scope, node);
//    var text = node.getAttribute('v-text');
//    var show = node.getAttribute('v-show');
//    var model = node.getAttribute('v-model');
//    var vFor = node.getAttribute('v-for');
//    var vIf = node.getAttribute('v-if');
//    var vElse = node.hasAttribute('v-else');
//    var textContent = node.textContent;
//    var $model = this.$model;
//    var direct_array = scope.$direct_array;
//    if (textContent) {
//        text = stringParse(textContent);
//    }
//    if (text) {
//        scope.text = text;
//        var descriptor = {
//            expression: 'v-text',
//            raw: text
//        };
//        removeAttribute(node, 'v-text');
//        direct_array.push(new Directive(descriptor, $model, node));
//    }
//    if (show) {
//        scope.show = show;
//        var descriptor = {
//            expression: 'v-show',
//            raw: show,
//            key: 'display'
//        };
//        removeAttribute(node, 'v-show');
//        direct_array.push(new Directive(descriptor, $model, node));
//    }
//    if (model) {
//        if (!$model.hasOwnProperty(model)) {
//            $model[model] = '';
//        }
//        scope.model = model;
//        var descriptor = {
//            expression: 'v-model',
//            raw: model
//        };
//        removeAttribute(node, 'v-model');
//        direct_array.push(new Directive(descriptor, $model, node));
//        node.addEventListener('input', onchange.bind(this, model), false);
//    }
//    if (vFor) {
//        var t_array = vFor.split(/\s+/);
//        var newNode = createAnchor();
//        scope.$end = newNode;
//        scope.$arrayCache = [];
//        scope.$domCache = [];
//
//        replaceNode(newNode, node);
//        var descriptor = {
//            expression: 'v-for',
//            list: t_array[2],
//            obj: t_array[0]
//        };
//
//        removeAttribute(node, 'v-for');
//        direct_array.push(new Directive(descriptor, $model, node));
//    }
//    if (vIf) {
//        scope.if = vIf;
//        var descriptor = {
//            expression: 'v-if',
//            raw: vIf
//        };
//        removeAttribute(node, 'v-if');
//        direct_array.push(new Directive(descriptor, $model, node));
//    }
//
//    if (vElse) {
//        scope.else = true;
//        var descriptor = {
//            expression: 'v-else',
//            raw: vElse
//        };
//        removeAttribute(node, 'v-else');
//        direct_array.push(new Directive(descriptor, $model, node));
//    }
//
//    return scope;
//};


var Parser = function (raw,scope) {
    Object.assign(this, scope);
    this.raw=raw;
    this.parse();
};

Parser.prototype.bind=function(){
    this.directive=new Directive(this);
    this.directive.mount();
};

var extend=function(typeParser){
    return typeParser.prototype=Object.create(Parser.prototype);
};

export  {Parser,extend}