import Watcher from './watcher'


function Directive(vm,raw,scope) {
    this.vm = vm;
    Object.assign(this, scope);
    this.raw = raw;
    var el=this.el;
    el._directive = el._directive || [];
    el._directive.push(this);
    
    this.bind();
}

Directive.prototype = {
    constructor: Directive,

    _bind: function() {
        var vm = this.vm;
        var expression=this.raw;
        var watcher=new Watcher(vm, expression, this.update.bind(this));
        this.update(watcher.value);
    },

    unbind: function() {
        console.log('directive unbind');
    }
};


var extend=function(typeDirective){
    return typeDirective.prototype=Object.create(Directive.prototype);
};

export {Directive,extend}