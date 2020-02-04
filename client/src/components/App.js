import React, { useState } from 'react';
import * as io from "socket.io-client";
import crypto from 'crypto';
import './App.css';
import './lib/fa/css/all.min.css';
import Settings from './Components/Settings';
import Leap from './Scenes/Game';
//import Menu from './Menu';

const CONFIG = {
  difficulty: 0,
  online: true,
  port: 3001,
  player: {},
  size: 8,
};

class App extends React.Component {
  // add back   <Menu/>
  //If roomURL isn't empty, then Multiplayer
  //go to roomURL.
  constructor () {
    super();
    this.socket = io.connect(`http://localhost:${CONFIG.port}`);

    //CONFIG.player = player;
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
        <BannerContainer />
        <ViewContainer/>
        <BottomNavigation/>
      </div>
    );
  }
}

export default App;
