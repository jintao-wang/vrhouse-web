import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GlobalClose = ({
  openListener,
  onClose,
  stopPropagation,
  children,
}) => {
  const aimRef = useRef(null);

  useEffect(() => {
    const closeFunc = (e) => {
      if (aimRef.current && aimRef.current.contains(e.target)) return;
      onClose(e);
      if (stopPropagation) {
        e.stopPropagation();
        e.cancelBubble = true;
      }
    };

    if (openListener) {
      document.body.addEventListener('click', closeFunc);
    } else {
      document.body.removeEventListener('click', closeFunc);
    }

    return () => {
      document.body.removeEventListener('click', closeFunc);
    };
  }, [openListener]);

  if (typeof children.type === 'string') {
    return (
      React.cloneElement(
        children,
        {
          ref: aimRef,
        },
      )
    );
  }
  return (
    <div ref={aimRef}>
      {children}
    </div>
  );
};

GlobalClose.propTypes = {
  openListener: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  stopPropagation: PropTypes.bool,
};

GlobalClose.defaultProps = {
  openListener: true,
  onClose: () => {},
  children: <div />,
  stopPropagation: true,
};

export default GlobalClose;
