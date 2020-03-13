import React from 'react';
import './styles.css';

function Banner (props) {

  return (
    <div className='banner-container'>
      { props.ad && <div className='ad'/>}
    </div>
  );
}

export default Banner;
