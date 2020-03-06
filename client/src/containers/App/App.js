import React from 'react';
import { connect } from 'react-redux';
import { bool, object } from 'prop-types';
import { getMe, getIsLoggedIn } from '../../selectors/';
//TODO: import WithAuth from 'AuthenticationWrapper'

import ViewStack from '../ViewStack/';
import Login from '../../components/Login/';
import './app.css';

const App = ({ me, isLoggedIn, wsConnect }) => {
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
