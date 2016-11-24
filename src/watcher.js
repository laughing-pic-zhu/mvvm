import Depend from './depend'

var Watcher = function (vm, expression, update, _scope) {
  this.vm = vm;
  this._scope = _scope;
  // this.cb = cb;
  this.expression = expression;
  this.update = update;
  Depend.target = this;
  this.value = this.getValue();
  Depend.target = null;
}

Watcher.prototype.run = function () {
  var oldValue = this.value;
  var newValue = this.value = this.getValue();
  this.update(newValue, oldValue);
}

Watcher.prototype.getValue = function () {
  var scope = this._scope.model || this.vm.model;
  var expression = this.expression;
  var getter = getFunction('scope.' + expression);
  return getter(scope);
}

function getFunction(body) {
  return new Function('scope', 'return ' + body)
}

export default Watcher;