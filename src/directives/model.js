import {Parser,extend} from '../parser'

var VModel = function () {
    Parser.apply(this, arguments);
};

var vmodel = extend(VModel);

vmodel.parse = function () {
    this.node.addEventListener('input', onchange.bind(this), false);
    this.bind();
};

vmodel.update = function (content) {
    this.node.value = content || '';
};

var onchange = function () {
    var raw=this.raw;
    this.model[raw] = event.target.value;
};

export default VModel