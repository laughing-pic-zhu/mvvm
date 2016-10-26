import Watch from './watch';

var observe = function (model,update) {
    Watch.call(this,model, update);
};

export default observe