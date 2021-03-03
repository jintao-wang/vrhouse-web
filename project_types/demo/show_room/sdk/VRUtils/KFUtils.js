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

function KFUtils() {
}

KFUtils.checkIsPhone = function () {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
};

KFUtils.isIPhoneX = function () {
    return navigator.userAgent.toLowerCase().match(/iphone/i) == "iphone"
        && screen.width == 375 && screen.height == 812 && window.devicePixelRatio == 3;
};

KFUtils.getUrlParameter = function (name) {
    if (name) {
        let pattern = "(^|&)" + name + "=([^&]*)(&|$)";
        let flags = "i"; // 大小写不记
        let reg = new RegExp(pattern, flags); //构造一个含有目标参数的正则表达式对象
        let result = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (result) return decodeURIComponent(result[2]);
        return null; //返回参数值
    }
};

KFUtils.existUrlParameter = function (param) {
    return this.getUrlParameter(param) !== null;
};

KFUtils.setFullScreen = function (state) {
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

KFUtils.isLandscape = function () {
    return window.matchMedia('(orientation: landscape)').matches;
};

KFUtils.addStats = function (container) {
    let stats = new Stats();
    container.appendChild(stats.dom);

    function update() {
        stats.update();
        requestAnimationFrame(update);
    }

    update();
};

KFUtils.setCursorOnHover = function (domElement, state, url) {
    domElement.style.cursor = state ? "url(" + url + "), pointer" : "default";
};

KFUtils.rgbaColorToString = function (color) {
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
};

KFUtils.rgbColorToString = function (color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

KFUtils.intersection = function (arrayA, arrayB) {
    let r = [], lenA = arrayA.length, lenB = arrayB.length, val;
    if (lenA >= lenB) {
        for (let i = 0; i < lenB; i++) {
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

KFUtils.union = function (arrayA, arrayB) {
    let newArray = arrayA.concat(arrayB);
    return this.unique(newArray);
};

KFUtils.pushUniq = function (array, el) {
    if (array.indexOf(el) == -1) {
        array.push(el);
    }
};

KFUtils.unique = function (array) {
    return array.filter(function (item, index, arr) {
        return arr.indexOf(item, 0) === index;
    });
};

KFUtils.copyArray = function (array) {
    let newArray = [];

    array.forEach(function (item) {
        newArray.push(item);
    });

    return newArray;
};

KFUtils.remove = function (array, val) {
    let index = array.indexOf(val);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(val);
    }
};

KFUtils.average = function (...arr) {
    const nums = [].concat(...arr);
    return nums.reduce((acc, val) => acc + val, 0) / nums.length;
}

KFUtils.saveAndDownload = function (content, filename) {
    let blob = new Blob([content], {type: 'text/plain'});

    window.URL = window.URL || window.webkitURL;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    let link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594

    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
};

KFUtils.getFileName = function (url) {
    if (!url) return;

    if (url.indexOf(".") === -1) {
        return;
    }

    let splits = url.split(".");

    return splits[splits.length - 1];
};

KFUtils.isWebGLSupport = function () {
    try {
        let canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
};

KFUtils.UUID8Bit = function () {
    let chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
        "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
        "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A",
        "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    let uuid = "";
    for (let i = 0; i < 8; ++i) {
        let index = Math.min(Math.floor(Math.random() * 62), 61);
        uuid += chars[index];
    }
    return uuid;
};

// 时间格式化函数:年-月-日 时-分-秒
KFUtils.formatDateYMDHMS = function (date) {
    if (date && typeof date === "object" && typeof date.getFullYear === "function") {
        let s = date.getFullYear() + "-";
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

KFUtils.formatAreaString = function (SQM, imperialUnits, precision) {
    if (imperialUnits) {
        return Math.round(SQM / .3048 / .3048) + "ft²";
    } else {
        return SQM.toFixed(precision) + "㎡";
    }
};

String.prototype.format = function () {
    if (arguments.length === 0) return this;
    let param = arguments[0];
    let s = this;
    if (typeof (param) === 'object') {
        for (let key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (let i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
};

KFUtils.cloneDeep = function (data) {
    let dataCloned;
    if (typeof _ === 'function' && _.cloneDeep) {
        dataCloned = _.cloneDeep(data);
    } else {
        dataCloned = _cloneDeep(data);
    }

    function _cloneDeep(obj) {
        if (typeof obj !== 'object')
            return obj;
        let newObj = obj instanceof Array ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = typeof obj[key] === 'object' ? _cloneDeep(obj[key]) : obj[key];
            }
        }
        return newObj;
    }

    return dataCloned;
};

KFUtils.flatMap = function (ary, iteratee, depth = 1) {
    if (ary.flatMap) {
        return ary.flatMap(iteratee);
    }
    return flatMapDepth(ary, iteratee, depth);
};

KFUtils.flat = function (ary, depth = 1) {
    if (ary.flat) {
        return ary.flat(depth);
    }
    return flattenDepth(ary, depth);
};

KFUtils.throttle = function (method, delay) {
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

KFUtils.debounce = function (method, delay) {
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

KFUtils.detectInfo = window.kfdetect || {};

Date.prototype.pattern = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    let week = {
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
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

KFUtils.isJSON = function (target) {
    return typeof target == "object" && target.constructor == Object;
};

/**
 * xmlhttpRequest封装
 * @type {{}}
 */
KFUtils.Ajax = {
    getJSON(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response, xhr)
                    } else {
                        let resJson = {code: xhr.status, response: xhr.response}
                        reject(resJson, xhr)
                    }
                }
            }

            xhr.send()
        })
    },
    async getJSONAsync(url) {
        return await this.getJSON(url);
    },
    postJSON(url, data) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            xhr.open("POST", url, true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText), xhr)
                    } else {
                        let resJson = {code: xhr.status, response: xhr.response}
                        reject(resJson, xhr)
                    }
                }
            }

            xhr.send(qs.stringify(data))
        })
    },
    async postJSONAsync(url, data) {
        return await this.postJSON(url, data);
    }
};

// 根据高度计算所在楼层
KFUtils.getFloorByHeight = function (height) {
    return Math.floor(Math.abs(height) / 290);
};

export {KFUtils};
