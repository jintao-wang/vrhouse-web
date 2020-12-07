import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ZTop = ({ children }) => {
  const container = useRef(document.createElement('div'));
  useEffect(() => {
    document.body.append(container.current);
    return () => {
      ReactDOM.unmountComponentAtNode(container.current);
      document.body.removeChild(container.current);
    };
  }, []);

  // eslint-disable-next-line react/no-render-return-value
  return ReactDOM.render(children, container.current);
};

ZTop.propTypes = {
  children: PropTypes.node,
};

ZTop.defaultProps = {
  children: <div />,
};

export default ZTop;
