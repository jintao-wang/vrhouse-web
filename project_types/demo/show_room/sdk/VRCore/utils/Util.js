/**
 *Project name: VRHouseWeb
 *File name: Util
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */
import qs from 'qs';
import flatMapDepth from 'lodash/flatMapDepth'
import flattenDepth from 'lodash/flattenDepth'
import {VRCore} from "../../VRFloorPlanEditor/app/VRCore";

function Util() {
}

Util.checkIsPhone = function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
};

Util.isIPhoneX = function () {
    return navigator.userAgent.toLowerCase().match(/iphone/i) == "iphone"
        && screen.width == 375 && screen.height == 812 && window.devicePixelRatio == 3;
};

Util.getUrlParameter = function (name) {
    if (name) {
        var pattern = "(^|&)" + name + "=([^&]*)(&|$)";
        var flags = "i"; // 大小写不记
        var reg = new RegExp(pattern, flags); //构造一个含有目标参数的正则表达式对象
        var result = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (result) return decodeURIComponent(result[2]);
        return null; //返回参数值
    }
};
Util.existUrlParameter = function (param) {
    return this.getUrlParameter(param) !== null;
};
Util.deleteUrlParameter = function (param) {
    var local = window.location;
    var domain = this.getUrlParameter('domain');
    var baseUrl = local.origin + local.pathname + "?";
    var query = local.search.substr(1);
    if (query.indexOf(param) > -1) {
        var obj = {};
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        }
        delete obj[param];
        delete obj['domain'];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        if (domain)
            url += '&domain=' + domain;
        return url;
    }
};
Util.setFullScreen = function (state) {
    if (state) {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        document.documentElement.msRequestFullscreen && document.documentElement.msRequestFullscreen();
        document.documentElement.mozRequestFullScreen && document.documentElement.mozRequestFullScreen();
        document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else {
        document.exitFullscreen && document.exitFullscreen();
        document.msExitFullscreen && document.msExitFullscreen();
        document.mozCancelFullScreen && document.mozCancelFullScreen();
        document.webkitExitFullscreen && document.webkitExitFullscreen();
    }
};

Util.syncArrayMap = function (defaultArrayMap, arrayMap, key) {
    var tempArray = [];
    defaultArrayMap.map((defaultArray) => {
        arrayMap.map((array) => {
            if (defaultArray[key] === array[key]) {
                tempArray.push(array);
            }
        });
    });
    return tempArray;
}

// 兼容ipad横屏竖屏
Util.isDeviceNarrow = function () {
    return window.matchMedia('(max-device-width:768px)').matches && window.matchMedia('(min-device-width:320px)').matches;

};

Util.isLandscape = function () {
    return window.matchMedia('(orientation: landscape)').matches;
};

Util.isIPhoneXSMax = function () {
    return navigator.userAgent.toLowerCase().match(/iphone/i) == "iphone"
        && screen.width == 414 && screen.height == 896 && window.devicePixelRatio == 3;
};
Util.isIPhoneXR = function () {
    return navigator.userAgent.toLowerCase().match(/iphone/i) == "iphone"
        && screen.width == 414 && screen.height == 896 && window.devicePixelRatio == 2;
};

Util.addStats = function (container) {
    var stats = new Stats();
    container.appendChild(stats.dom);

    function update() {
        stats.update();
        requestAnimationFrame(update);
    }

    update();
};

Util.setCursorOnHover = function (domElement, state, url) {
    domElement.style.cursor = state ? "url(" + url + "), pointer" : "default";
};

Util.rgbaColorToString = function (color) {
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
};

Util.rgbColorToString = function (color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

Util.contains = function (array, item) {
    var contain = false;

    for (var i of array) {
        if (array[i] === item) {
            contain = true;
        }
    }

    return contain;
};

Util.residual = function (arrayA, arrayB) {
    var r = [], lenA = arrayA.length, lenB = arrayB.length, val;
    if (lenA < lenB) {
        for (var i = 0; i < lenA; i++) {
            val = arrayA[i];
            if (arrayB.indexOf(val) < 0) {
                r.push(val);
            }
        }
    } else {
        for (var i = 0; i < lenB; i++) {
            val = arrayB[i];
            if (arrayA.indexOf(val) >= 0) {
                arrayA = this.remove(arrayA, val);
            }
        }
        r = arrayA;
    }
    return r;
};

Util.intersection = function (arrayA, arrayB) {
    var r = [], lenA = arrayA.length, lenB = arrayB.length, val;
    if (lenA >= lenB) {
        for (var i = 0; i < lenB; i++) {
            val = arrayB[i];
            if (arrayA.indexOf(val) >= 0) {
                r.push(val);
            }
        }
    } else {
        r = this.intersection(arrayB, arrayA);
    }
    return r;
};

Util.union = function (arrayA, arrayB) {
    var newArray = arrayA.concat(arrayB);
    return this.unique(newArray);
};

Util.pushUniq = function (array, el) {
    if (array.indexOf(el) == -1) {
        array.push(el);
    }
};

Util.unique = function (array) {
    return array.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
    });
};

