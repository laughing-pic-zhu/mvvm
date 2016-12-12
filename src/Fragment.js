function Fragment(frag, value) {
  this.node = frag.childNodes[0]||frag;
  this.raw = value||'';
}

var fp = Fragment.prototype;

fp.remove = function () {
  this.node.parentNode.removeChild(this.node);
};

fp.insert = function (frag) {
  var nextElement = this.node.nextSibling;
  nextElement.parentNode.insertBefore(frag.node, nextElement);
};


export default Fragment