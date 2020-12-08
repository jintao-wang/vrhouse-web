import { getUrlParameter } from '../util/common';

const langs = ['zh-CN', 'zh-HK', 'zh-TW', 'ja', 'en-US'];

export default class NameConverter {
  static loadNameDict(nameDict) {
    this.nameDict = nameDict;
  }

  static convertLangByUrl(str, targetLang) {
    if (!str) {
      return;
    }

    if (!targetLang) {
      // eslint-disable-next-line no-param-reassign
      targetLang = getUrlParameter('lang') || getUrlParameter('language');
      if (!targetLang) {
        // eslint-disable-next-line no-param-reassign
        targetLang = (window.appConfig && window.appConfig.lang) ? window.appConfig.lang : 'zh-CN';
      }
    }

    // eslint-disable-next-line no-param-reassign
    targetLang = this.formatLang(targetLang);

    // eslint-disable-next-line consistent-return
    return this.translateByDict(str, targetLang);
  }

  static translateByDict(str, targetLang) {
    if (!this.nameDict) {
      this.nameDict = window.defaultNameDict || {};
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!this.nameDict.hasOwnProperty(targetLang)) return str;
    let index;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < langs.length; i++) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.nameDict.hasOwnProperty(langs[i])) {
        index = this.nameDict[langs[i]].findIndex((ele) => ele === str);
        if (index !== -1) {
          return this.nameDict[targetLang][index];
        }
      }
    }
    return str;
  }

  // eslint-disable-next-line consistent-return
  static formatLang(lang) {
    if (lang === 'CN' || lang === 'cn' || lang === 'zh-CN' || lang === 'zh-cn') {
      return 'zh-CN';
    }
    if (lang === 'hk' || lang === 'HK' || lang === 'zh-HK' || lang === 'zh-hk') {
      return 'zh-HK';
    }
    if (lang === 'tw' || lang === 'TW' || lang === 'zh-TW' || lang === 'zh-tw') {
      return 'zh-TW';
    }
    if (lang === 'en' || lang === 'EN' || lang === 'en-US' || lang === 'en-us') {
      return 'en-US';
    }
    if (lang === 'ja' || lang === 'JA') {
      return 'ja';
    }
  }
}
