import {Parser,extend} from '../parser'

var VShow = function () {
    Parser.apply(this,arguments);
};

var vshow = extend(VShow);

vshow.parse = function () {
    this.bind();
};


vshow.update = function (isShow) {
    var val = isShow ? 'block' : 'none';
    this.node.style.display = val;
};

export default VShow