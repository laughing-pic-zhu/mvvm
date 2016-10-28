var render = function () {
    var cache = this.$cache;
    cache.forEach(function (item) {
        var direct_array = item.direct_array;
        direct_array.forEach(directive=> {
            directive.directive.update.apply(directive.directive, arguments);
        });
    });
};

export default render