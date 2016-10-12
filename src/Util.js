var createAnchor = function () {
    return document.createTextNode(' ');
};

var contrastArray = function (_old, _new) {
    var a = [];
    if (_old.length > _new.length) {
        for (var i = 0; i < _old.length; i++) {
            if (_new[i] !== _old[i]) {
                a.push(i);
            }
        }
    } else {
        for (var i = 0; i < _new.length; i++) {
            if (_new[i] !== _old[i]) {
                a.push(i);
            }
        }
    }
    return a;
};

var correctDom = function (item, diff) {
    var diffArray = diff.slice();
    var domCache = item.$domCache;
    var arrayCache = item.$arrayCache;
    var node = item.$node;
    var end = item.$end;
    var parentNode = item.$parentNode;
    var value = item.$key;
    var list = item.$list;
    diffArray.forEach(function (_item) {
        var fragment = createFragment();
        var newNode = node.cloneNode(true);
        newNode.removeAttribute('v-for');
        if (list[_item]) {
            singleDom(node, newNode, value, list[_item]);
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
        arrayCache[_item]=list[_item];
    });
};

var singleDom = function (node, newNode, value, _item) {
    var textContent = node.getAttribute('v-text');
    if (textContent == value) {
        newNode.textContent = _item;
    } else {
        newNode.textContent = '';
    }
};

var replaceNode = function (node, old) {
    old.parentNode.replaceChild(node, old);
};

var judgeNull = function (value) {
    if (value === undefined || value === null || value === '') {
        return false;
    }
    return true;
};

var stringParse = function (str) {
    var reg = /^{{(.+)}}$/;
    var array = reg.exec(str);
    if (array) {
        return array.slice(1);
    }
    return '';
};
export {createAnchor,contrastArray,correctDom,singleDom,replaceNode,judgeNull,stringParse}