import React from 'react';
import { connect } from 'react-redux';
import { bool, object } from 'prop-types';
import { getMe, getIsLoggedIn } from './modules/selectors/';
//TODO: import WithAuth from 'AuthenticationWrapper'
import './styles.css';
import ViewStack from './modules/ViewStack';
import Login from './modules/Login';


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

export {defualt} from './store';
export default connect(mapStateToProps)(App);
