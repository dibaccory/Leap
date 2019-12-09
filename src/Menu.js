class Menu extends React.Component {
  render() {
    //Animate <Intro> on start up, fade in rest of Menu
    return (<NavContainer/>)
  }
}

class SettingsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { activeItem: '' };

    let settingsItems: {
        'sfx'   :{text: 'SFX', type:'toggle', crossed: False},
        'music' :{text: 'Music', type:'toggle', crossed: False},
        'ads'   :{text: 'Ads', type:'page'}
      };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(activeItem) {
    //Check if toggle, Ads, or background color change?
    return e => {
      e.preventDefault();
      //this.setState({ activeItem });  //perform action in render (other than crossing icon or not)
      if(settingsItems[activeItem].type == 'toggle') {
        settingsItems[activeItem].crossed = !settingsItems[activeItem].crossed;
      }
    }
  }

  render() {
    const settingsItems = settingsItems.values().map(item => <ToggleItem item={ item } handleClick = { this.handleClick }/>)
    return (
      <div className='settings-container'>
          { settingsItems }
      </div>
    )
  }
}

class NavContainer extends React.Component {
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

      this.setState({
        activeItem,
        activeItemPos: document.getElementById(activeItem).offsetLeft,
        activeItemColor: window.getComputedStyle(document.getElementById(activeItem)).getPropertyValue('background-color'),
      })
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
