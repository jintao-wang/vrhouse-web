import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Transition = ({
  visible,
  children,
  onVisibleTransitionEnd,
  onInvisibleTransitionEnd,
}) => {
  const [_visible, setVisible] = useState(visible);
  const [trigger, setTrigger] = useState(visible);

  useEffect(() => {
    if (visible) {
      setVisible(visible);
    }
    setTrigger(visible);
  }, [visible]);

  return (
    _visible
    && React.cloneElement(
      children,
      {
        aniTrigger: trigger,
        onTransitionEnd: () => {
          if (trigger) {
            onVisibleTransitionEnd();
          } else {
            onInvisibleTransitionEnd();
            setVisible(false);
          }
        },
      },
    )
  );
};

Transition.prototype = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  onVisibleTransitionEnd: PropTypes.func,
  onInvisibleTransitionEnd: PropTypes.func,

};

Transition.defaultProps = {
  visible: true,
  children: <div />,
  onVisibleTransitionEnd: () => { console.log('onVisibleTransitionEnd'); },
  onInvisibleTransitionEnd: () => { console.log('onInvisibleTransitionEnd'); },
};

export default Transition;
