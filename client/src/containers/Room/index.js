import React, { Component } from 'react';
import './ui.css';
import Game from './Game';

const Room = ({
  game,
  io,
  me,
  users,
  errorMessage,
  modalMessage,
  host,
}) => {
  return (
    <div className="room-container">
      //<PlayerHeader user={}/>
      <Game game={game} />
      //<PlayerHeader user={}/>
    </div>
  );
}

Room.propTypes = {
  game: object.isRequired,
  me: object.isRequired,
  users: object.isRequired,
  errorMessage: string,
  modalMessage: string,
  host: string.isRequired, //userID string?
};
//TODO: make selectors
const mapStateToProps = state => ({
  game: getGame(state),
  me: getMe(state),
  users: getUsers(state),
  errorMessage: getErrorMessage(state),
  modalMessage: getModalMessage(state),
  host: getHost(state),
});

export default connect(mapStateToProps)(Room);
