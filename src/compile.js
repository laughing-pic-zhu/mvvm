import {removeAttribute, stringParse, toArray, nodeToFragment} from './util';
import directives from './directives';

var compile = function () {
  var el = this.el;
  var model = this.model;
  var frag = nodeToFragment(el);
  complieTemplate(frag, model);
  el.appendChild(frag);
};

var complieTemplate = function (nodes, model) {
  if ((nodes.nodeType == 1 || nodes.nodeType == 11) && !isScript(nodes)) {
    paserNode(model, nodes);
    if (nodes.hasChildNodes()) {
      nodes.childNodes.forEach(node=> {
        complieTemplate(node, model);
      })
    }
  }
};

var paserNode = function (model, node) {
  var attributes = node.attributes || [];
  var direct_array = [];
  var scope = {
    parentNode: node.parentNode,
    nextNode: node.nextElementSibling,
    el: node,
    model: model,
    direct_array: direct_array
  };

  attributes = toArray(attributes);
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

var isDirective = function (attr) {
  return /v-(\w+)/.test(attr)
};

var isScript = function isScript(el) {
  return el.tagName === 'SCRIPT' && (
      !el.hasAttribute('type') ||
      el.getAttribute('type') === 'text/javascript'
    )
}

export default compile