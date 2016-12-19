import {Directive,extend} from '../directive'

var VText = function () {
    Directive.apply(this, arguments);
};

var vt = extend(VText);

vt.bind = function (val) {
    this._bind();
};

vt.update = function (textContent) {
    this.el.textContent = textContent;
};

export default VText