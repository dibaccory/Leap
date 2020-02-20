import React from 'react';
import './Viewport.css';
import Lobby from '../components/Lobby';
import Leaderboard from '../components/Leaderboard';
import Profile from '../components/Profile';

const ViewStack = () => {
  return (
    <div className="view-container">
      <Lobby id="Home"/>
      //<Lobby id="Browse" io={io}/>  //Loads global public games
      //<Leaderboard id="Leaderboard"/>
      //<Profile id="Profile" me={me} settings={settings}/>
    </div>
  );
};

export default ViewStack;
