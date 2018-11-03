import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import {setUser, setLanguage} from './redux/actions';
import { connect } from "react-redux";


class PageHeader extends Component{
  constructor(props){
    super(props);
    let lastLoc=0;
    if(window.location.href.includes('/pricelist')){
      lastLoc=1;
    }else if(window.location.href.includes('/gallery')){
      lastLoc=2;
    }else if(window.location.href.includes('/contact')){
      lastLoc=3;
    }else if(window.location.href.includes('/faq')){
      lastLoc=4;
    }else if(window.location.href.includes('/tos')){
      lastLoc=5;
    }

    this.state={
      loginOpen:false,
      login:'',
      password:'',
      error:false,
      lastLoc,
      choosingLanguage:false,
    }
  }

  render(){
    return(
      <Navbar color="light" light expand="md">
            <Link className="nav-link" to={{pathname: `/`}} onClick={()=>this.setState({lastLoc:0})}>
              <img className="header-logo" src={this.state.lastLoc===0?"./modre.png":"./cierne.png"} alt="home"/>
            </Link>
          <Nav navbar>
            <NavItem>
              <Link onClick={()=>this.setState({lastLoc:1})} className="nav-link" to={{pathname: `/pricelist`}} style={this.state.lastLoc===1?{color:'#add8e6'}:{}}>
                {this.props.language==='en'?'Price list':'Cenník'}
              </Link>
            </NavItem>
            <NavItem>
              <Link onClick={()=>this.setState({lastLoc:2})} className="nav-link" to={{pathname: `/gallery`}} style={this.state.lastLoc===2?{color:'#add8e6'}:{}}>
                {this.props.language==='en'?'Gallery':'Galéria'}
              </Link>
            </NavItem>
            <NavItem>
              <Link onClick={()=>this.setState({lastLoc:3})} className="nav-link" to={{pathname: `/contact`}} style={this.state.lastLoc===3?{color:'#add8e6'}:{}}>
                {this.props.language==='en'?'Contact':'Kontakt'}
              </Link>
            </NavItem>
            <NavItem>
              <Link onClick={()=>this.setState({lastLoc:4})} className="nav-link" to={{pathname: `/faq`}} style={this.state.lastLoc===4?{color:'#add8e6'}:{}}>
                FAQ
              </Link>
            </NavItem>
            <NavItem>
              <Link onClick={()=>this.setState({lastLoc:5})} className="nav-link" to={{pathname: `/tos`}} style={this.state.lastLoc===5?{color:'#add8e6'}:{}}>
                {this.props.language==='en'?'Term of service':'Podmienky objednávky'}
              </Link>
            </NavItem>
          </Nav>
          <span className="ml-auto row">


            <Dropdown isOpen={this.state.choosingLanguage}  direction="down" toggle={()=>this.setState({choosingLanguage:!this.state.choosingLanguage})} >
              <DropdownToggle caret style={{marginRight:15}}>
                {this.props.language.toUpperCase()}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>Vyberte jazyk/ Select language</DropdownItem>
                <DropdownItem onClick={()=>this.props.setLanguage('sk')}>Slovensky</DropdownItem>
                <DropdownItem onClick={()=>this.props.setLanguage('en')}>Anglicky</DropdownItem>
              </DropdownMenu>
            </Dropdown>


            <Dropdown isOpen={this.state.loginOpen} toggle={()=>this.setState({loginOpen:!this.state.loginOpen})} direction="down" className="loginDropdown">
              <DropdownToggle className="loginDropdownToggle"  style={{marginRight:15}}>
                <FontAwesomeIcon style={{marginTop:5}} icon={faCog} />
              </DropdownToggle>
              <DropdownMenu right style={{marginTop:'5px'}}>
                <div style={{padding:10, width:200}}>
                  {this.props.user=== null && <div>
                <FormGroup>
                  <Label for="email">E-mail</Label>
                  <Input type="email" name="email" id="email" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}} placeholder="email" />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="password" value={this.state.password}  onChange={(e)=>{this.setState({password:e.target.value})}} name="password" id="password" placeholder="Password" />
                </FormGroup>
                {this.state.error && <span style={{fontWeight:'bold', color:'red'}}>Chyba prihásenia</span>}
                <Button color="primary" style={{width:'100%'}} onClick={()=>{
                    this.setState({error:false});
                    firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((res)=>{
                      this.props.setUser(res);
                      console.log(res);
                    }).catch(error=>{this.setState({error:true});console.log('error')});
                  }}>Prihlásiť</Button>
              </div>}
              {this.props.user!==null &&
                <div>
                  <Label style={{width:180, overflowX:'hidden'}}>Prihlásený ako {this.props.user.user.email}</Label>
                <Button color="danger" style={{width:'100%'}} onClick={()=>{
                       firebase.auth().signOut();
                     this.props.setUser(null)}}>
                      Odhlásiť</Button>
                  </div>}
              </div>
              </DropdownMenu>
            </Dropdown>
          </span>
        </Navbar>
    )
  }
}


const mapStateToProps = ({ reducer }) => {
  const { user,language } = reducer;
  return { user,language };
};

export default connect(mapStateToProps, { setUser, setLanguage })(PageHeader);