Util.copyArray = function (array) {
    var newArray = [];

    array.forEach(function (item) {
        newArray.push(item);
    });

    return newArray;
};

Util.remove = function (array, val) {
    var index = array.indexOf(val);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(val);
    }
};

Util.average = function (...arr) {
    const nums = [].concat(...arr);
    return nums.reduce((acc, val) => acc + val, 0) / nums.length;
}

Util.saveAndDownload = function (content, filename) {
    var blob = new Blob([content], {type: 'text/plain'});

    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
};

Util.getFileName = function (url) {
    if (!url) return;

    if (url.indexOf(".") === -1) {
        return;
    }

    var splits = url.split(".");

    return splits[splits.length - 1];
};

Util.isWebGLSupport = function () {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

Util.UUID8Bit = function () {
    var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
        "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A",
        "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var uuid = "";
    for (var i = 0; i < 8; ++i) {
        var index = Math.min(Math.floor(Math.random() * 62), 61);
        uuid += chars[index];
    }
    return uuid;
};

// 时间格式化函数:年-月-日 时-分-秒
Util.formatDateYMDHMS = function (date) {
    if (date && typeof date === "object" && typeof date.getFullYear === "function") {
        var s = date.getFullYear() + "-";
        s += ("0" + (date.getMonth() + 1)).slice(-2) + "-";
        s += ("0" + date.getDate()).slice(-2);
        s += " " + ("0" + date.getHours()).slice(-2) + ":";
        s += ("0" + date.getMinutes()).slice(-2) + ":";
        s += ("0" + date.getSeconds()).slice(-2);
        return s;
    } else {
        return "";
    }
};

Util.formatUnitString = function (lenInMetre, imperialUnits) {
    if (imperialUnits) {
        var inch = Math.round(12 * lenInMetre / .3048);
        var feet = Math.floor(inch / 12);
        inch -= 12 * feet;
        return feet + "′" + (inch > 0 ? inch + "˝" : "");
    } else {
        return lenInMetre.toFixed(1) + "m";
    }
};

Util.formatAreaString = function (SQM, imperialUnits, precision) {
    if (imperialUnits) {
        return Math.round(SQM / .3048 / .3048) + "sf";
    } else {
        return SQM.toFixed(precision) + "㎡";
    }
};

String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) === d)
};

String.prototype.format = function () {
    if (arguments.length === 0) return this;
    var param = arguments[0];
    var s = this;
    if (typeof (param) === 'object') {
        for (var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
};
Util.cloneDeep = function (data) {
    var dataCloned;
    if (typeof _ === 'function' && _.cloneDeep) {
        dataCloned = _.cloneDeep(data);
    } else {
        dataCloned = _cloneDeep(data);
    }

    function _cloneDeep(obj) {
        if (typeof obj !== 'object')
            return obj;
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = typeof obj[key] === 'object' ? _cloneDeep(obj[key]) : obj[key];
            }
        }
        return newObj;
    }

    return dataCloned;
};
Util.flatMap = function (ary, iteratee, depth = 1) {
    if (ary.flatMap) {
        return ary.flatMap(iteratee);
    }
    return flatMapDepth(ary, iteratee, depth);
};

Util.flat = function (ary, depth = 1) {
    if (ary.flat) {
        return ary.flat(depth);
    }
    return flattenDepth(ary, depth);
};

Util.throttle = function (method, delay) {
    let timer = null;
    return function () {
        let context = this, args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                method.apply(context, args);
                timer = null;
            }, delay);
        }
    }
};

Util.debounce = function (method, delay) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            method.apply(context, args)
        }, delay);
    }
};

// Deprecated! use detectInfo
Util.getBrowser = function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1] || '')};
    }

    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);
        if (tem !== null) {
            return {name: 'Opera', version: tem[1]};
        }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }

    return {
        name: M[0],
        version: M[1]
    };
};

Util.detectInfo = window.kfdetect||{};

/**
 * {
 *     details: {
 *         '0': "1. xxx",
 *         '1': "2. xxx",
 *         ...
 *     }
 *     =>
 *     details: {
 *         "1. xxx \n2. xxx"
 *     }
 * }
 * @param json
 * @returns {*}
 */
