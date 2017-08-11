import { Directive, extend } from '../directive'

var VShow = function () {
    Directive.apply(this, arguments);
};

var vshow = extend(VShow);

vshow.bind = function () {
    this.el.originDisplay = this.el.style.display;
    this._bind();
};

vshow.update = function (isShow) {
    var val = isShow ? (this.el.originDisplay || '') : 'none';
    this.el.style.display = val;
};

export default VShow