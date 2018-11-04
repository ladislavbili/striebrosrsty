import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { Card, CardHeader,CardTitle, CardText, CardBody, Button, FormGroup, Label, Input,
  Modal,  ModalHeader,  ModalBody,  ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {timestampToString} from '../helperFunctions';
import { faEdit,faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";
import Carousel from './carousel';
import About from './about';

class Home extends Component {

constructor(props){
  super(props);
  this.state={
    editingWelcomeSK:false,
    editingWelcomeEN:false,
    newWelcomeSK: RichTextEditor.createValueFromString( "","html"),
    newWelcomeEN: RichTextEditor.createValueFromString( "","html"),

    editingNewsHeader:false,
    newsHeader:RichTextEditor.createValueFromString( "","html"),

    addingNews:false,
    newNews: RichTextEditor.createValueFromString( "","html"),
    newNewsHeader:'',
    news:null,
    newsLoaded:false,

    editingExistingNews:false,
    editedNewsID:null,
    editedNewsHeader:'',
    editedNewsText:RichTextEditor.createValueFromString( "","html"),
    windowWidth:window.innerWidth,
  }
  this.resize.bind(this);
  window.addEventListener("resize", this.resize.bind(this));
}

  resize(){
    this.setState({windowWidth:window.innerWidth});
  }

  componentWillUnmount(){
    window.removeEventListener("resize",this.resize.bind(this));
  };

  componentWillMount(){
    rebase.get('/texts/main', {
      context: this,
    }).then(content=>{this.props.setContent(content)});

    rebase.get('/news', {
      context: this,
      withIds: true,
      query: ref => ref.orderBy('date','desc')
    }).then(data=>{this.setState({news:data,newsLoaded:true})});
  }

  render(){
    if(!this.props.contentLoaded){
      return (<div>Loading...</div>);
    }
    return(
      <div>
      <Card body>
        <div>
            {(this.props.language==='sk'||this.props.user!==null) && !this.state.editingWelcomeSK &&
              <div>
                {
                  this.props.user!==null &&
                  <FontAwesomeIcon icon={faEdit}
                    onClick={()=>this.setState({editingWelcomeSK:true,newWelcomeSK:RichTextEditor.createValueFromString( this.props.content.welcomeSK,"html")})} />
                }
              <div dangerouslySetInnerHTML={{
              __html: this.props.content.welcomeSK
              ? this.props.content.welcomeSK
              : "<p/>"}} />
            </div>
            }
            {(this.props.language==='en'||this.props.user!==null) && !this.state.editingWelcomeEN &&
              <div>
                {
                  this.props.user!==null &&
                <FontAwesomeIcon icon={faEdit}
                  onClick={()=>this.setState({editingWelcomeEN:true,newWelcomeEN:RichTextEditor.createValueFromString( this.props.content.welcomeEN,"html")})} />}
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
              <div>
                {
                  this.state.windowWidth>1150 &&<div className="row">
                  <About width={this.state.windowWidth} />
                  <Carousel width={this.state.windowWidth} />
                </div> }
                {
                  this.state.windowWidth < 1150 &&<div>
                  <Carousel width={this.state.windowWidth} />
                  <About width={this.state.windowWidth} />
                </div> }


            </div>
          <CardBody>
            <Card body style={{borderWidth:0}}>
                <CardHeader>
                  {this.props.user!==null &&
                    <FontAwesomeIcon className="editButton" icon={faEdit} style={{marginLeft:10}}
                      onClick={()=>this.setState({editingNewsHeader:true,newsHeader:RichTextEditor.createValueFromString( this.props.content.newsHeader,"html")})} />}
                  {this.props.user!==null &&
                    <FontAwesomeIcon className="editButton" icon={faPlus}
                      onClick={()=>this.setState({addingNews:true,editingExistingNews:false,newNews:RichTextEditor.createValueFromString( '',"html"),newNewsHeader:''})} />}
                  {!this.state.editingNewsHeader && <div dangerouslySetInnerHTML={{
                  __html: this.props.content.newsHeader
                  ? this.props.content.newsHeader
                  : "<p/>"}} />}
                  {
                    this.state.editingNewsHeader &&
                    <div style={{marginTop:25}}>
                    <div style={{marginBottom:10}}>
                    <RichTextEditor
                      value={this.state.newsHeader}
                      onChange={e => {
                        this.setState({ newsHeader: e });
                      }}
                      placeholder="Zadaj hlavičku noviniek"
                    />
                </div>
                <span>
                  <Button color="success" onClick={()=>{
                       rebase.updateDoc('/texts/main', {...this.props.content,newsHeader:this.state.newsHeader.toString("html")}).then(()=>
                       rebase.get('/texts/main', {
                         context: this,
                       }).then(content=>{this.props.setContent(content)})
                     );
                       this.setState({editingNewsHeader:false})
                    }}>Uložiť</Button>
                  <Button color="secondary" style={{marginLeft:5}} onClick={()=>this.setState({editingNewsHeader:false})}>Zrušiť</Button>
                </span>
              </div>
                  }

                </CardHeader>
              <CardBody style={{border:'1px solid rgba(0,0,0,.125)', borderTopWidth:0}}>
                <div>
                {
                  this.state.newsLoaded && this.state.news.map((novinka)=>
                  <Card style={{marginTop:15}} body>
                    <CardTitle style={{fontWeight:'normal'}}>
                      {this.props.user!==null &&
                        <FontAwesomeIcon icon={faEdit} style={{marginLeft:10}}
                          onClick={()=>this.setState({
                            addingNews:false,
                            editingExistingNews:true,
                            editedNewsID:novinka.id,
                            editedNewsDate:novinka.date,
                            editedNewsHeader:novinka.header,
                            editedNewsText:RichTextEditor.createValueFromString( novinka.text ,"html")
                          })}
                          />}
                      {this.props.user!==null &&
                        <FontAwesomeIcon icon={faTrashAlt} style={{marginLeft:10,marginRight:10}}
                          onClick={()=>{
                            if (window.confirm('Si si istý?')) {
                              rebase.removeDoc('/news/'+novinka.id).then(()=>{
                                rebase.get('/news', {
                                  context: this,
                                  withIds: true,
                                  query: ref => ref.orderBy('date','desc')
                                }).then(data=>{this.setState({news:data})});
                              });
                            } else {
                              return;
                            }
                          }}
                          />}
                      {novinka.header} <span className="infoText ml-auto"> - {timestampToString(novinka.date)}</span></CardTitle>
                    <CardText>
                      <div dangerouslySetInnerHTML={{
                          __html: novinka.text
                          ? novinka.text
                          : "<p/>"}} />
                    </CardText>
                  </Card>
                  )
            }
            </div>
            </CardBody>
            </Card>
        </CardBody>
    </div>
  </Card>

  <Modal isOpen={this.state.addingNews} toggle={()=>this.setState({addingNews:!this.state.addingNews})}>
    <ModalHeader toggle={()=>this.setState({addingNews:!this.state.addingNews})}>Pridanie novinky</ModalHeader>
    <ModalBody>
      <FormGroup>
        <Label for="newNewsHeader">Nadpis</Label>
        <Input name="newNewsHeader" id="newNewsHeader" value={this.state.newNewsHeader} onChange={(e)=>{this.setState({newNewsHeader:e.target.value})}} placeholder="Nadpis novinky" />
      </FormGroup>
      <div style={{marginBottom:10}}>
        <RichTextEditor
          value={this.state.newNews}
          onChange={e => {
            this.setState({ newNews: e });
          }}
          placeholder="Zadaj text novinky"
        />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="success" onClick={()=>{
        rebase.addToCollection('/news',{date:(new Date()).getTime(),header:this.state.newNewsHeader,text:this.state.newNews.toString('html')}).then(()=>
          rebase.get('/news', {
            context: this,
            withIds: true,
            query: ref => ref.orderBy('date','desc')
          }).then(data=>{this.setState({news:data})})
         );
         this.setState({addingNews:false})
        }}>Uložiť</Button>
      <Button color="secondary" style={{marginLeft:5}} onClick={()=>this.setState({addingNews:false})}>Zrušiť</Button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={this.state.editingExistingNews} toggle={()=>this.setState({editingExistingNews:!this.state.editingExistingNews})}>
    <ModalHeader toggle={()=>this.setState({editingExistingNews:!this.state.editingExistingNews})}>Editovanie novinky <span className="infoText ml-auto"> - {timestampToString(this.state.editedNewsDate)}</span></ModalHeader>
    <ModalBody>
      <FormGroup>
        <Label for="editedNewsHeader">Nadpis</Label>
        <Input name="editedNewsHeader" id="editedNewsHeader" value={this.state.editedNewsHeader} onChange={(e)=>{this.setState({editedNewsHeader:e.target.value})}} placeholder="Nadpis novinky" />
      </FormGroup>
      <div style={{marginBottom:10}}>
        <RichTextEditor
          value={this.state.editedNewsText}
          onChange={e => {
            this.setState({ editedNewsText: e });
          }}
          placeholder="Zadaj text novinky"
        />
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="success" onClick={()=>{
        rebase.updateDoc('/news/'+this.state.editedNewsID,{
          date:this.state.getNewDate?(new Date()).getTime():this.state.editedNewsDate,
          header:this.state.editedNewsHeader,
          text:this.state.editedNewsText.toString('html')
        }).then(()=>
          rebase.get('/news', {
            context: this,
            withIds: true,
            query: ref => ref.orderBy('date','desc')
          }).then(data=>{this.setState({news:data})})
         );
         this.setState({editingExistingNews:false})
       }}>Uložiť</Button>
      <Button color="secondary" style={{marginLeft:5}} onClick={()=>this.setState({editingExistingNews:false})}>Zrušiť</Button>
    </ModalFooter>
  </Modal>
</div>
  )}
}

const mapStateToProps = ({ reducer }) => {
  const { content, contentLoaded, language, user } = reducer;
  return { content, contentLoaded, language, user };
};

export default connect(mapStateToProps, { setContent })(Home);
