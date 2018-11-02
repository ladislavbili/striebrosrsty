import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from './navigation';
import { Provider } from 'react-redux';
import createStore from './redux/store';

import {BrowserRouter, Route} from 'react-router-dom';
import config from './firebase';
import './style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from 'firebase';
import Rebase from 're-base';

const app = firebase.initializeApp(config);
const db = firebase.firestore(app);
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export let rebase = Rebase.createClass(db);

const store=createStore();
const Root = () => {
  return(
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route path='/' component={Navigation} />
        </div>
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
