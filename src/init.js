import compile from './compile';
import {Observer} from './observer';

var MVVM = function (params) {
  this.el = document.querySelector(params.el);
  var model = this.model = params.data || {};
  this.direct_array = [];
  this.observer = new Observer(model);
  this.compile();
};

MVVM.prototype.compile = compile;

window.MVVM = MVVM;