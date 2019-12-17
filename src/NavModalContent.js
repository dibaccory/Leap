import React, {useState} from 'react';
import './css/menu.css';
import Slider from 'rc-slider';
import { CSSTransition } from 'react-transition-group';
import 'rc-slider/assets/index.css';


function NavModalContent(props){
  const modalType = {
    'stats':    <div className='stats-container'/>,
    'create':   <NewGame begin={props.begin}/>,
    'friends':  <div className='friends-container'/>,
  };

  return (
    <div className='nav-modal'>
     { modalType[props.type] }
    </div>
  );
}
//playmode
//FriendRow

function NewGame(props) {
  const [mode, setMode] = useState(true);
  const [first, isFirst] = useState(true);
  let botDifficulty;

  const readyGame = (mode) => {
    /*
    mpFirst: TRUE if in mp-new-online, FALSE if mp-room-invite
    */
    mode ? props.begin(mode, {difficulty: botDifficulty, first: first})
         : props.begin(mode, {roomURL: 'HASH', first: ''});
  };

  return (<div className='nav-modal-container'>
    <div className='playmode-btn-container'>
      <div className='playmode-sp-btn' onClick={ () => setMode(true) }>
        <i className='fas fa-user fa-2x'/>
        Singleplayer
      </div>
      <div className='playmode-mp-btn' onClick={ () => setMode(false) }>
        <i className='fas fa-user-friends fa-2x'/>
        Multiplayer
      </div>
    </div>
    <CSSTransition
      in={mode}
      classNames= 'playmode-container'
      timeout={0}
    >
      <div className='playmode-config'>
        Difficulty
        <Slider
          step={10}
          defaultValue={50}
          onAfterChange={(e) => botDifficulty = e/10}
        />
        <label>
          Player goes first
          <input
            id='goFirst' type='checkbox'
            className='sp-player-goes-first'
            checked={first}
            onChange= {() => isFirst(!first)}
            />
        </label>
      </div>
    </CSSTransition>
    <CSSTransition
      in={!mode}
      classNames= 'playmode-container'
      timeout={0}
    >
      <div className='playmode-config-mp'>
        <div className='mp-options'>
          <div className='mp-new-online'> New Game
            <div className='mp-new-online-desc'>
              Start a new game.
            </div>
          </div>
          <div className='mp-new-local'> New Local Game
            <div className='mp-new-local-desc'>
              If you want to play on the same machine.
            </div>
          </div>
          <div className='mp-join'> Have a link? Join Game
            <input type='text' className='mp-room-invite'/>
          </div>
        </div>
      </div>
    </CSSTransition>
    <button /*TODO: only appear when required input satisfied (sp: just click the playmode, mp: select one of three options)*/
      className='start-game-btn'
      onClick={ () => readyGame(mode)}>
      Start
    </button>
    </div>
  );
}

export default NavModalContent;
