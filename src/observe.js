import Dep from './depend'
import { isArray } from './util'

export function Observe(obj) {
    this.$observe = function(_obj) {
        var type = Object.prototype.toString.call(_obj);
        if (type == '[object Object]') {
            this.$observeObj(_obj);
        } else if (type == '[object Array]') {
            this.$cloneArray(_obj);
        }
    };

    this.$observeObj = function(obj) {
        var t = this;
        Object.keys(obj).forEach(function(prop) {
            var val = obj[prop];
            defineProperty(obj, prop, val);
            if (prop != '__observe__') {
                t.$observe(val);
            }

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
                    var dep = a_array.__observe__;
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

var addObserve = function(val) {
    if (!val || typeof val != 'object') {
        return;
    }
    var dep = new Dep();
    if (isArray(val)) {
        val.__observe__ = dep;
        return dep;
    }

}

export function defineProperty(obj, prop, val) {
    if (prop == '__observe__') {
        return;
    }
    val = val || obj[prop];
    var dep = new Dep();

    obj.__observe__ = dep;
    var childDep = addObserve(val);

    Object.defineProperty(obj, prop, {
        get: function() {
            var target = Dep.target
            if (target) {
                dep.addSub(target);
                if (childDep) {
                    childDep.addSub(target);
                }
            }
            return val;
        },
        set: function(newVal) {
            var temp = val;
            val = newVal;
            dep.notify();
        }
    });
}
