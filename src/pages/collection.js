import React, {Component} from 'react';
import {resizeImage} from '../helperFunctions';
import { connect } from "react-redux";
import firebase from 'firebase';
import {rebase} from '../index';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, FormGroup, Button, Card, CardBody, CardHeader} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import RichTextEditor from "react-rte";

class Collection extends Component {
constructor(props){
  super(props);
  this.state={
    title:this.props.data.title,
    description:'',
    ePath:null,
    eOrder:0,
    editing:false,
  }
  this.deleteImage.bind(this);
  this.setMainImage.bind(this);
}

componentWillReceiveProps(props){
  if(this.props.data.title!==props.data.title ||this.props.data.id!==props.data.id){
    this.setState({title:props.data.title});
  }
}

deleteImage(image){
  if (window.confirm('Si si istý?')) {
    let storageRef = firebase.storage().ref();
    storageRef.child(image.path).delete();
    storageRef.child(image.miniature.path).delete();
    let newImages=[...this.props.data.images];
    let index = newImages.findIndex((item)=>item.path===image.path);
    newImages.splice(index,1);
    if(image.path===this.props.data.mainImage){
      rebase.updateDoc('image-collections/'+this.props.data.id, {mainImage:newImages[0].path,images:newImages});
    }else{
      rebase.updateDoc('image-collections/'+this.props.data.id, {images:newImages});
    }
  }
}

setMainImage(image){
  rebase.updateDoc('image-collections/'+this.props.data.id, {mainImage:image.path});
}

