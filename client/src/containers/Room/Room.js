import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, array, func, string, number, object } from 'prop-types';
import { getUsers, getGame, getHost, getMe, getMoveSelectionsForActiveGame, getMoveStatusForActiveGame } from '../../selectors/';
import { bindActionCreators } from 'redux';
import { submitMove, enter, exit } from '../../actions/room';
import Game from '../../components/Game';
import './Room.css';

const Room = ({
  active,
  roomID,
  me,
  users,
  host,
  game,
  move,
  isMoveReadyToSubmit,
}) => {
  move = move || {to: undefined, from: undefined, captured: undefined};
  if (active) enter(me, roomID);
  return (
    <div className="room-container">
      <Game game={game} move={move}/>
      <button onClick={() => {isMoveReadyToSubmit ? submitMove(game, move): console.log('boopies')} }>Play</button>
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
  move: object,
  isMoveReadyToSubmit: bool,
};
//TODO: make selectors
const mapStateToProps = state => ({
  me: getMe(state),
  users: getUsers(state),
  host: getHost(state),
  game: getGame(state),
  move: getMoveSelectionsForActiveGame(state),
  isMoveReadyToSubmit: getMoveStatusForActiveGame(state),
  //errorMessage: getErrorMessage(state),
  //modalMessage: getModalMessage(state),
});

const actions = {
  submitMove,
  enter,
  exit,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Room);