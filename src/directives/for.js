var vfor;
vfor.bind = function () {
    console.log('vfor directive bind');
};

vfor.update = function (items,item) {

    var parentNode = this.$parentNode;
    var node = this.$node;
    var end = this.$end;
    var arrayCache = this.$arrayCache;
    var domCache = this.$domCache;

    if (arrayCache.length == 0) {
        items.forEach(function (_item) {
            var fragment = createFragment();
            var newNode = node.cloneNode(true);
            singleDom(node, newNode, item, _item);
            fragment.appendChild(newNode);
            parentNode.insertBefore(fragment, end);
            arrayCache.push(_item);
            domCache.push(newNode);
        });
    } else {
        var diff = contrastArray(arrayCache, items);
        correctDom.call(this,items,item,diff);
    }
};

var correctDom = function (items,item,diff) {
    var diffArray = diff.slice();
    var domCache = this.$domCache;
    var arrayCache = this.$arrayCache;
    var node = this.$node;
    var end = this.$end;
    var parentNode = this.$parentNode;

    diffArray.forEach(function (_item) {
        var fragment = createFragment();
        var newNode = node.cloneNode(true);
        var val=items[item];
        if (val) {
            singleDom(node, newNode, obj, val);
        } else {
            parentNode.removeChild(domCache[_item]);
            delete domCache[_item];
            delete arrayCache[_item];
            return;
        }
        fragment.appendChild(newNode);
        if (domCache[_item]) {
            replaceNode(fragment, domCache[_item]);
        } else {
            parentNode.insertBefore(fragment, end);
        }
        domCache[_item] = newNode;
        arrayCache[_item]=items[_item];
    });
};

export default vfor