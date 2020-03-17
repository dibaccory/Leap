import React from 'react';
//import './styles.css';

const Banner = (props) => (
  <div className='banner-container'>
    { props.ad && <div className='ad'/>}
  </div>
);

export default Banner;
