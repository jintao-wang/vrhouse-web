import { useRef, useEffect } from 'react';

const useInterval = ({
  runningCallback,
  stopCallBack,
  delay,
  immediately,
}) => {
  const savedCallback = useRef(null);

  useEffect(() => {
    savedCallback.current = runningCallback;
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (immediately) {
      tick();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
        if (stopCallBack) {
          setTimeout(() => {
            stopCallBack();
          });
        }
      };
    }
  }, [delay]);
};

export default useInterval;
