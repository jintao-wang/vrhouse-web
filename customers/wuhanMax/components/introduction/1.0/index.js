import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IcoMoon from 'react-icomoon';

const iconSet = require('../../../styles/icon/selection.json');

const ContainerSC = styled('div')`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  background: rgba(0,0,0,.5);
  backdrop-filter: Blur(5px);
  z-index: 10000;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopSC = styled('div')`
  left: 0;
  right: 0;
  top: 30px;
  position: absolute;
  display: flex;
  justify-content: center;
`;

const CloseSC = styled('div')`
  position: absolute;
  right: 25px;
  top: 0;
  bottom: 0;
  color: white;
  font-size: 18px;
  margin: auto;
  display: flex;
  align-items: center;
`;

const TitleSC = styled('div')`
    letter-spacing: 2px;
    padding: 6px 15px;
    //background: rgba(0,0,0,.7);
    border-radius: 18px;
    font-size: 18px;
    font-family: PingFangSC-Medium,PingFang SC;
    color: rgba(255,255,255,1);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-shadow: 2px 2px 6px rgba(0,0,0,.2);
`;

const ContentSC = styled('div')`
  padding: 0 25px;
  margin-top: -100px;
  font-size: 16px;
  color: white;
  text-shadow: 2px 2px 6px rgba(0,0,0,.2);
`;

const Introduction = ({
  title,
  content,
  onClose,
}) => (
  <ContainerSC>
    <TopSC>
      <CloseSC onClick={onClose}>
        <IcoMoon iconSet={iconSet} icon="closeBtn" size={18} />
      </CloseSC>
      <TitleSC>
        {title}
      </TitleSC>
    </TopSC>
    <ContentSC dangerouslySetInnerHTML={{ __html: content }} />
  </ContainerSC>
);

Introduction.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onClose: PropTypes.func,
};

Introduction.defaultProps = {
  title: '虚拟售楼处',
  content: '<p>欢迎来到驻在 LIV’N，一个带您驻进城市生活核心的高端租赁住宅品牌。入驻这里，您将拥揽都市生活所要条件：设施完善的居住空间，充满活力的社区，畅通无阻拥抱城市脉搏。在拥有超过 25 年行业经验的全球租赁住宅领军企业 —— 睿星资本（Greystar）的引领下，驻在 LIV’N 带您开启都市生活的全新可能。沉浸于首屈一指的居住环境中，驻进真正的生活里，让一切美好与您紧密相连。</p>',
  onClose: () => {},
};

export default Introduction;
