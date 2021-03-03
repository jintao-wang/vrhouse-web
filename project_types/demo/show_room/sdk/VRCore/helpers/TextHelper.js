/**
 *Project name: VRHouseWeb
 *File name: TextHelper
 *Created by Shirlman on 2017/8/31
 *Copyright 2016年 - 2018年 上海亦我信息技术有限公司. All rights reserved.
 *注意：本内容仅限于上海亦我信息技术有限公司内部以及相关签约客户研发团队内部传阅，禁止外泄以及用于其他的商业目的
 */

import {KFUtils} from "../../VRUtils/KFUtils";

function TextHelper() {
}

TextHelper.createTextSprite = function (text, parameters) {
    let canvas = document.createElement('canvas');
    parameters = TextHelper.mergeWithDefaultParameters(parameters);
    TextHelper.setCanvas(canvas, text, parameters);
    let texture = new THREE.Texture();
    TextHelper.setTextTexture(texture, canvas, parameters);

    let spriteMaterial = new THREE.SpriteMaterial(
        {map: texture, transparent: true, alphaTest: 0.01, sizeAttenuation: parameters.sizeAttenuation});
    let textSprite = new THREE.Sprite(spriteMaterial);
    textSprite.text = text;
    TextHelper.setTextSpriteScale(textSprite, parameters);

    return textSprite;
};

TextHelper.updateTextSprite = function (textSprite, text, parameters) {
    textSprite.text = text;
    let texture = textSprite.material.map;
    let canvas = texture.image;
    parameters = parameters || texture.parameters;

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    parameters = TextHelper.mergeWithDefaultParameters(parameters);
    TextHelper.setCanvas(canvas, text, parameters);
    TextHelper.setTextTexture(texture, canvas, parameters);
    TextHelper.setTextSpriteScale(textSprite, parameters);
};

TextHelper.setTextSpriteScale = function (textSprite, parameters) {
    let texture = textSprite.material.map;
    let spriteScale = parameters.spriteScale ? parameters.spriteScale : 1;
    textSprite.scale.set(texture.scaleX * spriteScale, texture.scaleY * spriteScale, 1);
    textSprite.defaultScale = textSprite.scale.clone();
};

TextHelper.setTextTexture = function (texture, canvas, parameters) {
    texture.image = canvas;
    texture.anisotropy = parameters.anisotropy ? parameters.anisotropy : 1;
    texture.minFilter = parameters.anisotropy ? parameters.minFilter : THREE.LinearFilter;
    texture.needsUpdate = true;

    texture.parameters = parameters;

    texture.scaleX = canvas.width;
    texture.scaleY = canvas.height;

    return texture;
};

TextHelper.mergeWithDefaultParameters = function (parameters) {
    parameters = parameters ? parameters : {};

    let defaultParams = {
        fontFace: "sans-serif",
        fontSize: 18,
        fontWeight: "normal",
        textMargin: 34,
        borderThickness: 0,
        borderColor: {r: 0, g: 0, b: 0, a: 0},
        backgroundColor: {r: 0, g: 0, b: 0, a: 0},
        textColor: {r: 255, g: 255, b: 255, a: 1.0},
        cornerWidth: 0,
        textAlign: "center",
        enableShadow: false,
        shadowColor: {r: 0, g: 0, b: 0, a: 0},
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,
        sizeAttenuation: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        ...parameters,
    };

    // parameters = Object.assign(defaultParams, parameters);

    parameters = TextHelper.changeFontFaceForMacOrWin(defaultParams);

    return parameters;
};

