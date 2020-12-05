import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: PingFangSC-Regular,Microsoft Yahei,monospace;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    position: relative;
    user-select: none;
    //-webkit-font-smoothing: antialiased;
  }
`;

export default GlobalStyles;