  render(){
    if(this.props.data===null){
      return null;
    }
    return(
      <Modal isOpen={this.props.open} toggle={this.props.onToggle}>
        <ModalHeader toggle={this.props.onToggle}>{this.props.data.title}</ModalHeader>
        <ModalBody>

        {this.props.user!==null && <Card style={{borderWidth:0}}>
            <CardHeader>
              Základné info
            </CardHeader>
            <CardBody style={{border:'1px solid rgba(0,0,0,.125)', borderTopWidth:0}}>
              <FormGroup>
                <Label for="nTitle">Názov kolekcie</Label>
                <Input name="nTitle" id="nTitle" value={this.state.title} onChange={(e)=>{this.setState({title:e.target.value})}} placeholder="Názov kolekcie" />
              </FormGroup>

              <Button color="primary" onClick={()=>rebase.updateDoc('image-collections/'+this.props.data.id, {title:this.state.title})}>Uložiť</Button>
            </CardBody>
          </Card>}

          { this.props.user!==null &&
            <div>
              <Label className="btn btn-success" htmlFor="uploadNew" style={{margin:'10px 0px'}}> <FontAwesomeIcon icon={faPlus}/>Pridať obrázok</Label>
              <Input
                type="file"
                name="uploadNew"
                id="uploadNew"
                style={{display:'none'}}
                multiple={true}
                accept="image/x-png,image/gif,image/jpeg"
                onChange={(e)=>{
                  if(e.target.files.length>0){
                    let files = [...e.target.files];
                    Promise.all(files.map((item)=>resizeImage(item,300,300))).then((images)=>{
                      let newImages = images.map((image,index)=>{
                        let time = (new Date()).getTime();
                        return ({
                          image:files[index],
                          miniature:{...image,path:'col-images/'+time+'-min_'+files[index].name},
                          path:'col-images/'+time+'-'+files[index].name
                        });
                      });
                      let storageRef = firebase.storage().ref();
                      Promise.all(
                        [
                          ...newImages.map((image)=>{
                            return storageRef.child(image.path).put(image.image)
                          }),
                          ...newImages.map((image)=>{
                              return storageRef.child(image.miniature.path).put(image.miniature.image)
                          })
                        ]
                      ).then((resp)=>{
                        Promise.all(
                          [
                            ...newImages.map((image)=>{
                              return storageRef.child(image.path).getDownloadURL()
                            }),
                            ...newImages.map((image)=>{
                                return storageRef.child(image.miniature.path).getDownloadURL()
                            })
                          ]
                        ).then((urls)=>{
                          let finalImages = newImages.map((item,index)=>{
                            return {
                              url:urls[index],
                              path:resp[index].metadata.fullPath,
                              miniature:{
                                url:urls[index + newImages.length ],
                                path:resp[index + newImages.length ].metadata.fullPath,
                              },
                            };
                          })
                          rebase.updateDoc('image-collections/'+this.props.data.id, {images:[...finalImages,...this.props.data.images]})
                        });
                      });
                    })
                  }
                }}
              />
            </div>
          }


          <div  style={{width:'100%',marginLeft:10,marginRight:5}} className="row">
          {
            this.props.data.images.map((image,index)=>
              <Card key={index} style={{maxWidth:310,minWidth:310,marginRight:5,padding:0,...(this.props.user && this.props.data.mainImage===image.path?{border:'solid blue 1px'}:{})}}>
                {
                  this.props.user &&
                  <CardHeader>
                    <Button color="danger" disabled={this.state.mainImage===image.path || this.props.data.images.length<=1} style={{width:'46%'}} onClick={()=>this.deleteImage(image)}>Vymazať</Button>
                    <Button color="primary" style={{width:'46%',marginLeft:'8%'}} onClick={()=>this.setMainImage(image)}>Hlavný</Button>
                  </CardHeader>
                }
                {
                  this.props.user &&
                  <Input className="cat-order-input" type="number" value={this.state.ePath===image.path?this.state.eOrder:(index+1)}
                    onChange={(e)=>this.setState({eOrder:e.target.value})}
                    onFocus={()=>this.setState({ePath:image.path,eOrder:index+1})}
                    onBlur={()=>{
                      let newIndex = this.state.eOrder;
                      let newImages=[...this.props.data.images];
                      if(newIndex==='' || isNaN(parseInt(newIndex))||parseInt(newIndex) < 1){
                        newIndex=0;
                      }
                      else if(parseInt(newIndex) > newImages.length){
                        newIndex=newImages.length-1;
                      }else{
                        newIndex=parseInt(newIndex)-1;
                      }
                      newImages.splice(index,1);
                      newImages.splice(newIndex,0,image);
                      rebase.updateDoc('image-collections/'+this.props.data.id, {images:newImages})
                    }}
                    />
                }
                <CardBody style={{padding:0}}>
                  <div className="gallery-cat-image-container" style={{marginLeft:'auto',marginRight:'auto'}}>
                    <a target="_blank" href={image.url} style={{cursor:'pointer'}} rel="noopener noreferrer">
                      <img className="gallery-cat-image" src={image.miniature.url} alt="" />
                    </a>
                  </div>
                </CardBody>
              </Card>)
          }
        </div>
        <Card style={{borderWidth:0}}>
            <CardHeader>
              {this.props.language==='en'?'Description':'Popisok'}
              {this.props.user!==null &&
                <FontAwesomeIcon className="editButton" icon={faEdit}
                  onClick={()=>this.setState({editing:true,description:RichTextEditor.createValueFromString( this.props.data.description,"html")})} />}
            </CardHeader>
          <CardBody style={{border:'1px solid rgba(0,0,0,.125)', borderTopWidth:0}}>
            {!this.state.editing && <div
              className="card-text"
              dangerouslySetInnerHTML={{
                __html: this.props.data.description
                ? this.props.data.description
                : "<p/>"
              }}
              />}
              {
                this.state.editing &&
                <div>
                  <div style={{marginBottom:10}}>
                    <RichTextEditor
                      value={this.state.description}
                      onChange={e => {
                        this.setState({ description: e });
                      }}
                      placeholder="Zadaj popisok pripadne aj s obrazkami"
                    />
                  </div>
                  <Button color="success" onClick={()=>{
                    rebase.updateDoc('image-collections/'+this.props.data.id, {description:this.state.description.toString("html")});
                    this.setState({editing:false,description:''})
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
              rebase.removeDoc('/image-collections/'+this.props.data.id).then(()=>{
                let storageRef = firebase.storage().ref();
                this.state.images.forEach((image)=>{
                  storageRef.child(image.path).delete();
                  storageRef.child(image.miniature.path).delete();
                })
              });
              this.props.onToggle();
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
