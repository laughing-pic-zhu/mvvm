import {Parser,extend} from '../parser'

var VElse = function () {
    Parser.apply(this,arguments);
};

var velse = extend(VElse);

velse.parse = function () {
    console.log('velse parser parse');
    var node=this.node;
    this.newPosition=storageDom(node);
    this.bind();
};

velse.update = function () {
    var node = this.node;
    var flag = !node.judge;
    var newPosition = this.newPosition;

    if (flag) {
        replaceNode(node,newPosition);
    } else {
        replaceNode(newPosition,node);
    }
};

export default VElse