import React, { useState } from 'react';
import './App.css';
import './lib/fa/css/all.min.css';

class App extends React.Component {
  static ClientSocket = React.createContext();
  constructor () {
    super();
    this.socket =
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
        <ClientSocket.Provider value={this.socket}>
          //<Splash/> on initial render
          //<BannerContainer />
          <HeaderContainer /> //has settings at upper righthand
          <ViewContainer/>
          <BottomNavigation/>
        </ClientSocket.Provider>
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
