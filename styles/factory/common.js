export const BackgroundTheme = 'rgba(0,0,0,.75)';
export const ColorTheme = (opacity) => {
  if (opacity) {
    return `rgba(242,170,54, ${opacity})`;
  }
  return 'rgb(242,170,54)';
};
