import { Directive, extend } from '../directive'
import { storageDom, replaceNode } from '../util'
var VIf = function() {
    Directive.apply(this, arguments);
};

var vif = extend(VIf);

vif.bind = function() {
    console.log('vif directive bind');
    var el = this.el;
    var nextNode = this.nextNode;
    var parentNode = this.parentNode;
    if (nextNode && nextNode.hasAttribute('v-else')) {
        this.elseNode = nextNode;
        parentNode.removeChild(nextNode);
    }
    this.newPosition = storageDom(el);
    this._first = true;
    this._bind();
};

vif.update = function(judge) {
    var el = this.el;
    var elseNode = this.elseNode;
    var parentNode = this.parentNode;
    var newPosition = this.newPosition;

    if (judge) {
        if (!this._first&&elseNode) {
            parentNode.removeChild(elseNode);
        }

        parentNode.insertBefore(el, newPosition);
    } else {
        if (!this._first) {
            parentNode.removeChild(el);
        }
        if (elseNode) {
            parentNode.insertBefore(elseNode, newPosition);
        }
    }
    this._first = false;
};

export default VIf