var vtext;
vtext.bind = function () {
    console.log('text directive bind');
};
vtext.update = function (textContent) {
    this.node.textContent = textContent;
};
export default vtext