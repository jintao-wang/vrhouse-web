import wx from 'weixin-js-sdk';

export default ({
  title,
  desc,
  imgUrl,
}) => {
  // eslint-disable-next-line no-restricted-globals
  const link = location.href.split('#')[0];
  fetch(`//139.196.157.196/v2/WeChat/GetJSPageSign?url=${encodeURIComponent(link)}`)
    .then((res) => res.json())
    .then((json) => {
      const getMsg = json.payload;
      wx.config({
        debug: false, // 生产环境需要关闭debug模式
        appId: getMsg.appId,
        timestamp: getMsg.timeStamp,
        nonceStr: getMsg.nonceStr,
        signature: getMsg.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
        ],
      });

      wx.ready(() => {
        const share = {
          title,
          desc,
          link,
          imgUrl,
          success() {
          },
          cancel() {
          },
        };
        wx.onMenuShareTimeline(share);
        wx.onMenuShareAppMessage(share);
      });
    });
};
