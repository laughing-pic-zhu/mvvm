var textReg = '^{{(.+)}}$';

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

var replaceNode = function (node, old) {
    if(old.parentNode){
    old.parentNode.replaceChild(node, old);
    }
};

var judgeNull = function (value) {
    if (value === undefined || value === null || value === '') {
        return false;
    }
    return true;
};

var stringParse = function (str) {
    var array = new RegExp(textReg).exec(str);
    if (array) {
        return array[1];
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

var toArray = function (list) {
    var length = list.length;
    var array = [];
    while (length--) {
        array.push(list[length])
    }
    return array
};

var storageDom = function (node) {
    var newPosition = createAnchor();
    replaceNode(newPosition, node);
    return newPosition;
};
export {
    createAnchor,
    contrastArray,
    replaceNode,
    judgeNull,
    stringParse,
    createFragment,
    removeAttribute,
    textReg,
    toArray,
    storageDom
}