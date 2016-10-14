var compile = function (dom) {
    addQueue.call(this,dom);
};

var addQueue = function (nodes) {
    if (nodes.nodeType == 1) {
        this.$cache.push(nodes);
        if (nodes.hasChildNodes()) {
            nodes.childNodes.forEach(function (item) {
                addQueue.call(this,item);
            },this)
        }
    }
};

export default compile