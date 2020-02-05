import React, { useState } from 'react';
import * as io from "socket.io-client";
import './App.css';
import './lib/fa/css/all.min.css';

class App extends React.Component {
  constructor () {
    super();
    this.socket = io.connect(`http://localhost:${CONFIG.port}`);
    this.state = {
      user: {},
      settings: {
        musicVolume: 100,
        sfxVolume: 100,
        notificationBadges: true,
      }
    };
  }

  render () {

    return (
      <div className="App">
        //<Splash/> on initial render
        //<BannerContainer />
        <HeaderContainer /> //has settings at upper righthand
        <ViewContainer/>
        <BottomNavigation/>
      </div>
    );
  }
}

const ViewContainer () => (
  <div className="view-container">
    <div className="view-window">
      <Lobby id="Home" />
      <Lobby id="Browse" />
      <Leaderboard />
      <Profile />
    </div>
    <NewGame/>
  </div>
);

export default App;
