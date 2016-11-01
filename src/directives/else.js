import {Directive,extend} from '../directive'
import {storageDom,replaceNode} from '../util'

var VElse = function () {
    Directive.apply(this,arguments);
};

var velse = extend(VElse);

velse.bind = function () {
    console.log('velse directive bind');
    var el=this.el;
    this.newPosition=storageDom(el);
    this._bind();
};

velse.update = function () {
    var el = this.el;
    var flag = !el.judge;
    var newPosition = this.newPosition;

    if (flag) {
        replaceNode(el,newPosition);
    } else {
        replaceNode(newPosition,el);
    }
};

export default VElse