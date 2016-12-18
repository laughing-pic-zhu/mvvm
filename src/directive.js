import Watcher from './watcher'


function Directive(raw,scope) {
    Object.assign(this, scope);
    this._scope=scope;
    this.raw = raw;
    var el=this.el;
    el._directive = el._directive || [];
    el._directive.push(this);
    this.bind();
}

Directive.prototype = {
    constructor: Directive,

    _bind: function() {
        var _scope=this._scope;
        var expression=this.raw;
        var watcher=new Watcher(this.model,expression, this.update.bind(this),_scope);
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