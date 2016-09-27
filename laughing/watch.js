/**
 *
 * @param obj 需要监听的对象或数组
 * @param callback 当对应属性变化的时候触发的回调函数
 * @constructor
 */
function Watch(obj, callback) {
    this.callback = callback;
    //监听_obj对象 判断是否为对象,如果是数组,则对数组对应的原型进行封装
    //path代表相应属性在原始对象的位置,以数组表示. 如[ 'a', 'dd', 'ddd' ] 表示对象obj.a.dd.ddd的属性改变
    this.observe = function (_obj, path) {
        var type=Object.prototype.toString.call(_obj);
        if (type== '[object Object]'||type== '[object Array]') {
            this.observeObj(_obj, path);
            if (type == '[object Array]') {
                this.cloneArray(_obj, path);
            }
        }
    };

    //遍历对象obj,设置set,get属性,set属性能触发callback函数,并将val的值改为newVal
    //遍历结束后再次调用observe函数 判断val是否为对象,如果是则在对val进行遍历设置set,get
    this.observeObj = function (obj, path) {
        var t = this;
        Object.keys(obj).forEach(function (prop) {
            var val = obj[prop];
            var tpath = path.slice(0);
            tpath.push(prop);
            Object.defineProperty(obj, prop, {
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    val = newVal;
                    t.callback(tpath, newVal, val);
                }
            });
            t.observe(val, tpath);
        });
    };

    //通过对特定数组的原型中间放一个newProto原型,该原型继承于Array的原型,但是对push,pop等数组操作属性进行封装
    this.cloneArray = function (a_array,path) {
        var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        var arrayProto = Array.prototype;
        var newProto = Object.create(arrayProto);
        var t = this;
        ORP.forEach(function (prop) {
            Object.defineProperty(newProto, prop, {
                value: function (newVal) {
                    arrayProto[prop].apply(a_array, arguments);
                    t.callback(path, newVal);
                },
                enumerable: false,
                configurable: true,
                writable: true
            });
        });
        a_array.__proto__ = newProto;
    };

    //开始监听obj对象,初始path为[]
    this.observe(obj, []);
}

