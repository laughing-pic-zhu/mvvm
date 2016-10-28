var Watch = function (obj, callback) {
    this.callback = callback;
    this.$observe = function (_obj, path) {
        var type = Object.prototype.toString.call(_obj);
        if (type == '[object Object]' || type == '[object Array]') {
            this.$observeObj(_obj, path);
            if (type == '[object Array]') {
                this.$cloneArray(_obj, path);
            }
        }
    };

    this.$observeObj = function (obj, path) {
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
                    var temp = val;
                    val = newVal;
                    t.callback(tpath, newVal, temp);
                }
            });
            t.$observe(val, tpath);
        });
    };

    this.$cloneArray = function (a_array, path) {
        var ORP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        var arrayProto = Array.prototype;
        var newProto = Object.create(arrayProto);
        var t = this;
        ORP.forEach(function (prop) {
            Object.defineProperty(newProto, prop, {
                value: function (newVal) {
                    arrayProto[prop].apply(a_array, arguments);
                    t.callback(a_array);
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

//var _array=[1,2];
//
//function callback(){
//    console.log(1)
//}
//
//Watch(_array,callback);

//_array.push(1);
export default Watch;