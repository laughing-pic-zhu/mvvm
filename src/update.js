var render = function () {
    var cache = this.cache;
    cache.forEach(function (item) {
        if (this.judgeNull(item.text)) {
            item.$textContent = true;
            this.textChange(item, obj[item.text]);
        }

        if (this.judgeNull(item.show)) {
            var value;
            if (obj[item.show]) {
                value = 'block';
            } else {
                value = 'none';
            }
            this.styleChange(item, 'display', value);
        }

        if (this.judgeNull(item.model)) {
            this.valueChange(item, obj[item.model]);
        }

        if (this.judgeNull(item.$list)) {
            this.listChange(item);
        }

        if (this.judgeNull(item.if)) {
            this.ifChange(item, obj[item.if]);
        }

        if (this.judgeNull(item.else)) {
            this.elseChange(item);
        }

    }, this);
};

export default render