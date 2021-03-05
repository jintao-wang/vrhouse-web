// window.linq = Enumerable.from;
window.EPSILON = 1e-6;

Array.clone = function () {
    return Object.assign({}, this);
};

Array.isNullOrEmpty = function (arr) {
    return !arr || arr.length === 0;
};

Array.remove = function (array, val) {
    let index = array.indexOf(val);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(val);
    }
};

Array.except = function (array, exceptArray) {
    exceptArray.forEach(item => {
        array.splice(array.indexOf(item), 1);
    });
}

Array.get = function (array, index) {
    return array[(index + array.length) % array.length];
}

Array.cartesian = function (array) {
    let result = [];
    for (let item1 of this) {
        for (let item2 of array) {
            result.push([item1, item2].flat())
        }
    }
    return result;
}

String.isNullOrEmpty = function (arr) {
    return !arr || arr === '';
};

Object.bindFunctions = function (obj) {
    let functionNames = Object.getOwnPropertyNames(obj.__proto__)
        .filter(name => name !== "constructor" && name !== 'caller' && name !== 'arguments');

    functionNames.forEach(funcName => {
        if (obj.__proto__[funcName] instanceof Function) {
            obj[funcName] = obj[funcName].bind(obj);
        }
    });
};

