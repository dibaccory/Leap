import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bool, array, funca, string, number, object } from 'prop-types';
import { getMe, getIsLoggedIn } from '../../selectors/';
import ViewStack from '../ViewStack/';
import Login from '../../components/Login/';
import './app.css';

const App = ({ me, socket, isLoggedIn }) => {
  //const ClientSocket = React.createContext();
    return (
        <div className="App">
          {isLoggedIn ? <ViewStack/> : <Login/>}
        </div>
      );
}

App.propTypes = {
  me: object,
  isLoggedIn: bool.isRequired,
}

const mapStateToProps = state => ({
  me: getMe(state),
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(App);
