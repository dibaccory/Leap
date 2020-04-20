import React from 'react';
import { connect } from 'react-redux';
import { bool, array, string, object } from 'prop-types';
import { getUsers, getGame, getHost, getMe, getMoveSelectionsForActiveGame, getMoveStatusForActiveGame } from '../selectors';
import { bindActionCreators } from 'redux';
import { submitMove, enter, exit } from './actions';
import Game from '../Game';
import './styles.css';

class Room extends React.Component {
  constructor ({
  active,
  roomID,
  me,
  users,
  host,
  game,
  move,
  isMoveReadyToSubmit,
  enter,
  submitMove,
}) {
  super();
}

componentDidMount () {
  const { me, enter, roomID } = this.props;
  if (me) enter({me, roomID});
}

render () {
  let { isMoveReadyToSubmit, submitMove, game, move, roomID } = this.props;
  move = move || {to: undefined, from: undefined, captured: undefined};

  return (
    <div className="room-container">
      <Game game={game} move={move}/>
      <button onClick={() => {isMoveReadyToSubmit ? submitMove({roomID, game, move}): console.log('boopies')} }>Play</button>
    </div>
  );
}
}
//<PlayerHeader user={}/>
//
//<PlayerHeader user={}/>
Room.propTypes = {
  me: object,
  users: array.isRequired,
  host: string.isRequired, //userID string?
  game: object.isRequired,
  move: object,
  isMoveReadyToSubmit: bool,
};
//TODO: make selectors
const mapStateToProps = state => ({
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
