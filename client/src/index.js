import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import store from './store/';
import App from './containers/App/';
//import * as serviceWorker from './serviceWorker';
export const Root = () => (
    <Provider store={store}>
      <App/>
    </Provider>
);
ReactDOM.render(<Root />, document.getElementById('root'));

//serviceWorker.unregister();
