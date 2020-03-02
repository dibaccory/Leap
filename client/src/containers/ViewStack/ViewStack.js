import React from 'react';
import Lobby from '../Lobby';
import Leaderboard from '../Leaderboard';
//import Profile from '../Profile';

const ViewStack = () => {
  return (
    <div className="view-container">
      <Lobby id="Home"/>

    </div>
  );
};

//<Lobby id="Browse" io={io}/>  //Loads global public games
//<Leaderboard id="Leaderboard"/>
//<Profile id="Profile" me={me} settings={settings}/>

export default ViewStack;
