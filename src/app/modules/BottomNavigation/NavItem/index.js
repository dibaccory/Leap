import React from 'react';
import './NavItem.css';
const NavItem = ({id, icon}) => (  <a href={'#'+id} className='NavigationItem'> <i className={icon} /> </a>);
export default NavItem;
