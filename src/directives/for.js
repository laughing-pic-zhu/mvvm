import {Directive, extend} from '../directive'
import {storageDom, replaceNode, createFragment, beforeInsert} from '../util'
import directives from './index';
import {defineProperty} from '../observer';
import Fragment from '../Fragment';

var VFor = function () {
  Directive.apply(this, arguments);
};

var vfor = extend(VFor);

vfor.bind = function () {
  console.log('vfor  bind');
  var el = this.el;
  var t_array = this.raw.split(/\s+/);
  this.alias = t_array[0];
  this.raw = t_array[2];

  this.newPosition = storageDom(el);
  this.beforePosition = beforeInsert(this.newPosition);
  this.frags = [];
  this.init = true;
  // this.cache = {};
  this._bind();
};

vfor.update = function (newItems) {
  var init = this.init;
  var parentNode = this.parentNode;
  var newPosition = this.newPosition;
  var oldFrags = this.frags;
  var frags = this.frags = [];
  // var cache = this.cache;
  if (init) {
    newItems.forEach(item => {
      var fragment = this.createFragment(item);
      var frag = new Fragment(fragment, item);
      // cache[item] = frag;
      this.frags.push(frag);
      parentNode.insertBefore(fragment, newPosition);
      this.init = false;
    });
  } else {
    newItems.forEach(item=> {
      let frag;
      oldFrags.forEach(_frag=> {
        if (item === _frag.raw) {
          frag = _frag;
        }
      });
      if (frag) {
        frag.reused = true;
      } else {
        var fragment = this.createFragment(item);
        frag = new Fragment(fragment, item);
      }
      frags.push(frag);
      // cache[item] = frag;
    });

    oldFrags.forEach(frag=> {
      if (!frag.reused) {
        //remove
        frag.remove();
      }
    });

    frags.forEach((frag, index)=> {
      if (frag.reused) {
        //move
      } else {
        //insert
        var preFrag = frags[index - 1];
        if (!preFrag) {
          preFrag = new Fragment(this.beforePosition);
        }
        preFrag.insert(frag);
      }
      frag.reused = false;
    });

    // var diff = contrastArray(arrayCache, newItems);
    // this.correctDom(newItems, arrayCache, diff);
  }
};

vfor.createFragment = function (item) {
  var attrs = this.attrs;
  var el = this.el;
  var fragment = createFragment();
  var newNode = el.cloneNode(true);
  var direct_array = this.direct_array;
  // var cache = this.cache;
  var _scope = Object.create(this._scope);
  _scope.model = Object.create(_scope.model);
  _scope.el = newNode;

  defineProperty(_scope.model, this.alias, item);

  attrs.forEach(function (attr) {
    var name = attr.name;
    var val = attr.value;
    var directiveType = 'v' + /v-(\w+)/.exec(name)[1];
    var Directive = directives[directiveType];
    var directive = new Directive(val, _scope);
    direct_array.push(directive);
  });

  fragment.appendChild(newNode);

  // cache[item] = fragment;
  return fragment;
};

export default VFor
