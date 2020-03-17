import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles.css';
import {configureStore} from '../app/';
import App from '../app/';
import SocketConnection from '../app/modules/SocketConnection';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
delete window.__INITIAL_STATE__;

export const Root = () => (
    <Provider store={store}>
      <SocketConnection>
        <App key={0}/>
      </SocketConnection>
    </Provider>
);
ReactDOM.render(<Root />, document.getElementById('root'));
