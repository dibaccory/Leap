import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bool, array, func, string, number, object } from 'prop-types';
import { getMe, getIsLoggedIn } from '../../selectors/';
import ViewStack from '../ViewStack/';
import Room from '../Room/';
import BottomNavigation from '../BottomNavigation/';
import './index.css';
//import './lib/fa/css/all.min.css';

const App = ({
  me,
  isLoggedIn,
}) => {
  //const ClientSocket = React.createContext();
    return (
      <div className="App">
        <ViewStack/>
      </div>
    );
};
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
// const actions = {
//     changeView,
// };
//
// const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapStateToProps = state => ({
  me: getMe(state),
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(App);
