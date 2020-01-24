import React, { useState } from 'react';
import './css/App.css';
import './lib/fa/css/all.min.css';
import { CSSTransition } from 'react-transition-group';
import Leap from './Leap';
import Menu from './Menu';

const CONFIG = {
  difficulty: 0,
  online: true,
  port: 3001,
  players: [{
    name: 'Player 1',
    color: 'white',
    bot: false,
    first: true,
  },{
    name: 'Player 2',
    color: 'black',
    bot: false,
    first: false,
  }],
  size: 8,
};

function App() {
  // add back   <Menu/>
  //If roomURL isn't empty, then Multiplayer
  //go to roomURL.
  if (CONFIG.online) {
    //make new process on server to set CONFIG.port. right now it's static
  }

  return (
    <div className="App">
    <Settings/>

    <Leap config={ CONFIG }/>
    </div>
  );
}

//Move these to their own file
function Settings() {
  const options= {
      'sfx'   :{text: 'SFX', icon: 'fas fa-volume-down', type:'toggle', crossed: false},
      'music' :{text: 'Music', icon: 'fas fa-music', type:'toggle', crossed: false},
      'ads'   :{text: 'Ads', icon: 'fas fa-ad', type:'page'}
    };
  const [container, showContainer] = useState(false);
  //useEffect(()=>containerToggle = !containerToggle);
  const settingsItems = Object.values(options).map( (item, i) =>
    <SettingsItem
      key={ i }
      item={ item }
    />
  );
  return ( <div className='settings'>
      <i className='fas fa-cog' onClick = { () => showContainer(!container) } />
      <CSSTransition
        in={container}
        timeout={0}
        classNames= 'settings-container'
      >
        <div className='setcon'>{settingsItems}</div>
      </CSSTransition>
    </div>
  );
}

function SettingsItem(props) {
  let id = props.item.text.toLowerCase();
  let classes = 'settings-item';
  if(props.item.type === 'toggle'){
    classes += props.item.crossed ? ' crossed' : '';
  }
  return ( <div className= { classes } id={ id } /*onClick={ () => props.handleClick(id) }*/>
    <i className= { props.item.icon } ></i>
  </div> );
}

export default App;
