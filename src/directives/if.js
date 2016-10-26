import {Parser,extend} from '../parser'
import {storageDom,replaceNode} from '../util'
var VIf = function () {
    Parser.apply(this,arguments);
};

var vif = extend(VIf);


vif.parse = function () {
    console.log('vif directive bind');
    var node=this.node;
    this.newPosition=storageDom(node);
    this.bind();
};

vif.update = function (judge) {
    var node = this.node;
    var nextNode = this.nextNode;
    var newPosition=this.newPosition;
    var flag;
    if (judge) {
        replaceNode(node,newPosition);
        flag = true;
    } else {
        replaceNode(newPosition,node);
        flag = false;
    }
    nextNode.judge = flag;
};

export default VIf