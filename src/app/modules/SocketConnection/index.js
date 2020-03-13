import React from 'react';
import { connect } from 'react-redux';
import { wsConnect } from './actions';

class SocketConnection extends React.Component {
  componentDidMount () {
    this.props.dispatch(wsConnect());
  }
  render () {
    return <div>{this.props.children}</div>;
  }
}

export default connect()(SocketConnection);
