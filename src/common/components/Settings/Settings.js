import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

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


export default Settings;
