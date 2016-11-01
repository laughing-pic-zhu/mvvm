import Directive from './directive';

var Parser = function (raw,scope) {
    Object.assign(this, scope);
    this.raw=raw;
    this.parse();
};

Parser.prototype.bind=function(){
    this.directive=new Directive(this);
    this.directive.bind();
};

var extend=function(typeParser){
    return typeParser.prototype=Object.create(Parser.prototype);
};

export  {Parser,extend}