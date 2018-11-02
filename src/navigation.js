import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import PageHeader from './PageHeader';
import Gallery from './pages/gallery';
import Home from './pages/home';
import PriceList from './pages/pricelist';
import Contact from './pages/contact';

export default class Navigation extends Component {
  render(){
    return(
      <div>
      <PageHeader/>
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Home} />
          <Route exact path='/pricelist' component={PriceList} />
          <Route exact path='/gallery' component={Gallery} />
          <Route exact path='/contact' component={Contact} />
        </div>
      </BrowserRouter>
    </div>
    )
  }
}
