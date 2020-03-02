import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store/';
import socket from './socket';
import App from './containers/App/';


export const Root = () => (
    <Provider store={store}>
      <App key={0} socket={socket}/>
    </Provider>
);
ReactDOM.render(<Root />, document.getElementById('root'));

//serviceWorker.unregister();
