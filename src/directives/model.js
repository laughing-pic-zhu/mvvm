import {Directive, extend} from '../directive'

var VModel = function () {
  Directive.apply(this, arguments);
};

var vmodel = extend(VModel);

vmodel.bind = function () {
  var raw = this.raw;
  var model = this.model;
  if (!model.hasOwnProperty(raw)) {
    model[raw] = '';
  }
  this.el.addEventListener('input', onchange.bind(this, raw), false);
  this._bind();
};

vmodel.update = function (content) {
  this.el.value = content || '';
};

var onchange = function (raw) {
  this.model[raw] = event.target.value;
};

export default VModel