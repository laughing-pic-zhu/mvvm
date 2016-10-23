var vif;
vif.bind = function () {
    console.log('vif directive bind');
};

vif.update = function (judge) {
    var node = this.$node;
    var nextNode = this.$nextNode;
    var parentNode = this.$parentNode;
    var flag;
    if (judge) {
        parentNode.appendChild(node);
        flag = true;
    } else {
        parentNode.removeChild(node);
        flag = false;
    }
    nextNode.judge = flag;
};

export default vif