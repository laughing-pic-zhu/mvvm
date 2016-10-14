import Watch from './watch';
import render from './update'

var observe = function () {
    var model=this.$model;
    Watch.call(this,model, render.bind(this));
};

export default observe