import React, { useEffect, useRef } from 'react';
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
  text-align: center;
`;

const VideoContainerSC = styled('div')`
  width: 100%;
  flex: 1;
  padding: 5px 0;
  box-sizing: border-box;
  max-height: calc(100% - 42px);
  
  video {
    width: 100%;
    height: 100%;
  }
`;

const VideoIntroduction = ({
  title,
  url,
  poster,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // videoRef.current.src = url;
    // videoRef.current.load();
  }, []);

  return (
    <ContainerSC>
      {
        title && <TitleSC>{title}</TitleSC>
      }
      <VideoContainerSC>
        <video controls ref={videoRef} poster={poster}>
          <source src={url} />
        </video>
      </VideoContainerSC>
    </ContainerSC>
  );
};

export default VideoIntroduction;
