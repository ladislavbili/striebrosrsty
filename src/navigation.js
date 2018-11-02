import React, {Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import PageHeader from './PageHeader';
import Gallery from './pages/gallery';
import Home from './pages/home';
import PriceList from './pages/pricelist';
import Contact from './pages/contact';
import FAQ from './pages/faq';
import TermOfService from './pages/tos';

export default class Navigation extends Component {
  render(){
    return(
      <div>
        <BrowserRouter>
          <div>
            <PageHeader/>
            <div style={{padding:15}}>
              <Route exact path='/' component={Home} />
              <Route exact path='/pricelist' component={PriceList} />
              <Route exact path='/gallery' component={Gallery} />
              <Route exact path='/contact' component={Contact} />
              <Route exact path='/faq' component={FAQ} />
              <Route exact path='/tos' component={TermOfService} />
            </div>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}
