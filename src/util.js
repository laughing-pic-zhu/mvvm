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

var createFragment = function () {
    return document.createDocumentFragment();
};

var removeAttribute = function (node, attr) {
    if (node.hasAttribute(attr)) {
        node.removeAttribute(attr);
    }
};

export {createAnchor,contrastArray,singleDom,replaceNode,judgeNull,stringParse,createFragment,removeAttribute}