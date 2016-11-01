import Dep from './depend'

var Observe = function(obj) {
    this.$observe = function(_obj) {
        var type = Object.prototype.toString.call(_obj);
        if (type == '[object Object]' || type == '[object Array]') {
            this.$observeObj(_obj);
            if (type == '[object Array]') {
                this.$cloneArray(_obj);
            }
        }
    };

    this.$observeObj = function(obj) {
        var t = this;
        Object.keys(obj).forEach(function(prop) {
            var val = obj[prop];
            var dep = new Dep();

            Object.defineProperty(obj, prop, {
                get: function() {
                    if (Dep.target) {
                        dep.addSub(Dep.target);
                    }
                    return val;
                },
                set: function(newVal) {
                    var temp = val;
                    val = newVal;
                    dep.notify();
                }
            });
            t.$observe(val);
        });
    };

    this.$cloneArray = function(a_array) {
        var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        var arrayProto = Array.prototype;
        var newProto = Object.create(arrayProto);
        var t = this;
        ORP.forEach(function(prop) {
            Object.defineProperty(newProto, prop, {
                value: function(newVal) {
                    arrayProto[prop].apply(a_array, arguments);
                    dep.notify();
                },
                enumerable: false,
                configurable: true,
                writable: true
            });
        });
        a_array.__proto__ = newProto;
    };

    this.$observe(obj, []);
}


export default Observe;