import React from 'react';
import './Banner.css';

function Banner (props) {

  return (
    <div className='banner-container'>
      { props.ad && <div className='ad'/>}
    </div>
  );
}

export default Banner;
