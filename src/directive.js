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
        console.log('update');
        var parser = this.parser;
        var model = parser.model;
        var raw = parser.raw;
        parser.update(model[raw]);
    },

    unbind: function () {
        console.log('unbind');
    }
};

export default Directive