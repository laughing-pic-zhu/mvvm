import watch from './watch';
import render from './update'

var observe = function () {
    watch(obj, render.bind(this));
};

export default observe