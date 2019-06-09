import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import firebase from 'firebase';
import {resizeImage} from '../helperFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button,  Carousel,  CarouselIndicators,  CarouselItem,
  CarouselCaption, CarouselControl, DropdownToggle, FormGroup, Label, Input, DropdownMenu, Dropdown } from 'reactstrap';
import { faEdit,faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class MainCarousel extends Component {

constructor(props){
  super(props);
  this.state={
    nFile:'',
    nPreview:'#',
    nOrder:'',
    nHeader:'',
    nDescription:'',
    adding:false,

    eOrder:'',
    eHeader:'',
    eDescription:'',
    eCurrent:null,

    carouselImages:[],
    carouselCurrent:0,
    addOpen:false,
    editOpen:false,
  }
  this.nextCarouselItem.bind(this);
  this.prevCarouselItem.bind(this);
}

prevCarouselItem(){
  if (this.state.carouselAnimated) return;
  this.setState({ carouselCurrent: this.state.carouselCurrent === 0 ? this.state.carouselImages.length - 1 : this.state.carouselCurrent - 1 });
}

nextCarouselItem(){
  if (this.state.carouselAnimated) return;
    this.setState({ carouselCurrent: this.state.carouselCurrent === this.state.carouselImages.length - 1 ? 0 : this.state.carouselCurrent + 1 });
}

componentWillMount(){
  this.ref = rebase.listenToCollection('/carousel-images', {
    context: this,
    withIds: true,
    then:data=>{
        let storageRef = firebase.storage().ref();
        Promise.all(data.map((item)=>storageRef.child(item.url).getDownloadURL())).then((URLs)=>{
            this.setState({
              carouselImages:data.map((item,index)=>{
                return {...item,url:URLs[index],path:item.url};
              }).sort((item1,item2)=>item1.order - item2.order ),
            });
        });
    },
  });
}

componentWillUnmount(){
  rebase.removeBinding(this.ref);
}

render(){
  return (
    <div style={this.props.width>1150?{width:900,height:400}:{width:this.props.width-100,height:(this.props.width-100)/9*4}} className="row">
      {(this.props.user!==null) &&
      <Dropdown direction="right" isOpen={this.state.addOpen} toggle={()=>this.setState({addOpen:!this.state.addOpen})} className="loginDropdown">
        <DropdownToggle style={{backgroundColor:'inherit',border:'none',color:'#212529'}}>
          <FontAwesomeIcon icon={faPlus}/>
        </DropdownToggle>
        <DropdownMenu style={{marginTop:0}}>
          <div style={{padding:10, width:400}}>
          <FormGroup>
            <Label for="newURL">URL</Label>
            <Input type="file"
              name="newURL"
              id="newURL"
              accept="image/x-png,image/gif,image/jpeg"
              multiple={false}
              onChange={(file)=>{
                if(file.target.files[0]){
                  resizeImage(file.target.files[0],900,650).then(({image,dataURL})=>{
                    this.setState({nFile:image,nPreview:dataURL});
                  });
                }
              }} placeholder="URL nového obrázka" />
            {this.state.nPreview!=='#' &&
              <div className="gallery-cat-image-container" style={{maxWidth:150,height:150}}>
                <img src={this.state.nPreview} alt="" className="gallery-cat-image" />
              </div>
            }
          </FormGroup>

          <FormGroup>
            <Label for="nOrder">Poradie (prazdne = posledné)</Label>
            <Input type="number" name="nOrder" id="nOrder" value={this.state.nOrder} onChange={(e)=>{this.setState({nOrder:e.target.value})}} placeholder="Poradie" />
            {parseInt(this.state.nOrder) < 1 && <Label className="infoText" style={{color:'red'}}>Musí byť väčšie ako 0</Label>}
          </FormGroup>
          {}

          <FormGroup>
            <Label for="nHeader">Nadpis</Label>
            <Input name="nHeader" id="nHeader" value={this.state.nHeader} onChange={(e)=>{this.setState({nHeader:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <FormGroup>
            <Label for="nDescription">Podnadpis</Label>
            <Input name="nDescription" id="nDescription" value={this.state.nDescription} onChange={(e)=>{this.setState({nDescription:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <Button color="primary" disabled={this.state.nPreview!=='#' && this.state.adding} onClick={()=>{
            if(this.state.nPreview!=='#'){
              this.setState({adding:true})
              let storageRef = firebase.storage().ref();
              let path = 'images/'+(new Date()).getTime()+'-'+this.state.nFile.name;
              let fileRef = storageRef.child(path);
              fileRef.put(this.state.nFile).then((response)=>{
                let body={
                  header:this.state.nHeader,
                  description:this.state.nDescription,
                  url:path
                };
                if(this.state.nOrder==='' || isNaN(parseInt(this.state.nOrder))|| parseInt(this.state.nOrder) > this.state.carouselImages.length || parseInt(this.state.nOrder) < 1){
                    body.order = this.state.carouselImages.length+1;
                }else{
                  body.order = parseInt(this.state.nOrder);
                }
                this.state.carouselImages.filter((item)=>item.order>=body.order).forEach((image)=>{
                  rebase.updateDoc('/carousel-images/'+image.id, {order:image.order+1});
                });
                rebase.addToCollection('/carousel-images', body);
                this.setState({nFile:'',nPreview:'#',nOrder:'',nHeader:'',nDescription:'',carouselCurrent:0,adding:false});
              });
            }
          }}>{this.state.adding?'Pridávam..':'Pridať'}</Button>
      </div>
        </DropdownMenu>
      </Dropdown>}

      {(this.props.user!==null) && this.state.carouselImages.length!==0 &&
        <Button style={{backgroundColor:'inherit',border:'none',color:'#212529'}}
          onClick={()=>{
            let image = this.state.carouselImages[this.state.carouselCurrent];
            if (window.confirm('Si si istý?')) {
              let storageRef = firebase.storage().ref();
              storageRef.child(image.path).delete().then(()=>{
                  rebase.removeDoc('/carousel-images/'+image.id);
              });
            }
          }}
        >
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
      }
      {(this.props.user!==null) &&
        <Dropdown direction="right" isOpen={this.state.editOpen} toggle={()=>this.setState({editOpen:!this.state.editOpen})} className="loginDropdown">
          <DropdownToggle style={{backgroundColor:'inherit',border:'none',color:'#212529'}}
            onClick={()=>{
              let current=this.state.carouselImages[this.state.carouselCurrent];
              this.setState({
                eOrder:this.state.carouselCurrent+1,
                eHeader:current.header,
                eDescription:current.description,
                eCurrent:current
              });
            }}
            >
            <FontAwesomeIcon icon={faEdit}/>
          </DropdownToggle>
          <DropdownMenu style={{marginTop:0}}>
            <div style={{padding:10, width:400}}>
            <FormGroup>
              <Label for="eOrder">Poradie (prazdne = posledné)</Label>
              <Input type="number" name="eOrder" id="eOrder" value={this.state.eOrder} onChange={(e)=>{this.setState({eOrder:e.target.value})}} placeholder="Poradie" />
              {parseInt(this.state.eOrder) < 1 && <Label className="infoText" style={{color:'red'}}>Musí byť väčšie ako 0</Label>}
            </FormGroup>

            <FormGroup>
              <Label for="eHeader">Nadpis</Label>
              <Input name="eHeader" id="eHeader" value={this.state.eHeader} onChange={(e)=>{this.setState({eHeader:e.target.value})}} placeholder="Nadpis" />
            </FormGroup>

            <FormGroup>
              <Label for="eDescription">Podnadpis</Label>
              <Input name="eDescription" id="eDescription" value={this.state.eDescription} onChange={(e)=>{this.setState({eDescription:e.target.value})}} placeholder="Nadpis" />
            </FormGroup>

            <Button color="primary" disabled={this.state.editedURL===''} onClick={()=>{
                if(this.state.editedURL!==''){
                  let body={
                    description:this.state.eDescription,
                    header:this.state.eHeader
                  };

                  if(this.state.eOrder==='' || isNaN(parseInt(this.state.eOrder))|| parseInt(this.state.eOrder) > this.state.carouselImages.length || parseInt(this.state.eOrder) < 1){
                      body.order = this.state.carouselImages.length+1;
                  }else{
                    body.order = parseInt(this.state.eOrder);
                  }
                  if(body.order > this.state.eCurrent.order){
                    this.state.carouselImages.filter((item)=>item.order<=body.order && item.order> this.state.eCurrent.order).forEach((image)=>{
                      rebase.updateDoc('/carousel-images/'+image.id, {order:image.order-1});
                    })
                  } else{
                    this.state.carouselImages.filter((item)=>item.order >= body.order && item.order < this.state.eCurrent.order).forEach((image)=>{
                      rebase.updateDoc('/carousel-images/'+image.id, {order:image.order+1});
                    })
                  }

                  rebase.updateDoc('/carousel-images/'+this.state.eCurrent.id, body);
                  this.setState({editOpen:false})
                }
              }}>Uložiť</Button>
            </div>
          </DropdownMenu>
        </Dropdown>}


        <Carousel
          activeIndex={this.state.carouselCurrent}
          next={this.nextCarouselItem.bind(this)}
          previous={this.prevCarouselItem.bind(this)}
        >
          <CarouselIndicators items={this.state.carouselImages.map((item,index)=>({url:item,key:index,id:index}))} activeIndex={this.state.carouselCurrent}
            onClickHandler={(newIndex)=>{
              if (this.state.carouselAnimated) return;
              this.setState({ carouselCurrent: newIndex });
            }}
            />
            { this.state.carouselImages.map((item)=>
              <CarouselItem
                key={item.id}
                onExiting={()=>this.setState({carouselAnimated:true})}
                onExited={()=>this.setState({carouselAnimated:false})}
                >
                <div style={(this.props.width > 1150) ? {width:900,height:400}:{width:this.props.width-100,height:(this.props.width-100)/9*4}}>
                <img src={item.url} alt={item.url} style={{height:'auto',width:'100%'}} />
                </div>
                <CarouselCaption captionText={item.description} captionHeader={item.header} />
              </CarouselItem>
          )}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.prevCarouselItem.bind(this)} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextCarouselItem.bind(this)} />
        </Carousel>

    </div>
    )
  }
}

const mapStateToProps = ({ reducer }) => {
  const { content, user } = reducer;
  return { content, user };
};

export default connect(mapStateToProps, { setContent })(MainCarousel);
