function Depend(){
	this.cache=[];
}

var dp=Depend.prototype;

dp.addSub = function(callback) {
	this.cache.push(callback);
}

dp.notify = function() {
	this.cache.forEach(function(call) {
		call.run();
	})
}

dp.destory = function() {
	this.cache=[];
}

export default Depend