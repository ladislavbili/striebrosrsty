import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";

class Home extends Component {
constructor(props){
  super(props);
  this.state={
    editingWelcomeSK:false,
    editingAboutSK:false,
    editingWelcomeEN:false,
    editingAboutEN:false,
    newWelcomeSK: RichTextEditor.createValueFromString( "","html"),
    newWelcomeEN: RichTextEditor.createValueFromString( "","html"),
    newAboutSK: RichTextEditor.createValueFromString( "","html"),
    newAboutEN: RichTextEditor.createValueFromString( "","html"),
    carouselLoaded:false,
    carouselImages:null
  }
}

  componentWillMount(){
    rebase.get('/texts/main', {
      context: this,
    }).then(content=>{this.props.setContent(content)});
    rebase.get('/carousel-images', {
      context: this,
    }).then(data=>{this.setState({carouselImages:data,carouselLoaded:true})});
  }

  render(){
    if(!this.props.contentLoaded){
      return (<div>Loading...</div>);
    }
    return(
      <Card body>
        <div>
            {(this.props.language==='sk'||this.props.user!==null) && !this.state.editingWelcomeSK &&
              <div>
                <FontAwesomeIcon icon={faEdit}
                  onClick={()=>this.setState({editingWelcomeSK:true,newWelcomeSK:RichTextEditor.createValueFromString( this.props.content.welcomeSK,"html")})} />
              <div dangerouslySetInnerHTML={{
              __html: this.props.content.welcomeSK
              ? this.props.content.welcomeSK
              : "<p/>"}} />
            </div>
            }
            {(this.props.language==='en'||this.props.user!==null) && !this.state.editingWelcomeEN &&
              <div>
                <FontAwesomeIcon icon={faEdit}
                  onClick={()=>this.setState({editingWelcomeEN:true,newWelcomeEN:RichTextEditor.createValueFromString( this.props.content.welcomeEN,"html")})} />
              <div dangerouslySetInnerHTML={{
              __html: this.props.content.welcomeEN
              ? this.props.content.welcomeEN
              : "<p/>"}} />
            </div>
            }
              {
                (this.props.language==='sk'||this.props.user!==null) && this.state.editingWelcomeSK &&
                <div>
                <div style={{marginBottom:10}}>
                <RichTextEditor
                  value={this.state.newWelcomeSK}
                  onChange={e => {
                    this.setState({ newWelcomeSK: e });
                  }}
                  placeholder="Uvitanie na stranke"
                />
            </div>
                <span>
                  <Button color="success" onClick={()=>{
                       rebase.updateDoc('/texts/main', {...this.props.content,welcomeSK:this.state.newWelcomeSK.toString("html")}).then(()=>
                       rebase.get('/texts/main', {
                         context: this,
                       }).then(content=>{this.props.setContent(content)})
                     );
                       this.setState({editingWelcomeSK:false})
                    }}>Uložiť</Button>
                  <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingWelcomeSK:false})}>Zrušiť</Button>
                </span>
            </div>
              }

              


              { (this.props.language==='en'||this.props.user!==null) && this.state.editingWelcomeEN &&
                <div>
                <div style={{marginBottom:10}}>
                <RichTextEditor
                  value={this.state.newWelcomeEN}
                  onChange={e => {
                    this.setState({ newWelcomeEN: e });
                  }}
                  placeholder="Uvitanie na stranke"
                />
            </div>
                <span>
                  <Button color="success" onClick={()=>{
                       rebase.updateDoc('/texts/main', {...this.props.content,welcomeEN:this.state.newWelcomeEN.toString("html")}).then(()=>
                       rebase.get('/texts/main', {
                         context: this,
                       }).then(content=>{this.props.setContent(content)})
                     );
                       this.setState({editingWelcomeEN:false})
                    }}>Uložiť</Button>
                  <Button color="danger" style={{marginLeft:5}} onClick={()=>this.setState({editingWelcomeEN:false})}>Zrušiť</Button>
                </span>
            </div>
              }
          <CardBody>
            {(this.props.language==='sk'||this.props.user!==null) && !this.state.editingAboutSK &&
              <div>
                <FontAwesomeIcon icon={faEdit}
                  onClick={()=>this.setState({editingAboutSK:true,newAboutSK:RichTextEditor.createValueFromString( this.props.content.AboutSK,"html")})} />
              <div dangerouslySetInnerHTML={{
              __html: this.props.content.AboutSK
              ? this.props.content.AboutSK
              : "<p/>"}} />
            </div>
            }
            {(this.props.language==='en'||this.props.user!==null) && !this.state.editingAboutEN &&
              <div>
                <FontAwesomeIcon icon={faEdit}
                  onClick={()=>this.setState({editingAboutEN:true,newAboutEN:RichTextEditor.createValueFromString( this.props.content.AboutEN,"html")})} />
              <div dangerouslySetInnerHTML={{
              __html: this.props.content.AboutEN
              ? this.props.content.AboutEN
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

        </CardBody>
    </div>
  </Card>
  )}
}

const mapStateToProps = ({ reducer }) => {
  const { content, contentLoaded, language, user } = reducer;
  return { content, contentLoaded, language, user };
};

export default connect(mapStateToProps, { setContent })(Home);
