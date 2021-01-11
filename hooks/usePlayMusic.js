import { useEffect, useRef, useState } from 'react';

const usePlayMusic = ({
  initialState,
  musicSource,
  isAutoPlay,
}) => {
  const music = useRef(null);
  const [musicState, setMusicState] = useState(initialState);
  const musicIndex = useRef(0);
  const musicStateRef = useRef(initialState);

  useEffect(() => {
    music.current = new Audio();
    music.current.addEventListener('ended', () => {
      if (!musicStateRef.current) return;
      setNextMusic();
      play();
    });

    if (!isAutoPlay) return;

    const autoPlay = () => {
      document.removeEventListener('touchstart', autoPlay);
      document.removeEventListener('click', autoPlay);
      setTimeout(() => {
        play();
      }, 300);
    };

    document.addEventListener('WeixinJSBridgeReady', play);
    document.addEventListener('touchstart', autoPlay);
    document.addEventListener('click', autoPlay);
  }, []);

  useEffect(() => {
    musicStateRef.current = musicState;
  }, [musicState]);

  useEffect(() => {
    if (musicSource[0]) {
      if (music.current.src.split('/').pop() === musicSource[0].split('/').pop()) return;
      [music.current.src] = musicSource;
      if (musicState) play();
    } else {
      music.current.src = '';
      setMusicState(false);
    }
  }, [musicSource]);

  const setNextMusic = () => {
    musicIndex.current = (musicIndex.current + 1) % musicSource.length;
    music.current.src = musicSource[musicIndex.current];
  };

  const play = () => {
    const promise = music.current.play();
    if (promise) {
      promise.then(() => {
        setMusicState(true);
      }).catch((err) => {
        setMusicState(false);
        console.error(err);
      });
    }
  };

  const pause = () => {
    setMusicState(false);
    music.current.pause();
  };

  return [musicState, play, pause];
};

export default usePlayMusic;