TextHelper.setCanvas = function (canvas, text, parameters) {
    // 检测到 text 为 undefined 提前结束函数
    if (text === undefined) return 0
    let context = canvas.getContext('2d');
    context.font = "normal " + parameters.fontSize + "px " + parameters.fontFace;

    let lineGap = parameters.textMargin / 3;
    let lines = text.split("\n");
    let lineCount = lines.length;
    let maxWidth = 0;
    let textWidth;

    lines.forEach(line => {
        textWidth = context.measureText(line).width;

        if (textWidth > maxWidth) {
            maxWidth = textWidth;
        }
    });

    let canvasWidth = maxWidth + parameters.textMargin * 2 + parameters.borderThickness * 2;
    let canvasHeight = lineCount * parameters.fontSize + (lineCount - 1) * lineGap + parameters.textMargin + parameters.borderThickness * 2;

    if (parameters.leftIco) {
        canvasWidth += parameters.fontSize;
    }

    if (parameters.rightIco) {
        canvasWidth += parameters.fontSize;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.fillStyle = KFUtils.rgbaColorToString(parameters.backgroundColor);
    context.strokeStyle = KFUtils.rgbaColorToString(parameters.borderColor);

    context.font = parameters.fontWeight + " " + parameters.fontSize + "px " + parameters.fontFace;
    context.textBaseline = 'middle';
    context.textAlign = parameters.textAlign;
    context.lineWidth = parameters.borderThickness;

    if (parameters.enableShadow) {
        context.shadowColor = KFUtils.rgbaColorToString(parameters.shadowColor);
        context.shadowOffsetX = parameters.shadowOffsetX;
        context.shadowOffsetY = parameters.shadowOffsetY;
        context.shadowBlur = parameters.shadowBlur;
    }

    // background
    let cornerWidth = parameters.cornerWidth / parameters.fontSize * canvasHeight;
    if(parameters.tShape){
        roundTShape(context, parameters.borderThickness, parameters.borderThickness, canvasWidth - 2 * parameters.borderThickness, canvasHeight - 2 * parameters.borderThickness, cornerWidth);
    }else {
        roundRect(context, parameters.borderThickness, parameters.borderThickness, canvasWidth - 2 * parameters.borderThickness, canvasHeight - 2 * parameters.borderThickness, cornerWidth);
    }
    if (parameters.rightIco && parameters.rightIcoBackground) {
        context.fillStyle = KFUtils.rgbaColorToString(parameters.rightIcoBackground);
        rightIcoRect(context, canvasWidth * 0.7, parameters.borderThickness, canvasWidth * 0.3 - parameters.borderThickness, canvasHeight - 2 * parameters.borderThickness, cornerWidth);
    }

    // text color
    context.fillStyle = KFUtils.rgbaColorToString(parameters.textColor);

    lines.forEach((line, i) => {
        let y = parameters.fontFace.indexOf('Yahei') ? 
            canvasHeight / 2 + (lineGap + parameters.fontSize) * (i - (lines.length - 1) / 2) + 1.5 :
            canvasHeight / 2 + (lineGap + parameters.fontSize) * (i - (lines.length - 1) / 2); // 雅黑似乎居中会偏移
        let x = canvasWidth / 2;

        if (parameters.leftIco) {
            x += (parameters.fontSize);
        }
        if (parameters.rightIco) {
            x -= (parameters.fontSize);
        }
        context.fillText(line, x, y);
        // context.strokeText(line, x, y);
    });

};

function roundRect(ctx, x, y, w, h, r) {
    // 左上角原点
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function roundTShape(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r + 12, y);
    ctx.lineTo(x + w - r - 12, y);
    ctx.quadraticCurveTo(x + w - 12, y, x + w - 10, y + r - 1);
    ctx.lineTo(x + w - 1, y + h - r / 1.5 + 1);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r / 1.5, y + h);
    ctx.lineTo(x + r / 1.5, y + h);
    ctx.quadraticCurveTo(x, y + h, x + 1, y + h - r / 1.5 + 1);
    ctx.lineTo(x + 10, y + r - 1);
    ctx.quadraticCurveTo(x + 12, y, x + r + 12, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function rightIcoRect(ctx, x, y, w, h, r) { // 外景切换户型锚点的右侧转向icon背景
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

TextHelper.changeFontFaceForMacOrWin = function (parameters) {
    if (parameters.fontFace.indexOf("PingFang") !== 1 && navigator.userAgent.indexOf("Win") !== -1) {
        parameters.fontFace = "Microsoft Yahei";
    }

    if (parameters.fontFace.indexOf("Yahei") !== 1 && navigator.userAgent.indexOf("Mac") !== -1) {
        parameters.fontFace = "PingFangSC-Regular";
    }

    return parameters;
}

TextHelper.cropString = function (str, index) {
    if (str.length <= index) return str;
    else return str.substring(0, index - 1) + '...';
}

export {TextHelper}
