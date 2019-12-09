class Menu extends React.Component {
  render() {
    return (<NavContainer/>)
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
  return (
    //TODO: css for icon
    <div className='nav-item' id={ props.item.text } onClick={ props.handleClick(props.item.text) }></div>
  )
}
