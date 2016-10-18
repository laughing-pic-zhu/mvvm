function Directive(descriptor, vm, el) {
    this.descriptor=descriptor;
    this.vm=vm;
    this.el=el;
    el._directive=el._directive||[];
    el._directive.push(this);
}

Directive.prototype.bind=function(){
    console.log('bind');
};

Directive.prototype.unbind=function(){
    console.log('unbind');
};

export default Directive