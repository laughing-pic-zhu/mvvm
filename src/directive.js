function Directive(descriptor, vm, el,def) {
    this.descriptor=descriptor;
    this.vm=vm;
    this.el=el;
    this.bind(def);
    el._directive=el._directive||[];
    el._directive.push(this);
}

Directive.prototype.bind=function(def){
    //Object.assign(this,def);
    //if(this.bind){
    //    this.bind();
    //}
    console.log('bind');
};

Directive.prototype.mount=function(){
    console.log('mount');
};

Directive.prototype.unbind=function(){
    console.log('unbind');
};

export default Directive