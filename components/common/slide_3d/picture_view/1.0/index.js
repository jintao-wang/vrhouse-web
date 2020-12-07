import React, { useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ContainerSC = styled('div')`
   user-select:none;
   overflow: auto;
   width: 100%;
   height: 100%;
   display: flex;
   pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
`;

const LeftPartSC = styled('div', ['url'])`
  width: 50%;
  height: 100%;
  background: url(${(props) => props.url}) no-repeat center / cover;
  cursor: pointer;
`;

const RightPartSC = styled('div')`
  width: 50%;
  height: 100%;
`;

const SmallImgSC = styled('div', ['url', 'moreImg'])`
  width: 100%;
  height: 50%;
  background: url(${(props) => props.url}) no-repeat center / cover;
  cursor: pointer;
`;

const SmallCoverSC = styled('div')`
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-family: PingFangSC-Medium,PingFang SC;
  font-weight: 500;
  color: rgba(255,255,255,1);
  border-bottom-right-radius: 4px;
`;

const PictureView = ({
  pictureList,
  onImgClick,
  active,
}) => {
  useEffect(() => {}, []);
  return (
    <ContainerSC active={active}>
      <LeftPartSC url={pictureList[0].url} onClick={() => onImgClick(0)} />
      <RightPartSC>
        <SmallImgSC url={pictureList[1].url} onClick={() => onImgClick(1)} />
        <SmallImgSC
          url={pictureList[2].url}
          onClick={() => onImgClick(2)}
          moreImg={pictureList.length > 3}
        >
          {
            pictureList.length > 3 && (
              <SmallCoverSC>
                {`+${pictureList.length}`}
              </SmallCoverSC>
            )
          }
        </SmallImgSC>
      </RightPartSC>
    </ContainerSC>
  );
};

PictureView.propTypes = {
  pictureList: PropTypes.arrayOf({
    describe: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  onImgClick: PropTypes.func,
  active: PropTypes.bool,
};

PictureView.defaultProps = {
  onImgClick: () => {},
  active: false,
};

export default PictureView;
