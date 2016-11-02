import compile from './compile';
import parse from './parser';
import {Observe} from './observe';

var MVVM = function(params) {
	this.el = document.querySelector(params.el);
	this.model = params.data || {};
	this.cache = [];
	this.direct_array=[];
	new Observe(this.model);
	compile(this);
	
};

window.MVVM = MVVM;