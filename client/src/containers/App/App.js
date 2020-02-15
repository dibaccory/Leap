import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bool, array, func, string, number, object } from 'prop-types';
import ViewStack from '../ViewStack/';
import './App.css';
import './lib/fa/css/all.min.css';

const App = ({
  me,
  isLoggedIn,
  io,
}) => {
  const ClientSocket = React.createContext();
    return (
      <div className="App">
        <ClientSocket.Provider value={io}>
          //<Splash/> on initial render
          //<BannerContainer />
          <HeaderContainer /> //has settings at upper righthand
          <ViewStack/>
          <BottomNavigation/>
        </ClientSocket.Provider>
      </div>
    );
};

App.propTypes = {
  me: object.isRequired,
  isLoggedIn: bool.isRequired,
}

const actions = {
    login,
    changeView,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = state => ({
  me: getMe(state),
  isLoggedIn: getIsLoggedIn(state),
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
