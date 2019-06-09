import React, {Component} from 'react';
import { Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from "react-redux";
import RichTextEditor from "react-rte";
import firebase from 'firebase';
import {rebase} from '../index';
import {resizeImage} from '../helperFunctions';
import Collection from './collection';

class Gallery extends Component {
  constructor(props){
    super(props);
    this.state={
      eCollectionID:'',
      eCollectionOrder:'',

      collections:[],
      showingCollection:false,
      showingCollectionID:null,

      openAdd:false,
      nTitle:'',
      nImages:[],
      nMainImage:null,
      addingCollection:false,
      nDescription: RichTextEditor.createValueFromString( "","html"),
    }

  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/image-collections', {
      context: this,
      withIds: true,
      then:data=>{
        this.setState({
          collections:data.sort((item1,item2)=>item1.order - item2.order),
        });
      }
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return(
        <div>
          <Card body>
            <CardHeader>
              <span>
              {this.props.language==='en'?'Gallery':'Galéria'}
            </span>
            {this.props.user!==null &&
              <span>
                <FontAwesomeIcon className="editButton" icon={faPlus}  style={{cursor:'pointer'}}
                  onClick={()=>this.setState(
                    {openAdd:true,
                    nTitle:'',
                    nImages:[],
                    nMainImage:null,
                    nDescription: RichTextEditor.createValueFromString( "","html")
                  })} />
            </span>
            }
            </CardHeader>
            <CardBody>
              <div style={{width:'100%'}} className="row">
                {
                  this.state.collections.map((collection)=>
                  <Card key={collection.id} style={{maxWidth:400,marginRight:5, cursor:'pointer'}}>
                    <CardHeader onClick={()=>this.setState({showingCollection:true,showingCollectionID:collection.id})}>
                      <span style={{cursor:'pointer'}}>
                      {collection.title}
                    </span>
                    </CardHeader>
                    {
                      this.props.user &&
                      <Input className="cat-order-input" type="number" value={this.state.eCollectionID===collection.id?this.state.eCollectionOrder:collection.order}
                        onChange={(e)=>this.setState({eCollectionOrder:e.target.value})}
                        onFocus={()=>this.setState({eCollectionID:collection.id,eCollectionOrder:collection.order})}
                        onBlur={()=>{
                          let newOrder = this.state.eCollectionOrder;
                          if(newOrder==='' || isNaN(parseInt(newOrder))||parseInt(newOrder) < 1){
                            newOrder=1;
                          }
                          else if(parseInt(newOrder) > this.state.collections.length){
                            newOrder=this.state.collections.length;
                          }else{
                            newOrder=parseInt(newOrder);
                          }
                          if(newOrder > collection.order){
                            this.state.collections.filter((item)=>item.order<=newOrder && item.order > collection.order).forEach((item)=>{
                              rebase.updateDoc('/image-collections/'+item.id, {order:item.order-1});
                            })
                          } else if(newOrder < collection.order){
                            this.state.collections.filter((item)=>item.order >= newOrder && item.order < collection.order).forEach((item)=>{
                              rebase.updateDoc('/image-collections/'+item.id, {order:item.order+1});
                            })
                          }else{
                            return;
                          }
                          rebase.updateDoc('/image-collections/'+collection.id, {order:newOrder});
                        }}
                        />
                    }
                    <CardBody onClick={()=>this.setState({showingCollection:true,showingCollectionID:collection.id})}>
                      <div className="gallery-cat-image-container">
                        <img className="gallery-cat-image" src={collection.images.find((item)=>item.path===collection.mainImage).miniature.url} alt={collection.title} />
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
          </CardBody>
          </Card>
          <Modal isOpen={this.state.openAdd}>
            <ModalHeader toggle={()=>this.setState({openAdd:!this.state.openAdd})}>Pridanie kategórie</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="nTitle">Názov kolekcie</Label>
                <Input name="nTitle" id="nTitle" value={this.state.nTitle} onChange={(e)=>{this.setState({nTitle:e.target.value})}} placeholder="Názov kolekcie" />
              </FormGroup>
              <FormGroup>
                <Label for="catNewUrl" className="btn btn-success">Upload images</Label>
                <Input
                  type="file"
                  name="catNewUrl"
                  id="catNewUrl"
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
                        this.setState({
                          nImages:[...this.state.nImages,...newImages],
                          nMainImage:this.state.nMainImage===null?newImages[0].path:this.state.nMainImage
                        });
                      })
                    }
                  }}
                />
              </FormGroup>
              <Label for="catNewUrl">Images</Label>
              <div  style={{width:'100%',marginLeft:10,marginRight:5}} className="row">
                {this.state.nImages.length===0 && <Alert color="danger">No file uploaded yet!</Alert>}
                {
                  this.state.nImages.map((image,index)=>
                  <Card key={image.path} body style={{maxWidth:250,minWidth:250,marginRight:5,padding:0,...(this.state.nMainImage===image.path?{border:'solid blue 1px'}:{})}}>
                    <CardHeader>
                      <Button color="danger"  onClick={()=>{
                          let newImages = this.state.nImages.filter((item)=>item.path!==image.path);
                          this.setState({
                          nImages:newImages,
                          nMainImage:this.state.nMainImage===image.path?(newImages.length>0?newImages[0].path:null):this.state.nMainImage
                        })
                      }}>Vymazať</Button>
                    <Button color="primary" style={{marginLeft:'8%'}} onClick={()=>this.setState({nMainImage:image.path})}>Hlavný</Button>
                    </CardHeader>
                    <Input className="cat-order-input" type="number" value={this.state.ePath===image.path?this.state.eOrder:(index+1)}
                      onChange={(e)=>this.setState({eOrder:e.target.value})}
                      onFocus={()=>this.setState({ePath:image.path,eOrder:index+1})}
                      onBlur={()=>{
                        let newIndex = this.state.eOrder;
                        if(newIndex==='' || isNaN(parseInt(newIndex))||parseInt(newIndex) < 1){
                          newIndex=0;
                        }
                        else if(parseInt(newIndex)>this.state.nImages.length){
                          newIndex=this.state.nImages.length-1;
                        }else{
                          newIndex=parseInt(newIndex)-1;
                        }
                        let newImages=[...this.state.nImages];
                        newImages.splice(index,1);
                        newImages.splice(newIndex,0,image);
                        this.setState({nImages:newImages});
                      }}
                      />
                    <CardBody style={{padding:0}}>
                      <div className="gallery-cat-image-container" style={{marginLeft:'auto',marginRight:'auto', height:150,width:150}}>
                        <img src={image.miniature.dataURL} alt="" className="gallery-cat-image" />
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
              <div style={{marginBottom:10}}>
                <RichTextEditor
                  value={this.state.nDescription}
                  onChange={e => {
                    this.setState({ nDescription: e });
                  }}
                  placeholder="Zadaj info o kontakte"
                  />
              </div>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={this.state.nImages.length===0||this.state.nMainImage===null||this.state.nTitle===''||this.state.addingCollection} onClick={()=>{
                  this.setState({addingCollection:true});
                let storageRef = firebase.storage().ref();
                Promise.all(
                  [
                    ...this.state.nImages.map((image)=>{
                      return storageRef.child(image.path).put(image.image)
                    }),
                    ...this.state.nImages.map((image)=>{
                        return storageRef.child(image.miniature.path).put(image.miniature.image)
                    })
                  ]
                ).then((resp)=>{
                  Promise.all(
                    [
                      ...this.state.nImages.map((image)=>{
                        return storageRef.child(image.path).getDownloadURL()
                      }),
                      ...this.state.nImages.map((image)=>{
                          return storageRef.child(image.miniature.path).getDownloadURL()
                      })
                    ]
                  ).then((urls)=>{
                    let newImages = this.state.nImages.map((item,index)=>{
                      return {
                        url:urls[index],
                        path:resp[index].metadata.fullPath,
                        miniature:{
                          url:urls[index + this.state.nImages.length ],
                          path:resp[index + this.state.nImages.length ].metadata.fullPath,
                        },
                      };
                    })
                    let body={
                      title:this.state.nTitle,
                      mainImage:this.state.nMainImage,
                      description:this.state.nDescription.toString('html'),
                      images:newImages,
                      order:1
                    };
                    this.state.collections.forEach((col)=>{
                      rebase.updateDoc('image-collections/'+col.id, {order:col.order+1});
                    });
                    rebase.addToCollection('/image-collections',body).then((item)=>{
                      this.setState({openAdd:false,addingCollection:false})
                    });
                  });
                });
              }} >{this.state.addingCollection?'Pridávam...':'Pridať'}</Button>{' '}
              <Button color="secondary" onClick={()=>this.setState({openAdd:!this.state.openAdd})}>Zrušiť</Button>
            </ModalFooter>
          </Modal>
          {this.state.showingCollection && <Collection open={this.state.showingCollection}  onToggle={()=>this.setState({showingCollection:!this.state.showingCollection})} data={this.state.collections.find((item)=>item.id===this.state.showingCollectionID)} collections={this.state.collections} />}
        </div>
    )
  }
}


const mapStateToProps = ({ reducer }) => {
  const { language, user } = reducer;
  return { language, user };
};

export default connect(mapStateToProps, { })(Gallery);
