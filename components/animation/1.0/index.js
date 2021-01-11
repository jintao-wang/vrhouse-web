import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Animation = ({ visible, content }) => {
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
    content(trigger, () => {
      if (trigger) return;
      setVisible(false);
    })
  );
};

Animation.prototype = {
  visible: PropTypes.bool,
  content: PropTypes.func,
};

Animation.defaultProps = {
  visible: true,
  content: () => {},
};

export default Animation;
