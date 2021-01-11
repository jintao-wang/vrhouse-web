import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ColorTheme } from '../../../config';
import RowScroll from '../../../../../components/rowScroll/2.0';
import TriangleIcon from '../../triangle_icon/1.0/triangleIcon';

const ContainerSC = styled('div')`
  width: 100%;
  pointer-events: none;
  padding-bottom: 18px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

const SecondContainerSC = styled('div', ['visible'])`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) => (props.visible ? 'translateY(0)' : 'translateY(118px)')};
  transition: transform .4s, opacity .4s;
`;

const ContentSC = styled('div')`
  width: 100%;
  background: rgba(0,0,0,0.75);
  height: 120px;
  border-radius: 6px;
  pointer-events: auto;
`;

const ScrollItemSC = styled('div', 'url')`
  height: 100px;
  width: 82px;
  margin: 0 5px;
  position: relative;
  
  .img {
    height: 80px;
    width: 80px;
    background: url(${(props) => props.url}) no-repeat center / cover;
    border: ${(props) => (props.active ? `1px solid ${ColorTheme}` : '1px solid rgba(0,0,0,0)')};
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    
    .watching {
      position: absolute;
      left: 0;
      top: 0;
      background: linear-gradient(135deg,rgba(7,166,238,1) 0%,rgba(35,216,139,.95) 100%);
      width: 36px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 9px;
      font-family: PingFangSC-Medium,PingFang SC;
      font-weight: 500;
      color: rgba(255,255,255,1);
    }
  }
  
  .describe {
    margin-top: 5px;
    font-size: 11px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 500;
    color: ${(props) => (props.active ? ColorTheme : 'white')};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
`;

const GroupListBar = ({
  visible,
  iconPosition,
  groupList,
  group,
  onChange,
  activeIndex,
}) => {
  useEffect(() => {
    // console.log(groupList);
  }, []);

  const getBackground = (item) => {
    // eslint-disable-next-line react/prop-types
    const domain = item.domain || group.defaultDomain;
    return `${domain}${item.packageId}/CoverImage/Cover.jpg`;
  };

  // eslint-disable-next-line react/prop-types
  const ScrollItem = ({ item, active }) => (
    <ScrollItemSC url={getBackground(item)} active={active}>
      <div className="img">
        {active && <div className="watching">正在看</div>}
      </div>
      {/* eslint-disable-next-line react/prop-types */}
      <div className="describe">{item.packageName}</div>
    </ScrollItemSC>
  );

  return (
    <ContainerSC>
      <SecondContainerSC visible={visible}>
        <ContentSC>
          <RowScroll
            scrollList={groupList}
            onChange={onChange}
            activeIndex={activeIndex}
          >
            <ScrollItem group={group} />
          </RowScroll>
        </ContentSC>
        <TriangleIcon left={iconPosition} />
      </SecondContainerSC>
    </ContainerSC>
  );
};

GroupListBar.propTypes = {
  visible: PropTypes.bool,
  iconPosition: PropTypes.number,
  groupList: PropTypes.arrayOf(),
  group: PropTypes.shape({}),
  onChange: PropTypes.func,
  activeIndex: PropTypes.number,
};

GroupListBar.defaultProps = {
  visible: true,
  iconPosition: 0,
  groupList: [],
  group: {},
  onChange: () => {},
  activeIndex: 0,
};

export default GroupListBar;
