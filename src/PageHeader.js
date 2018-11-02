import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

export default class PageHeader extends Component{
  constructor(props){
    super(props);
    this.state={
      loginOpen:false,
      login:'',
      password:''
    }
  }

  render(){
    return(
      <Navbar color="light" light expand="md">
          <NavbarBrand href="/">
            <img className="header-logo" src="./image.png" alt="home"/>
          </NavbarBrand>
          <Nav navbar>
            <NavItem>
              <NavLink href="/pricelist">Cenník</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/gallery">Galéria</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contact">Kontakt</NavLink>
            </NavItem>
          </Nav>
          <Dropdown isOpen={this.state.loginOpen} toggle={()=>this.setState({loginOpen:!this.state.loginOpen})} direction="down" className="loginDropdown ml-auto">
            <DropdownToggle className="loginDropdownToggle">
              <FontAwesomeIcon icon={faCog} />
              <i className=""/>
            </DropdownToggle>
            <DropdownMenu right style={{marginTop:'5px'}}>
              <div style={{padding:10, width:200}}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input name="username" id="username" value={this.state.username} onChange={e=>this.setState({username:e.target.value})} placeholder="Username" />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" value={this.state.password}  onChange={e=>this.setState({password:e.target.value})} name="password" id="password" placeholder="Password" />
              </FormGroup>
              <Button color="primary" style={{width:'100%'}}>Login</Button>
            </div>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
    )
  }
}
