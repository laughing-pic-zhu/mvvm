import {textReg, removeAttribute, stringParse, toArray} from './util';
import directives from './directives';

var type_array = [
  'v-text', 'v-show', 'v-model', 'v-for', 'v-if', 'v-else'
];

var compile = function (nodes, model) {
  var cache = [];
  complieTemplate(nodes, cache);
  parseTemplate(model, cache);
};

var complieTemplate = function (nodes, cache) {
  if (nodes.nodeType == 1) {
    if (hasDirective(nodes)) {
      cache.push(nodes);
    }
    if (nodes.hasChildNodes()) {
      nodes.childNodes.forEach(item=> {
        complieTemplate(item,cache);
      })
    }
  }
};

var parseTemplate = function (model, cache) {
  cache.forEach(node=> {
    paserNode(model, node);
  })
};

var paserNode = function (model, node) {
  var direct_array = [];
  var scope = {
    parentNode: node.parentNode,
    nextNode: node.nextElementSibling,
    el: node,
    model: model,
    direct_array: direct_array
  };

  var attributes = toArray(node.attributes);
  var textContent = node.textContent;
  var attrs = [];
  var vfor;

  attributes.forEach(attr => {
    var name = attr.name;
    if (isDirective(name)) {
      if (name == 'v-for') {
        vfor = attr;
      } else {
        attrs.push(attr);
      }
      removeAttribute(node, name);
    }
  });

  //bug  nodeType=3
  var textValue = stringParse(textContent);
  if (textValue) {
    attrs.push({
      name: 'v-text',
      value: textValue
    });
    node.textContent = '';
  }

  if (vfor) {
    scope.attrs = attrs;
    attrs = [vfor];
  }

  attrs.forEach(function (attr) {
    var name = attr.name;
    var val = attr.value;
    var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
    var Directive = directives[directiveType];
    if (Directive) {
      direct_array.push(new Directive(val, scope));
    }
  });
};


var hasDirective = function (node) {
  var flag = false;
  type_array.forEach(attr => {
    if (node.hasAttribute(attr)) {
      flag = true;
    }
  });
  if (!flag) {
    var textContent = node.textContent;
    if (new RegExp(textReg).test(textContent)) {
      flag = true;
    }
  }
  return flag;
};

var isDirective = function (attr) {
  return /v-(\w.)/.test(attr)
};

export default compile