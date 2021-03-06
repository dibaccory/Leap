import React from 'react';
import { connect } from 'react-redux';
import { bool, object } from 'prop-types';
import { getMe, getIsLoggedIn } from '../../selectors/';
//TODO: import WithAuth from 'AuthenticationWrapper'
import './App.css';
import ViewStack from '../ViewStack/';
import Login from '../../components/Login/';


const App = ({ me, isLoggedIn, wsConnect }) => {
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