Util.joinNumberKeyItem = function (json) {
    let _this = this;
    if (this.isJSON(json)) {
        let tempAry = [];
        let keys = Object.keys(json);
        keys.forEach(key => {
            if (isNaN(key)) {
                json[key] = _this.joinNumberKeyItem(json[key]);
            } else {
                tempAry.push(json[key]);
            }
        });
        if (tempAry.length === keys.length) {
            return tempAry.join('\n');
        } else {
            return json;
        }
    } else {
        return json;
    }
};

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

Util.isJSON = function (target) {
    return typeof target == "object" && target.constructor == Object;
};
/**
 * 深度合并两个对象，把obj2合并到obj1
 * obj1 {
 *     a: 1,
 *     b: {
 *         i: '2',
 *         j: '3'
 *     }
 * }
 * obj2 {
 *     c: 4,
 *     b: {
 *         j: '5',
 *         k: '6'
 *     }
 * }
 * => obj1 {
 *     a: 1,
 *     b: {
 *         i: '2',
 *         j: '5',
 *         k: '6'
 *     },
 *     c: 4
 * }
 * @param obj1
 * @param obj2
 */
Util.mergeObjects = function (obj1, obj2) {
    for (let key in obj2) {
        // obj1没有的或不是object的直接赋值
        if (typeof obj1[key] === 'undefined' || !this.isJSON(obj1[key]) || !this.isJSON(obj2[key])) {
            obj1[key] = this.cloneDeep(obj2[key]);
        } else {
            obj1[key] = this.mergeObjects(obj1[key], obj2[key]);
        }
    }
    return obj1;
};
/**
 * 等待notifier成功返回才执行executor
 * @param notifier
 * @param executor
 * @returns {{stop, start}}
 */
Util.getWaiter = function (notifier, executor) {
    return (function (n, e) {
        return {
            start: function (timeout) {
                let time = 0;
                let that = this;
                this.stop();
                this.waiterId = setInterval(function () {
                    if (typeof n === 'function' && n()) {
                        console.log('waiterId: ', that.waiterId)
                        that.stop();
                        e && e();
                    }
                    if (time++ > timeout) {
                        that.stop();
                    }
                }, 1000);
            },
            stop: function () {
                if (this.waiterId) {
                    clearInterval(this.waiterId);
                    this.waiterId = null;
                }
            }
        };
    })(notifier, executor);
};
/**
 * 如果没有被中断，一直执行executor
 * @param interrupter
 * @param executor
 * @returns {{stop, start, time}}
 */
Util.getRepeater = function (interrupter, executor) {
    return (function (i, e) {
        return {
            time: 1,
            start: function (startTimeout, weaken) {
                let that = this;
                this.stop();
                let timeout = startTimeout;
                if (weaken) {
                    timeout = startTimeout * that.time;
                }
                this.repeaterId = setTimeout(function () {
                    if (typeof i === 'function' && i()) {
                        that.stop();
                    } else {
                        try {
                            e && e(that.time);
                        } catch (e) {
                            console.log("error in execute function " + e.message);
                        }
                        that.time++;
                        that.start(timeout, weaken);
                    }
                }, timeout);
            },
            stop: function () {
                if (this.repeaterId) {
                    clearInterval(this.repeaterId);
                    this.repeaterId = null;
                }
            }
        };
    })(interrupter, executor);
};
/**
 * xmlhttpRequest封装
 * @type {{}}
 */
Util.Ajax = {
    getJSON(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response, xhr)
                    } else {
                        var resJson = {code: xhr.status, response: xhr.response}
                        reject(resJson, xhr)
                    }
                }
            }

            xhr.send()
        })
    },
    postJSON(url, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest()
            xhr.open("POST", url, true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText), xhr)
                    } else {
                        var resJson = {code: xhr.status, response: xhr.response}
                        reject(resJson, xhr)
                    }
                }
            }

            xhr.send(qs.stringify(data))
        })
    }
};

Util.generateGUID = function () {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
};

// 根据高度计算所在楼层
Util.getFloorByHeight = function (height) {
    return Math.floor(Math.abs(height) / 290);
};

// 数组拆分
Util.groupArray = function (arr, num) {
    let index = 0;
    let newArr = [];

    while (index < arr.length) {
        newArr.push(arr.slice(index, index += num));
    }

    return newArr;
}

Util.getRandomColor = function(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

Util.getMouseOnObject = function (object, camera, domElement) {
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(VRCore.EventListener.getMousePosition(camera, event, domElement), camera);

    let intersects = raycaster.intersectObjects(object, true);
    if (intersects.length > 0) { // 若与movePlane有交点
        return intersects[0].point;
    } else {
        return null;
    }
}

export {Util};
