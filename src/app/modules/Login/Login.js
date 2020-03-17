import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { func } from 'prop-types';
import { userLogin } from './actions';
import { v4 as getUUID } from 'uuid';

const Login = ({ userLogin }) => {
  const [displayName, setDisplayName] = useState('');
    return (
      <div>
        <label>
          Display Name:
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </label>
        <button onClick={ () => userLogin({me: {id: getUUID(), name: displayName} })} >Done</button>
      </div>
    );
};

Login.propTypes = {
  userLogin: func.isRequired,
}

const actions = { userLogin };

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(null, mapDispatchToProps)(Login);
