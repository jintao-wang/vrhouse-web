import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ZTop = ({ children }) => {
  useEffect(() => {
    const container = document.createElement('div');
    document.body.append(container);
    ReactDOM.render(children, container);
    return () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };
  }, []);

  return null;
};

ZTop.propTypes = {
  children: PropTypes.node,
};

ZTop.defaultProps = {
  children: <div />,
};

export default ZTop;
