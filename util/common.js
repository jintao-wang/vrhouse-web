export const getUrlParameter = (parameter, url = window.location.href) => {
  const splitIndex = url.indexOf('?');
  const str = url.substring(splitIndex + 1);
  const reg = new RegExp(`(^|&)${parameter}=([^&]*)(&|$)`, 'i');
  const result = str.match(reg);
  if (result != null) {
    return result[2];
  }
  return null;
};

export const UUID8Bit = () => {
  const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
    'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];

  let uuid = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 8; ++i) {
    const index = Math.min(Math.floor(Math.random() * 62), 61);
    uuid += chars[index];
  }
  return uuid;
};

export const isIpad = process.browser && navigator.userAgent.match(/ipad/i) != null;
export const isIos = process.browser && navigator.userAgent.match(/iphone\sos|ios/i) != null;
export const isMidp = process.browser && navigator.userAgent.match(/midp/i) != null;
export const isUc = process.browser && navigator.userAgent.match(/ucweb/i) != null;
export const isUc7 = process.browser && navigator.userAgent.match(/rv:1.2.3.4/i) != null;
export const isAndroid = process.browser && navigator.userAgent.match(/android/i) != null;
export const isCE = process.browser && navigator.userAgent.match(/windows\sce/i) != null;
export const isWM = process.browser && navigator.userAgent.match(/windows\smobile/i) != null;
export const isMobile = isIpad || isIos || isMidp || isUc || isUc7 || isAndroid || isCE || isWM;
