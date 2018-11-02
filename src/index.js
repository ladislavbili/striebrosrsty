import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from './navigation';

import {BrowserRouter, Route} from 'react-router-dom';

import './style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const Root = () => {
  return(
    <div>
      <BrowserRouter>
        <div>
          <Route path='/' component={Navigation} />
        </div>
      </BrowserRouter>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));
