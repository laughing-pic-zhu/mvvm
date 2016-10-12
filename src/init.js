import compile from './compile';
import parse from './parse';
import observe from './observe';

var init=function(params){
    this.$vm = document.querySelector(params.el);
    this.$model = params.data || {};
    this.$cache = [];

    compile(this.$vm);
    parse();
    observe();
};
