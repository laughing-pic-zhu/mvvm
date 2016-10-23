var vshow;
vshow.bind = function () {
    console.log('vshow directive bind');
};
vshow.update = function (isShow) {
    var status = isShow ? 'block' : 'none';
    this.node.style.display = status;
};

export default vshow