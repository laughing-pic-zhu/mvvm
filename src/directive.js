function Directive(parser) {
    this.parser = parser;
    //this.vm = vm;
    //this.el = el;
    //el._directive = el._directive || [];
    //el._directive.push(this);
}

Directive.prototype = {
    constructor: Directive,

    bind: function () {
        console.log('bind');
    },

    mount: function () {
        this.bind();
        console.log('mount');
    },

    update: function () {
        var parser = this.parser;
        var model = parser.model;

        var raw = parser.raw;

        var val;
        if(typeof model!='object'){
            val=model
        }else{
            val=model[raw]
        }
        parser.update(val);
    },

    unbind: function () {
        console.log('unbind');
    }
};

export default Directive