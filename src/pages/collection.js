import React, {Component} from 'react';
import {} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup, Button, Card, CardBody, CardHeader,Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";

class Collection extends Component {
constructor(props){
  super(props);
  this.state={
    images:[...this.props.data.images],
    mainImage:this.props.data.mainImage,
    description:this.props.data.description,
    editing:false,
    newURL:''
  }
  this.deleteImage.bind(this);
  this.setMainImage.bind(this);
}

deleteImage(index){
  if (window.confirm('Si si istý?')) {
    let newImages=[...this.state.images];
    newImages.splice(index,1);
    rebase.updateDoc('/image-collections/'+this.props.data.id, {...this.props.data, images:newImages,mainImage:this.state.mainImage,description:this.state.description}).then(()=>this.props.refetch());
    this.setState({images:[...newImages]});
  } else {
    return;
  }

}

setMainImage(url){
  rebase.updateDoc('/image-collections/'+this.props.data.id, {...this.props.data, mainImage:url,images:this.state.images,description:this.state.description}).then(()=>this.props.refetch());
  this.setState({mainImage:url});
}

  render(){
    if(this.props.data===null){
      return null;
    }
    return(
      <Modal isOpen={this.props.open} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>{this.props.data.title}</ModalHeader>
        <ModalBody>
          {this.props.user!==null &&
          <Dropdown isOpen={this.state.loginOpen} toggle={()=>this.setState({loginOpen:!this.state.loginOpen})} direction="down" className="loginDropdown">
            <DropdownToggle style={{backgroundColor:'inherit',border:'none'}}>
              <Button color="success"> <FontAwesomeIcon icon={faPlus}/>Pridať obrázok</Button>
            </DropdownToggle>
            <DropdownMenu left style={{marginTop:0}}>
              <div style={{padding:10, width:200}}>
              <div>
              <FormGroup>
                <Label for="newURL">URL</Label>
                <Input type="newURL" name="newURL" id="newURL" value={this.state.newURL} onChange={(e)=>{this.setState({newURL:e.target.value})}} placeholder="URL nového obrázka" />
              </FormGroup>
              <Button color="primary" style={{width:'100%'}} onClick={()=>{
                  if(this.state.newURL!==''){
                    rebase.updateDoc('/image-collections/'+this.props.data.id, {...this.props.data, images:[this.state.newURL,...this.state.images],description:this.state.description,mainImage:this.state.mainImage}).then(()=>this.props.refetch());
                    this.setState({images:[this.state.newURL,...this.state.images],newURL:''});
                  }
              }}>Pridať</Button>
            </div>
          </div>
            </DropdownMenu>
          </Dropdown>}


          <div  style={{width:'100%',marginLeft:10,marginRight:5}} className="row">
          {
            [...this.state.images].map((image,index)=>
              <Card key={index} body style={{maxWidth:310,minWidth:310,marginRight:5,padding:0}}>
                {
                  this.props.user &&
                  <CardHeader>
                    <Button color="danger" disabled={this.state.mainImage===image && this.state.images.filter(item=>this.state.mainImage===item).length===1} style={{width:'46%'}} onClick={()=>this.deleteImage(index)}>Vymazať</Button>
                    <Button color="primary" disabled={this.state.mainImage===image} style={{width:'46%',marginLeft:'8%'}} onClick={()=>this.setMainImage(image)}>Hlavný</Button>
                  </CardHeader>
                }
                <CardBody style={{padding:0}}>
                  <div className="gallery-cat-image-container" style={{marginLeft:'auto',marginRight:'auto'}}>
                    <a target="_blank" href={image} style={{cursor:'pointer'}} rel="noopener noreferrer">
                      <img className="gallery-cat-image" src={image} alt={image} />
                    </a>
                  </div>
                </CardBody>
              </Card>)
          }
        </div>
        <Card body style={{borderWidth:0}}>
            <CardHeader>
              {this.props.language==='en'?'Description':'Popisok'}
              {this.props.user!==null &&
                <FontAwesomeIcon className="editButton" icon={faEdit}
                  onClick={()=>this.setState({editing:true,newContent:RichTextEditor.createValueFromString( this.state.description,"html")})} />}
            </CardHeader>
          <CardBody style={{border:'1px solid rgba(0,0,0,.125)', borderTopWidth:0}}>
            {!this.state.editing && <div
              className="card-text"
              dangerouslySetInnerHTML={{
                __html: this.state.description
                ? this.state.description
                : "<p/>"
              }}
              />}
              {this.state.editing &&
                <div>
                <div style={{marginBottom:10}}>
              <RichTextEditor
                value={this.state.newContent}
                onChange={e => {
                  this.setState({ newContent: e });
                }}
                placeholder="Zadaj popisok pripadne aj s obrazkami"
              />
            </div>
            <Button color="success" onClick={()=>{
                 rebase.updateDoc('image-collections/'+this.props.data.id, {...this.props.content,description:this.state.newContent.toString("html"),images:this.state.images,mainImage:this.state.mainImage})
                  .then(this.props.refetch);
                 this.setState({editing:false,description:this.state.newContent.toString("html")})
              }}>Uložiť</Button>
            <Button color="secondary" style={{marginLeft:5}} onClick={()=>{this.setState({editing:false})}}>Zrušiť</Button>
          </div>
              }
          </CardBody>
        </Card>
        </ModalBody>
        <ModalFooter>
          {this.props.user!==null && <Button color="danger" onClick={()=>{
            if (window.confirm('Si si istý?')) {
              rebase.removeDoc('/image-collections/'+this.props.data.id).then(()=>this.props.refetch());
              this.props.onToggle();
            } else {
              return;
            }
            }}>{this.props.language==='en'?'Delete':'Vymazať'}</Button>}
          <Button color="secondary" onClick={this.props.onToggle}>{this.props.language==='en'?'Close':'Zavrieť'}</Button>
        </ModalFooter>
      </Modal>

  )}
}

const mapStateToProps = ({ reducer }) => {
  const {user, language } = reducer;
  return {user, language };
};

export default connect(mapStateToProps, {  })(Collection);
