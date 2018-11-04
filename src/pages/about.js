import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";

class About extends Component {

constructor(props){
  super(props);
  this.state={
    editingAboutSK:false,
    editingAboutEN:false,
    newAboutSK: RichTextEditor.createValueFromString( "","html"),
    newAboutEN: RichTextEditor.createValueFromString( "","html"),
  }
}

render(){
  return(
    <div className={this.props.width>1150?"aboutContainer":''}>
      {(this.props.language==='sk'||this.props.user!==null) && !this.state.editingAboutSK &&
        <div>
          {
            this.props.user!==null &&
            <FontAwesomeIcon icon={faEdit}
              onClick={()=>this.setState({editingAboutSK:true,newAboutSK:RichTextEditor.createValueFromString( this.props.content.aboutSK,"html")})} />}
              <div dangerouslySetInnerHTML={{
                  __html: this.props.content.aboutSK
                  ? this.props.content.aboutSK
                  : "<p/>"}} />
              </div>
            }
    {(this.props.language==='en'||this.props.user!==null) && !this.state.editingAboutEN &&
      <div>
      {
        this.props.user!==null &&
        <FontAwesomeIcon icon={faEdit}
          onClick={()=>this.setState({editingAboutEN:true,newAboutEN:RichTextEditor.createValueFromString( this.props.content.aboutEN,"html")})} />}
          <div dangerouslySetInnerHTML={{
              __html: this.props.content.aboutEN
              ? this.props.content.aboutEN
              : "<p/>"}} />
          </div>
        }
        {
        (this.props.language==='sk'||this.props.user!==null) && this.state.editingAboutSK &&
        <div>
          <div style={{marginBottom:10}}>
            <RichTextEditor
              value={this.state.newAboutSK}
              onChange={e => {
                this.setState({ newAboutSK: e });
              }}
              placeholder="Uvitanie na stranke"
              />
          </div>
          <span>
            <Button color="success" onClick={()=>{
                rebase.updateDoc('/texts/main', {...this.props.content,aboutSK:this.state.newAboutSK.toString("html")}).then(()=>
                rebase.get('/texts/main', {
                  context: this,
                }).then(content=>{this.props.setContent(content)})
              );
              this.setState({editingAboutSK:false})
            }}>Uložiť</Button>
            <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingAboutSK:false})}>Zrušiť</Button>
          </span>
        </div>
      }
      {
        (this.props.language==='en'||this.props.user!==null) && this.state.editingAboutEN &&
        <div>
          <div style={{marginBottom:10}}>
            <RichTextEditor
              value={this.state.newAboutEN}
              onChange={e => {
                this.setState({ newAboutEN: e });
              }}
              placeholder="Uvitanie na stranke"
              />
          </div>
          <span>
            <Button color="success" onClick={()=>{
                rebase.updateDoc('/texts/main', {...this.props.content,aboutEN:this.state.newAboutEN.toString("html")}).then(()=>
                rebase.get('/texts/main', {
                  context: this,
                }).then(content=>{this.props.setContent(content)})
              );
              this.setState({editingAboutEN:false})
            }}>Uložiť</Button>
            <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingAboutEN:false})}>Zrušiť</Button>
          </span>
        </div>
      }
    </div>

    )
  }
}


const mapStateToProps = ({ reducer }) => {
  const { content, contentLoaded, language, user } = reducer;
  return { content, contentLoaded, language, user };
};

export default connect(mapStateToProps, { setContent })(About);
