import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bool, array, func, string, number, object } from 'prop-types';
import ViewStack from '../ViewStack/';
import BottomNavigation from '../BottomNavigation/';
import './App.css';
import './lib/fa/css/all.min.css';

const App = ({
  me,
  isLoggedIn,
  io,
}) => {
  //const ClientSocket = React.createContext();
    return (
      <div className="App">
        //<ClientSocket.Provider value={io}>
          {!isLoggedIn && <Splash/>}
          //<BannerContainer />
          <HeaderContainer me={me}/> //has settings at upper righthand
          <ViewStack me={me} io={io}/>
          <BottomNavigation/>
        //</ClientSocket.Provider>
      </div>
    );
};

App.propTypes = {
  me: object.isRequired,
  isLoggedIn: bool.isRequired,
}

const actions = {
    changeView,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = state => ({
  me: getMe(state),
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
