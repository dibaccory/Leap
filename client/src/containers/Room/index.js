import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, array, func, string, number, object } from 'prop-types';
import { getUsers, getGame, getHost, getMe } from '../../selectors/';
import Game from '../../components/Game';

const Room = ({
  active,
  game,
  users,
  host,
}) => {
  return (
    <div className="room-container">
      <Game game={game}/>
    </div>
  );
}
//<PlayerHeader user={}/>
//
//<PlayerHeader user={}/>
Room.propTypes = {
  me: object,
  users: object.isRequired,
  host: string.isRequired, //userID string?
  game: object.isRequired,
};
//TODO: make selectors
const mapStateToProps = state => ({
  me: getMe(state),
  users: getUsers(state),
  host: getHost(state),
  game: getGame(state),
  //errorMessage: getErrorMessage(state),
  //modalMessage: getModalMessage(state),
});

export default connect(mapStateToProps)(Room);
