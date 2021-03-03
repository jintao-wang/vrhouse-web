export default class kfConsole {
    static log(message, ...params) {
        let formatTime = this.getFormatTime();
        console.log(formatTime + " " + message, ...params);
        // writeLog to native
        try {
            let content = "[WebSDK(v20080701)] " + formatTime + " message:" + JSON.stringify(message) + " params:" + JSON.stringify(params);
            if (window['JavaScriptApi'] && window['JavaScriptApi'].writeLogToFile) {
                window['JavaScriptApi'].writeLogToFile(content);
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.vrviewer) {
                window.webkit.messageHandlers.vrviewer.postMessage({action: 'writeLogToFile', params: content});
            }
        } catch (e) {
            console.log("writeLog to native file failed: ", e.message);
        }

    }

    static info(message, ...params) {
        console.info(this.getFormatTime() + " " + message, ...params);
    }

    static error(message, ...params) {
        console.error(this.getFormatTime() + " " + message, ...params);
    }

    static warn(message, ...params) {
        console.warn(this.getFormatTime() + " " + message, ...params);
    }

    static getFormatTime() {
        return new Date().pattern('yyyy-MM-dd HH:mm:ss');
    }
}