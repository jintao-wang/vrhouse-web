import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div', ['styleSC'])`
  position: absolute;
  left: 0;
  right: 0;
  top: ${(props) => props.styleSC.top || '10px'};
  margin: auto;
  pointer-events: none;
  text-align: center;
`;

const TitleSC = styled('div', ['active', 'styleSC'])`
  display: inline-flex;
  padding: 6px 20px;
  background: ${(props) => props.styleSC.background || 'rgba(0,0,0,0.75)'};
  border-radius: 6px;
  font-size:  ${(props) => props.styleSC.fontSize || '15px'};
  font-family: PingFangSC-Regular,PingFang SC;
  font-weight:  ${(props) => props.styleSC.fontWeight || 400};
  color:  ${(props) => props.styleSC.color || 'rgba(255,255,255,1)'};
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
  iconDisplay,
}) => {
  const [active, setActive] = useState(titleActive);

  const handleClick = (val) => {
    setActive(val);
    onChange(val);
  };

  return (
    <ContainerSC styleSC={styleSC}>
      <TitleSC
        styleSC={styleSC}
        active={active}
        onClick={() => { handleClick(!active); }}
      >
        <span>{titleName}</span>
        {
          iconDisplay && (
            <span className="icon">
              <i className="icon-down" />
            </span>
          )
        }
      </TitleSC>
    </ContainerSC>
  );
};

Title.propTypes = {
  titleName: PropTypes.string,
  styleSC: PropTypes.shape({
    top: PropTypes.string,
    background: PropTypes.string,
    fontSize: PropTypes.string,
    fontWeight: PropTypes.string,
    color: PropTypes.string,
  }),
  titleActive: PropTypes.bool,
  onChange: PropTypes.func,
  iconDisplay: PropTypes.bool,
};

Title.defaultProps = {
  titleName: '楼盘信息',
  styleSC: {},
  titleActive: false,
  onChange: () => { console.log('This is active change'); },
  iconDisplay: true,
};

export default Title;
