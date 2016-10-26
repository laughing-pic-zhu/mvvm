import {Parser,extend} from '../parser'
import Directive from '../directive'

var VText = function () {
    Parser.apply(this, arguments);
};

var vt = extend(VText);

vt.parse = function (val) {
    this.bind();
};

vt.update = function (textContent) {
    if (typeof textContent == 'function') {
        var model=this.model;
        textContent = textContent.apply(model);
    }

    this.node.textContent = textContent;
};

export default VText