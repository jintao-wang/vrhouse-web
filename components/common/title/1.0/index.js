import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['styleSC'])`
  position: absolute;
  left: 0;
  right: 0;
  top: ${(props) => props.styleSC.top};
  margin: auto;
  pointer-events: none;
  text-align: center;
`;

const TitleSC = styled('div', ['active'])`
  display: inline-flex;
  padding: 6px 20px;
  background: rgba(0,0,0,0.75);
  border-radius: 6px;
  font-size: 15px;
  font-family: PingFangSC-Regular,PingFang SC;
  font-weight: 400;
  color: rgba(255,255,255,1);
  pointer-events: auto;
  align-items: center;
  
  .icon {
    margin-left: 8px;
    transform: ${(props) => (props.active ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform .2s;
    
    i {
      font-size: 14px;
    }
  }
`;

const Title = ({
  titleName,
  styleSC,
  titleActive,
  onChange,
}) => {
  const [active, setActive] = useState(titleActive);

  const handleClick = (val) => {
    setActive(val);
    onChange(val);
  };

  const style = {
    top: '10px',
    ...styleSC,
  };

  return (
    <ContainerSC styleSC={style}>
      <TitleSC active={active} onClick={() => { handleClick(!active); }}>
        <span>{titleName}</span>
        <span className="icon">
          <i className="icon-down" />
        </span>
      </TitleSC>
    </ContainerSC>
  );
};

Title.propTypes = {
  titleName: PropTypes.string,
  styleSC: PropTypes.shape({
    top: PropTypes.string,
  }),
  titleActive: PropTypes.bool,
  onChange: PropTypes.func,
};

Title.defaultProps = {
  titleName: '楼盘信息',
  styleSC: {},
  titleActive: false,
  onChange: () => { console.log('This is active change'); },
};

export default Title;
