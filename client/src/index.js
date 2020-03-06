import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store/';
import App from './containers/App/';
import SocketConnection from './containers/SocketConnection';


export const Root = () => (
    <Provider store={store}>
      <SocketConnection>
        <App key={0}/>
      </SocketConnection>
    </Provider>
);
ReactDOM.render(<Root />, document.getElementById('root'));

//serviceWorker.unregister();
