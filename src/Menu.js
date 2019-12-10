import React from 'react';
import './css/menu.css';
import './lib/fa/css/all.min.css';
import NavigationModal from './NavigationModal';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = { activeNavItem: '' };

    this.openNavModal = this.openNavModal.bind(this);
    }

    openNavModal(activeItem) {
      if (activeItem !== this.state.activeNavItem) this.setState({activeNavItem: activeItem});
    }

  render() {
    //Animate <Intro> on start up, fade in rest of Menu

    return (
      <div className='menu'>
        <div className='menu-title'>Leap</div>
        <SettingsContainer/>
        <NavigationModal activeNavItem = { this.state.activeNavItem }/>
        <NavigationContainer openNavModal = { this.openNavModal }/>
      </div>
    )
  }
}

class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeItem: '', condition: false };

    this.settingsItems= {
        'sfx'   :{text: 'SFX', icon: 'fas fa-volume-down', type:'toggle', crossed: false},
        'music' :{text: 'Music', icon: 'fas fa-music', type:'toggle', crossed: false},
        'ads'   :{text: 'Ads', icon: 'fas fa-ad', type:'page'}
      };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(activeItem) {
      if(this.settingsItems[activeItem].type === 'toggle') {
        this.settingsItems[activeItem].crossed = !this.settingsItems[activeItem].crossed;
      }
  }

  toggleSettings() {
    this.setState({condition: !this.state.condition});
  }

  render() {
    const settingsItems = Object.values(this.settingsItems).map(
      (item, i) => <SettingsItem key={ i }
                                 item={ item }
                                 handleClick = { this.handleClick }/> );
    let containerClass = this.state.condition ? 'settings-container active' : 'settings-container';
    return ( <div className='settings'>
        <i className='fas fa-cog' onClick = { () => this.toggleSettings() } />
        <div className= { containerClass }>
          { settingsItems }
        </div>
      </div> );
  }
}

class NavigationContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeNavItem: props.activeNavItem,
      activeItemPos: 0,
      activeItemColor: '',
      menuItems: [
        {text: 'Stats', icon: 'fas fa-medal', active: false},
        {text: 'Create', icon: 'fas fa-plus', ready: false, active: false},
        {text: 'Friends', icon: 'fas fa-users', active: false}
      ],
    };

    this.openNavModal = props.openNavModal;
  }

  render() {
    const navItems = this.state.menuItems.map(
      (item, i) => <NavItem key={ i }
                            item={ item }
                            openNavModal = { this.openNavModal }/> );
    return ( <div className='nav-container'> { navItems } </div> );
  }
}

function NavItem(props) {
  let id = props.item.text.toLowerCase();
  let classes = 'nav-item';
  classes += props.item.ready ? ' ready' : '';
  classes += props.item.active ? ' active': '';
  return ( <div className= { classes } id={ id } onClick={ () => props.openNavModal(id) }>
      <i className= { props.item.icon } ></i>
    </div> );
}

function SettingsItem(props) {
  let id = props.item.text.toLowerCase();
  let classes = 'settings-item';
  if(props.item.type === 'toggle'){
    classes += props.item.crossed ? ' crossed' : '';
  }
  return ( <div className= { classes } id={ id } onClick={ () => props.handleClick(id) }>
    <i className= { props.item.icon } ></i>
  </div> );
}

export default Menu;
