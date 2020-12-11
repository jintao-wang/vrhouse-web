import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const CommonHeader = ({ title, children }) => (
  <Head>
    <meta name="viewport" content="width=device-width,user-scalable=no,minimum-scale=1,maximum-scale=1,viewport-fit=cover" />
    <title>{title}</title>
    {
      children
    }
  </Head>
);

CommonHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node || null,
};

CommonHeader.defaultProps = {
  title: '装修节点解决方案',
  children: null,
};

export default CommonHeader;
