import React, {Component} from 'react';
import {rebase} from '../index';
import { Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from "react-redux";
import RichTextEditor from "react-rte";


class Gallery extends Component {
  constructor(props){
    super(props);
    this.state={
      images:null,
      imagesLoaded:false,
      collections:null,
      collectionsLoaded:false,
      editing:false,

      addingCategory:false,
      catNewUrl:'',
      catURLs:['https://pbs.twimg.com/media/DEkxiRCXsAALRoF.jpg','https://upload.wikimedia.org/wikipedia/commons/f/fb/Anthro_vixen_colored.jpg'],
      catMainImage:null,
    }

  }
  componentWillMount(){
    rebase.get('/images', {
      context: this,
      withIds: true,
    }).then(images=>{this.setState({images,imagesLoaded:true})});

    rebase.get('/image-collections', {
      withIds: true,
      context: this,
    }).then(collections=>{this.setState({collections,collectionsLoaded:true})});
  }

  render(){
    return(
        <div>
          <Card body>
            <CardHeader>
              <span style={{cursor:'pointer'}}>
              Cenník
            </span>
            {
              (this.props.user!==null||true) &&
              <span>
                <FontAwesomeIcon className="editButton" icon={faEdit} style={{marginLeft:15}}
                  onClick={()=>this.setState({editing:true})} />
                <FontAwesomeIcon className="editButton" icon={faPlus}  style={{cursor:'pointer'}}
                  onClick={()=>this.setState({addingCategory:true})} />
            </span>
            }
            </CardHeader>
            <CardBody>
            {this.state.imagesLoaded && this.state.collectionsLoaded &&
              <div>
                {
                  this.state.collections.map((category)=>
                  <span key={category.id} className="gallery-cat-image-container">
                    <img className="gallery-cat-image" src={category.mainImage} alt={category.title} style={{height:250,width:250}} />
                  </span>)
                }
              </div>}
            {(!this.state.imagesLoaded||!this.state.collectionsLoaded)&&<div> Loading...</div>}
          </CardBody>
          </Card>
          <Modal isOpen={this.state.addingCategory} toggle={()=>this.setState({addingCategory:!this.state.addingCategory})}>
            <ModalHeader toggle={()=>this.setState({addingCategory:!this.state.addingCategory})}>Pridanie kategórie</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="catname">Category name</Label>
                <Input name="catname" id="catname" value={this.state.catName} onChange={(e)=>{this.setState({catName:e.target.value})}} placeholder="Názov kategórie" />
              </FormGroup>
              <FormGroup>
                <Label for="catNewUrl">Category name</Label>
                <span style={{display:'flex'}}>
                  <Input name="catNewUrl" id="catNewUrl" value={this.state.catNewUrl} onChange={(e)=>{this.setState({catNewUrl:e.target.value})}} placeholder="Link na ďaľší obrázok" />
                  <span style={{marginTop:'auto',marginBottom:'auto',marginLeft:5}}>
                  <FontAwesomeIcon className="addNewURL" icon={faPlus} style={{cursor:'pointer'}}
                    onClick={()=>{
                      if(this.state.catNewUrl!==''){
                        this.setState({catNewUrl:'',catURLs:[...this.state.catURLs,this.state.catNewUrl],catMainImage:this.state.catMainImage===null?this.state.catNewUrl:this.state.catMainImage})
                      }
                    }} />
                </span>
                </span>
              </FormGroup>
              <FormGroup>
                <Label for="selectCategoryImage">Category image</Label>
                <Input type="select" name="select" id="selectCategoryImage"
                  value={this.state.catMainImage===null?undefined:this.state.catMainImage} onChange={(e)=>this.setState({catMainImage:e.target.value})}>
                  {
                    this.state.catURLs.map((category,index)=>
                      <option key={index}>{category}</option>
                  )}
                </Input>
                {this.state.catMainImage!==null &&
                    <img className="gallery-cat-image" src={this.state.catMainImage} alt='selected category' style={{height:250,width:250}} />
                }
              </FormGroup>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" >Pridať</Button>{' '}
              <Button color="secondary" onClick={()=>this.setState({addingCategory:!this.state.addingCategory})}>Zrušiť</Button>
            </ModalFooter>
          </Modal>

        </div>
    )
  }
}


const mapStateToProps = ({ reducer }) => {
  const { language, user } = reducer;
  return { language, user };
};

export default connect(mapStateToProps, { })(Gallery);
