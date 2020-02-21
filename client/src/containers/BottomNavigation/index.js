import React from 'react';
import NavItem from '../../components/NavItem/';
import './BottomNavigation.css';

function BottomNavigation (props) {

  const navIcons = ['fas fa-stats', 'fas fa-world', 'fas fa-plus', 'fas fa-home', 'fas fa-user'];

    return (
      <div className='BottomNavigation'>
        <NavItem id='Home' icon={navIcons[3]}/>
        <NavItem id='Browse' icon={navIcons[1]}/>
        <NavItem id='CreateGame' icon={navIcons[2]}/>
        <NavItem id='Leaderboard' icon={navIcons[0]} />
        <NavItem id='Profile' icon={navIcons[4]}/>
      </div>
    );
}

export default BottomNavigation;
