var compile = function (dom) {
    addQueue(dom);
};

var addQueue = function (nodes) {
    if (nodes.nodeType == 1) {
        this.cache.push(nodes);
        if (nodes.hasChildNodes()) {
            nodes.childNodes.forEach(function (item) {
                addQueue(item);
            })
        }
    }
};

export default compile