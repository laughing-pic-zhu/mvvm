import compile from './compile';
import parse from './parse';
import observe from './observe';

var MVVM = function (params) {
    this.$vm = document.querySelector(params.el);
    this.$model = params.data || {};
    this.$cache = [];
    compile.call(this,this.$vm);
    parse.call(this);
    observe.call(this);
};
window.MVVM=MVVM;


