import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Animation = ({
  visible,
  children,
  onVisibleAnimationEnd,
  onInvisibleAnimationEnd,
}) => {
  const [_visible, setVisible] = useState(visible);
  const [trigger, setTrigger] = useState(visible);

  useEffect(() => {
    if (visible) {
      setVisible(visible);
    }
    setTrigger(visible);
  }, [visible]);

  if (!_visible) return null;
  return (
    React.cloneElement(
      children,
      {
        aniTrigger: trigger,
        onAnimationEnd: () => {
          if (trigger) {
            onVisibleAnimationEnd();
          } else {
            onInvisibleAnimationEnd();
            setVisible(false);
          }
        },
      },
    )
  );
};

Animation.prototype = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  onVisibleAnimationEnd: PropTypes.func,
  onInvisibleAnimationEnd: PropTypes.func,
};

Animation.defaultProps = {
  visible: true,
  children: <div />,
  onVisibleAnimationEnd: () => { console.log('onVisibleTransitionEnd'); },
  onInvisibleAnimationEnd: () => { console.log('onInvisibleTransitionEnd'); },
};

export default Animation;
