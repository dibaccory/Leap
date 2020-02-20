import React, { Component } from 'react';
import { bool, array, func, string, number, object } from 'prop-types';
import './ui.css';
import Game from './Game';

const Room = ({
  active,
  game,
  users,
  host,
}) => {
  return (
    <div className="room-container">
      //<PlayerHeader user={}/>
      //<Game game={game} />
      //<PlayerHeader user={}/>
    </div>
  );
}

Room.propTypes = {
  active: bool,
  game: object.isRequired,
  //me: object.isRequired,
  users: object.isRequired,
  //errorMessage: string,
  //modalMessage: string,
  host: string.isRequired, //userID string?
};
//TODO: make selectors
const mapStateToProps = state => ({
  //me: getMe(state),
  users: getUsers(state),
  game: getGame(state),
  //errorMessage: getErrorMessage(state),
  //modalMessage: getModalMessage(state),
  host: getHost(state),
});

export default connect(mapStateToProps)(Room);
