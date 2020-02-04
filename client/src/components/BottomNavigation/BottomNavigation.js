import React from 'react';
import './BottomNavigation.css';

function BottomNavigation (props) {

  const navIcons = ['fas fa-stats', 'fas fa-world', 'fas fa-plus', 'fas fa-home', 'fas fa-cog'];

    return (
      <div className='BottomNavigation'>
        <NavItem id='Leaderboard' icon={navIcons[0]} />
        <NavItem id='Global' icon={navIcons[1]}/>
        <NavItem id='CreateGame' icon={navIcons[2]}/>
        <NavItem id='Home' icon={navIcons[3]}/>
        <NavItem id='Settings' icon={navIcons[4]}/>
      </div>
    );
}

const NavItem = ({id, icon}) => (  <a href={'#'+id} className='BottomNavigationItem'> <i className={icon} /> </a>);

export default BottomNavigation;
