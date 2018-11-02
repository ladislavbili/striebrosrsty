import React, {Component} from 'react';
import {rebase} from '../index';
import { Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from "react-redux";
import RichTextEditor from "react-rte";
import Collection from './collection';

class Gallery extends Component {
  constructor(props){
    super(props);
    this.state={
      collections:null,
      collectionsLoaded:false,
      showingCollection:false,
      showingCollectionData:null,

      addingCategory:false,
      catName:'',
      catNewUrl:'',
      catURLs:[],
      catOrder:0,
      catMainImage:null,
      catDescription: RichTextEditor.createValueFromString( "","html"),
    }
    this.refetch.bind(this);

  }
  componentWillMount(){
    this.refetch();
  }

  refetch(){
    rebase.get('/image-collections', {
      withIds: true,
      context: this,
    }).then(collections=>{this.setState({collections:collections.sort((item1,item2)=>item1.order < item2.order?1:-1),collectionsLoaded:true})}).catch(()=>this.setState({collectionsLoaded:true}));
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
                  onClick={()=>this.setState({addingCategory:true,
                    catNewUrl:'',
                    catName:'',
                    catURLs:[],
                    catMainImage:null,
                    catOrder:this.state.collections===null?0:this.state.collections[0].order+1,
                    catDescription: RichTextEditor.createValueFromString( "","html")
                  })} />
            </span>
            }
            </CardHeader>
            <CardBody>
            {this.state.collectionsLoaded &&
              <div style={{width:'100%'}} className="row">
                {
                  this.state.collections.map((category)=>
                  <Card key={category.id} body style={{maxWidth:400,marginRight:5, cursor:'pointer'}} onClick={()=>this.setState({showingCollection:true,showingCollectionData:category})}>
                    <CardHeader>
                      <span style={{cursor:'pointer'}}>
                      {category.title}
                    </span>
                    </CardHeader>
                    <CardBody>
                      <div className="gallery-cat-image-container">
                        <img className="gallery-cat-image" src={category.mainImage} alt={category.title} />
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>}
            {(!this.state.collectionsLoaded)&&<div> Loading...</div>}
          </CardBody>
          </Card>
          <Modal isOpen={this.state.addingCategory} toggle={()=>this.setState({addingCategory:!this.state.addingCategory})}>
            <ModalHeader toggle={()=>this.setState({addingCategory:!this.state.addingCategory})}>Pridanie kategórie</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="catname">Názov kolekcie</Label>
                <Input name="catname" id="catname" value={this.state.catName} onChange={(e)=>{this.setState({catName:e.target.value})}} placeholder="Názov kategórie" />
              </FormGroup>
              <FormGroup>
                <Label for="catorder">Poradie kolekcie (ktorá sa zobrazí skôr, nepotrebné meniť)</Label>
                <Input name="catorder" type="number" id="catorder" value={this.state.catOrder} onChange={(e)=>{this.setState({catOrder:e.target.value})}} placeholder="Názov kategórie" />
              </FormGroup>
              <FormGroup>
                <Label for="catNewUrl">Images</Label>
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
                  <div style={{height:250,width:250}}>
                    <img className="gallery-cat-image" src={this.state.catMainImage} alt='selected category' style={{height:'100%',width:'auto'}} />
                  </div>
                }
              </FormGroup>
              <div style={{marginBottom:10}}>
                <RichTextEditor
                  value={this.state.catDescription}
                  onChange={e => {
                    this.setState({ catDescription: e });
                  }}
                  placeholder="Zadaj info o kontakte"
                  />
              </div>

            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={this.state.catURLs.length===0||this.state.catMainImage===null||this.state.catName===''} onClick={()=>{
                  let body={ title:this.state.catName,mainImage:this.state.catMainImage,description:this.state.catDescription.toString('html'), images:this.state.catURLs, order:this.state.catOrder};
                  rebase.addToCollection('/image-collections',
                body)
                .then(this.refetch.bind(this));
                this.setState({addingCategory:false})
                }} >Pridať</Button>{' '}
              <Button color="secondary" onClick={()=>this.setState({addingCategory:!this.state.addingCategory})}>Zrušiť</Button>
            </ModalFooter>
          </Modal>
          {this.state.showingCollection && <Collection refetch={this.refetch.bind(this)} open={this.state.showingCollection}  onToggle={()=>this.setState({showingCollection:!this.state.showingCollection})} data={this.state.showingCollectionData} />}
        </div>
    )
  }
}


const mapStateToProps = ({ reducer }) => {
  const { language, user } = reducer;
  return { language, user };
};

export default connect(mapStateToProps, { })(Gallery);
