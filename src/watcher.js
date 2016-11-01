import Depend from './depend'

var Watcher = function(vm, expression, update) {
	this.vm = vm;
	// this.cb = cb;
	this.expression = expression;
	this.update = update;
	Depend.target = this;
	this.value = this.getValue();
	Depend.target = null;
}

Watcher.prototype.run=function(){
	this.value=this.getValue();
	this.update(this.value);
}

Watcher.prototype.getValue = function() {
	var vm = this.vm;
	var model = vm.model;
	var expression = this.expression;
	var getter = getFunction('scope.' + expression);
	return getter(model);
}

function getFunction(body) {
	return new Function('scope', 'return ' + body)
}

export default Watcher;