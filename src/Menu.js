import React from 'react';
import './css/menu.css';
//import NavigationModal from './NavigationModal';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {
      activeNavItem: '',
    }

    this.openNavigationModal = this.openNavigationModal.bind(this);
    }

    openNavigationModal(activeItem) {
      return e => this.state.setState({activeNavItem: activeItem});
    }

  render() {
    //Animate <Intro> on start up, fade in rest of Menu
    /*<NavigationModal nav = { this.state.activeNavItem }/>*/
    return (
      <div class='menu-bg'>
        <div class='menu-title'></div>
        <SettingsContainer/>

        <NavigationContainer openNavigationModal = {this.openNavigationModal}/>
      </div>
    )
  }
}

class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeItem: '' };

    this.settingsItems= {
        'sfx'   :{text: 'SFX', type:'toggle', crossed: false},
        'music' :{text: 'Music', type:'toggle', crossed: false},
        'ads'   :{text: 'Ads', type:'page'}
      };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(activeItem) {
    //Check if toggle, Ads, or background color change?
    return e => {
      e.preventDefault();
      //this.setState({ activeItem });  //perform action in render (other than crossing icon or not)
      if(this.settingsItems[activeItem].type == 'toggle') {
        this.settingsItems[activeItem].crossed = !this.settingsItems[activeItem].crossed;
      }
    }
  }

  render() {
    const settingsItems = Object.values(this.settingsItems).map(item => <SettingsItem item={ item } handleClick = { this.handleClick }/>)
    return (
      <div className='settings-container'>
          { settingsItems }
      </div>
    )
  }
}

class NavigationContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeItem: '',
      activeItemPos: 0,
      activeItemColor: '',
      menuItems: [
        {text: 'Stats'},
        {text: 'Create'},
        {text: 'Friends'}
      ],
    }

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(activeItem) {
    return e => {
      e.preventDefault();
      /*
      this.setState({
        activeItem,
        activeItemPos: document.getElementById(activeItem).offsetLeft,
        activeItemColor: window.getComputedStyle(document.getElementById(activeItem)).getPropertyValue('background-color'),
      });
      */
      this.props.openNavigationModal(activeItem);

    }
  }

  render() {
    const navItems = this.state.menuItems.map(item => <NavItem item={ item } handleClick = { this.handleClick }/>)
    return (
      <div className='nav-container'>
        <span className='nav-item--active' style={{left: this.state.activeItemPos, backgroundColor: this.state.activeItemColor}}/>
          { navItems }
      </div>
    )
  }
}

function NavItem(props) {
  let id = props.item.text.toLowerCase();
  return (<div className='nav-item'
               id={ id }
               onClick={ props.handleClick(id) }></div>)
}

function SettingsItem(props) {
  let id = props.item.text.toLowerCase();
  let classes = 'settings-item';
  if(props.item.type == 'toggle'){
    classes += props.item.crossed ? '-crossed' : '';
  }
  return (<div className= { classes } //settings-item-crossed
               id={ id }
               onClick={ props.handleClick(id) }></div>)
}

export default Menu;
