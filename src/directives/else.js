var velse;
velse.bind = function () {
    console.log('velse directive bind');
};

velse.update = function () {
    var node = this.$node;
    var flag = !node.judge;
    var parentNode = this.$parentNode;
    if (flag) {
        parentNode.appendChild(node);
    } else {
        parentNode.removeChild(node);
    }
};

export default velse