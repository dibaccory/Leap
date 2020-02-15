import React from 'react';
import './Viewport.css';
import Lobby from '../Lobby/Lobby';
import Leaderboard from '../Leaderboard/Leaderboard';
import Profile from '../Profile/Profile';

const ViewStack () => (
  <div className="view-container">
      <Lobby id="Home" />
      <Lobby id="Browse" />
      <Leaderboard id="Leaderboard"/>
      <Profile id="Profile"/>
  </div>
);

export default ViewStack;
