import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";

class PriceList extends Component {
constructor(props){
  super(props);
  this.state={
    editingSK:false,
    editingEN:false,
    newContentSK: RichTextEditor.createValueFromString( "","html"),
    newContentEN: RichTextEditor.createValueFromString( "","html")
  }
}

  componentWillMount(){
    rebase.get('/texts/main', {
      context: this,
    }).then(content=>{this.props.setContent(content)});
  }

  render(){
    return(
      <Card body>
        {(this.props.language==='sk' ||this.props.user!==null) && <div>
        <CardHeader>
          <span style={{cursor:'pointer'}}>
          Cenník
        </span>
        {
          this.props.user!==null &&
          <FontAwesomeIcon className="editButton" icon={faEdit}
            onClick={()=>this.setState({editingSK:true,newContentSK:RichTextEditor.createValueFromString( this.props.content.pricelistSK,"html")})} />
        }
        </CardHeader>
          <CardBody>
          {!this.state.editingSK && this.props.contentLoaded && <div
            className="card-text"
            dangerouslySetInnerHTML={{
              __html: this.props.content.pricelistSK
              ? this.props.content.pricelistSK
              : "<p/>"
            }}
            />}
          {!this.state.editingSK && !this.props.contentLoaded && <div>Loading...</div>}
          {
            this.state.editingSK &&
            <div>
              <div style={{marginBottom:10}}>
            <RichTextEditor
              value={this.state.newContentSK}
              onChange={e => {
                this.setState({ newContentSK: e });
              }}
              placeholder="Zadaj info o kontakte"
            />
        </div>
          <span>
            <Button color="success" onClick={()=>{
                 rebase.updateDoc('/texts/main', {...this.props.content,pricelistSK:this.state.newContentSK.toString("html")});
                 rebase.get('/texts/main', {
                   context: this,
                 }).then(content=>{this.props.setContent(content)});
                 this.setState({editingSK:false})
              }}>Uložiť</Button>
            <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingSK:false})}>Zrušiť</Button>
            </span>
        </div>
          }
        </CardBody>
        </div>}


        {(this.props.language==='en'||this.props.user!==null) && <div>
        <CardHeader>
          <span style={{cursor:'pointer'}}>
          Price List
          {this.props.user!==null &&
          <FontAwesomeIcon className="editButton" icon={faEdit}
            onClick={()=>this.setState({editingEN:true,newContentEN:RichTextEditor.createValueFromString( this.props.content.pricelistEN,"html")})} />}
      </span>
    </CardHeader>
          <CardBody>
          {!this.state.editingEN && this.props.contentLoaded && <div
            className="card-text"
            dangerouslySetInnerHTML={{
              __html: this.props.content.pricelistEN
              ? this.props.content.pricelistEN
              : "<p/>"
            }}
            />}
          {!this.state.editingEN && !this.props.contentLoaded && <div>Loading...</div>}
          {
            this.state.editingEN &&
            <div>
              <div style={{marginBottom:10}}>
            <RichTextEditor
              value={this.state.newContentEN}
              onChange={e => {
                this.setState({ newContentEN: e });
              }}
              placeholder="Zadaj info o kontakte"
            />
        </div>
          <span>
            <Button color="success" onClick={()=>{
                 rebase.updateDoc('/texts/main', {...this.props.content,pricelistEN:this.state.newContentEN.toString("html")});
                 rebase.get('/texts/main', {
                   context: this,
                 }).then(content=>{this.props.setContent(content)});
                 this.setState({editingEN:false})
              }}>Uložiť</Button>
            <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingEN:false})}>Zrušiť</Button>
            </span>
        </div>
          }
        </CardBody>
      </div>}
      </Card>

  )}
}

const mapStateToProps = ({ reducer }) => {
  const { content, contentLoaded, language, user } = reducer;
  return { content, contentLoaded, language, user };
};

export default connect(mapStateToProps, { setContent })(PriceList);
