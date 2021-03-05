import CryptoJS from 'crypto-js'
import pako from 'pako'
import JSZip from "jszip/dist/jszip";
import saveAs from "jszip/vendor/FileSaver";

export class ZipUtils {
    static isInitialized = false;

    static initCryptoJS() {
        if (this.isInitialized) {
            return;
        }

        CryptoJS.pad.ZeroPadding = {
            pad: function (data, blockSize) {
                // Shortcut
                let blockSizeBytes = blockSize * 4;

                // Pad
                data.clamp();
                data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
            },

            unpad: function (data) {
                // Shortcut
                let dataWords = data.words;

                // Unpad
                let i = data.sigBytes - 1;
                while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
                    i--;
                }
                data.sigBytes = i + 1;
            }
        };

        CryptoJS.mode.ECB = (function () {
            let ECB = CryptoJS.lib.BlockCipherMode.extend();

            ECB.Encryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.encryptBlock(words, offset);
                }
            });

            ECB.Decryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.decryptBlock(words, offset);
                }
            });

            return ECB;
        }());

        this.isInitialized = true;
    }

    static decompressToString(text, key) {
        try {
            ZipUtils.initCryptoJS();

            //解密
            key = CryptoJS.enc.Utf8.parse(key);
            let decrypt = CryptoJS.AES.decrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            let decryptStr = CryptoJS.enc.Base64.stringify(decrypt);

            //解压
            let strData = atob(decryptStr);
            let charData = strData.split('').map(function (x) {
                return x.charCodeAt(0);
            });
            let binData = new Uint8Array(charData);
            let data = pako.inflate(binData);
            strData = ZipUtils.decodeUtf8(data);
            return strData;
        } catch (e) {
            console.log("decompressToString: " + e);
        }
    };

    static decodeUtf8(bytes) {
        let encoded = "";
        for (let i = 0; i < bytes.length; i++) {
            encoded += '%' + bytes[i].toString(16);
        }
        return decodeURIComponent(encoded);
    }

    //解密=>配合张坤的后台加密
    static decodeToUTF8(text, key) {
        ZipUtils.initCryptoJS();
        let d = CryptoJS
        //解密
        key = CryptoJS.enc.Utf8.parse(key);
        let decrypt = CryptoJS.AES.decrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt)
    }

    //压缩加密
    static zipAndEncrypt(text, key) {
        try {
            ZipUtils.initCryptoJS();

            // 压缩
            let binaryString = pako.gzip(text, {to: 'string'});
            // 加密
            key = CryptoJS.enc.Utf8.parse(key);
            let srcs = CryptoJS.enc.Base64.parse(btoa(binaryString));
            let encrypted = CryptoJS.AES.encrypt(srcs, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.ZeroPadding
            });

            return encrypted.toString();
        } catch (e) {
            console.error("zipAndEncrypt: " + e);
        }

    }

    // 压缩下载文件
    // TODO: Shirlman, 业务逻辑强相关的不要放到Util里，放到自己对应的模块中
    static zip(viewData, style, housePathPrefix) {
        const prefix = housePathPrefix
        let zip = new JSZip();
        // 创建images文件夹
        let imgFolder = zip.folder(viewData.Name + "_FloorPlans");
        let arr = [];
        for (let i = 0; i < viewData.Floors.length; i++) {
            const id = viewData.Floors[i].ID
            let imgSrc = prefix + 'FloorPlans/' + id + '_export.jpg';
            if (style) {
                imgSrc = prefix + 'FloorPlans/' + id + '_' + style + '_export.jpg';
            }
            arr.push(imgSrc);
        }
        let flag = 0 //  判断加载了几张图片的标识
        arr.forEach(function (planePath, i) {
            HouseEditor.BaseAPI.getBase64(planePath, 'jpeg').then(function (base64) {
                base64 = base64.split('base64,')[1]
                imgFolder.file(viewData.Floors[i].Name + '.jpg', base64, {base64: true})
                if (flag === arr.length - 1) {
                    zip.generateAsync({type: "blob"}).then(function (blob) {
                        // $('body').loading('stop')
                        saveAs(blob, viewData.Name + "_FloorPlans.zip");
                    });
                }
                flag++
            }, function (err) {
                console.log(err);//打印异常信息
            });
        });
    }

    // 保存
    static saveAs = function (blob, name, opts) {
        saveAs(blob, name, opts)
    }
}

