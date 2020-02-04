import React from 'react';
import './css/menu.css';
import './lib/fa/css/all.min.css';
import NavModalContent from './NavModalContent';
import Leap from './game/Leap';

export var CONFIG = {
  difficulty: 0,
  players: [{
    name: 'Player 1',
    color: 'white',
    bot: false,
    first: true,
  },{
    name: 'Botto',
    color: 'black',
    bot: false,
    first: false,
  }],
  size: 8,
};

//This isn't really a Menu, it's a title screen. Please revisit
class Menu extends React.Component {
  constructor() {
    super();

    this.state = { activeNavItem: '', openGame: false, gameConfig: {}};
    /* gameConfig = {
      difficulty: AI strength,
      first: playerOne | playerTwo,
      playerColor: ,
      opponentColor: ,

    }
  */
    this.openNavModal = this.openNavModal.bind(this);
    this.begin = this.begin.bind(this);
    }

    openNavModal(activeItem) {
      if (activeItem !== this.state.activeNavItem) this.setState({activeNavItem: activeItem});
    }

    begin(playMode, config) {
      if(playMode) { //Singleplayer
        CONFIG = config;
        this.setState({openGame: true, gameConfig: config});

      }
    }

  render() {
    //Animate <Intro> on start up, fade in rest of Menu

    if (this.state.openGame) {
      return <Leap config={ this.state.gameConfig }/>;
    }

    return (
      <div className='menu'>
        <div className='menu-title'>Leap</div>
        <NavModalContent
          type={this.state.activeNavItem}
          begin={this.begin}
        />
        <NavigationContainer openNavModal = { this.openNavModal }/>
      </div>
    )
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



export default Menu;