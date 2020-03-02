import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bool, array, funca, string, number, object } from 'prop-types';
import { getMe, getIsLoggedIn } from '../../selectors/';
import { userLogin } from '../../actions/user';

import ViewStack from '../ViewStack/';
import Room from '../Room/';
import BottomNavigation from '../BottomNavigation/';
import './app.css';
//import './lib/fa/css/all.min.css';

class App extends React.Component {
  constructor({ socket, me, isLoggedIn, userLogin}) {
    super();
    this.me = me;
    this.socket = socket;
    this.isLoggedIn = isLoggedIn;
    userLogin({me: this.me});
  }

  //const ClientSocket = React.createContext();
  render () {
    return this.isLoggedIn
      ? (
        <div className="App">
          <ViewStack/>
          </div>
      )
      : (<div className="App"> LOADING </div>);
  }
}
//{!isLoggedIn && <Splash/>}
//<BannerContainer />
//<HeaderContainer me={me}/> //has settings at upper righthand
//<CreateGameModal io={io}/>
//<BottomNavigation/>

App.propTypes = {
  me: object.isRequired,
  isLoggedIn: bool.isRequired,
}
//
const actions = {
    userLogin,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = state => ({
  me: getMe(state),
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
