import compile from './compile';
import {Observe} from './observe';

var MVVM = function (params) {
  var el = this.el = document.querySelector(params.el);
  var model = this.model = params.data || {};
  this.direct_array = [];
  new Observe(model);
  compile(el,model);
};

window.MVVM = MVVM;