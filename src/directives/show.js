import {Directive,extend} from '../directive'

var VShow = function () {
    Directive.apply(this,arguments);
};

var vshow = extend(VShow);

vshow.bind = function () {
    this._bind();
};

vshow.update = function (isShow) {
    var val = isShow ? 'block' : 'none';
    this.el.style.display = val;
};

export default VShow