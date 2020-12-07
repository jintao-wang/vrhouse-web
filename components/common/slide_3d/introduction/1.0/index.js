import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div')`
   padding: 0 15px;
   box-sizing: border-box;
   user-select:none;
   overflow: auto;
   width: 100%;
   height: 100%;
   display: flex;
   flex-direction: column;
`;

const TitleSC = styled('div')`
  width: 100%;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,1);
  border-bottom: 1px solid rgba(255,255,255,0.3);
`;

const ContentSC = styled('div')`
  padding: 10px 0;
  font-size: 12px;
  font-family: PingFangSC-Regular,PingFang SC;
  font-weight: 400;
  color: rgba(204,204,204,1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
`;

const LineSC = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const ItemSC = styled('div', ['justOne'])`
  width: ${(props) => (props.justOne ? '100%' : '50%')};
`;

const Introduction = ({
  title,
  params,
}) => (
  <ContainerSC>
    <TitleSC>
      {title}
    </TitleSC>
    <ContentSC>
      {
        params.map((line) => (
          <LineSC>
            {Object.keys(line).map((item) => (
              <ItemSC justOne={Object.keys(line).length === 1}>
                <span>{item}</span>
                <span>{line[item]}</span>
              </ItemSC>
            ))}
          </LineSC>
        ))
      }
    </ContentSC>
  </ContainerSC>
);

Introduction.propTypes = {
  title: PropTypes.string,
  params: PropTypes.arrayOf(),
};

Introduction.defaultProps = {
  title: '',
  params: [],
};

export default Introduction;
