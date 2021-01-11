import React, {
  useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';

const GlobalClose = ({ onClose, children }) => {
  const aimRef = useRef(null);

  useEffect(() => {
    const closeFunc = (e) => {
      if (aimRef.current.contains(e.target)) return;
      onClose();
      e.stopPropagation();
      e.cancelBubble = true;
    };

    document.body.addEventListener('click', closeFunc);
    return () => {
      document.body.removeEventListener('click', closeFunc);
    };
  }, []);

  return (
    <div ref={aimRef}>
      {children}
    </div>
  );
};

GlobalClose.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
};

GlobalClose.defaultProps = {
  onClose: () => {},
  children: <div />,
};

export default GlobalClose;
