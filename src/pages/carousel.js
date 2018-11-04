import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button,  Carousel,  CarouselIndicators,  CarouselItem,
  CarouselCaption, CarouselControl, DropdownToggle, FormGroup, Label, Input, DropdownMenu, Dropdown } from 'reactstrap';
import { faEdit,faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class MainCarousel extends Component {

constructor(props){
  super(props);
  this.state={
    newURL:'',
    newURLorder:'',
    newURLheader:'',
    newURLdescription:'',

    editedURL:'',
    editedURLorder:'',
    editedURLheader:'',
    editedURLdescription:'',

    carouselLoaded:false,
    carouselImages:null,
    carouselCurrent:0,
    editCarouselOpen:false,
    addCarouselOpen:false,
    editedCarousel:null,
  }
  this.nextCarouselItem.bind(this);
  this.prevCarouselItem.bind(this);
  this.refetch.bind(this);
}

refetch(){
  rebase.get('/carousel-images/images', {
    context: this,
  }).then(data=>{this.setState({carouselImages:data.images})});
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
  rebase.get('/carousel-images/images', {
    context: this,
  }).then(data=>{this.setState({carouselImages:data.images,carouselLoaded:true})});
}


render(){
  return (
    <div style={this.props.width>1150?{width:900,height:400}:{width:this.props.width-100,height:(this.props.width-100)/9*4}} className="row">
      {(this.props.user!==null) &&this.state.carouselLoaded &&
      <Dropdown isOpen={this.state.addCarouselOpen} toggle={()=>this.setState({addCarouselOpen:!this.state.addCarouselOpen})} direction="down" className="loginDropdown">
        <DropdownToggle style={{backgroundColor:'inherit',border:'none',color:'#212529'}}>
          <FontAwesomeIcon icon={faPlus}/>
        </DropdownToggle>
        <DropdownMenu left style={{marginTop:0}}>
          <div style={{padding:10, width:400}}>
          <FormGroup>
            <Label for="newURL">URL</Label>
            <Input name="newURL" id="newURL" value={this.state.newURL} onChange={(e)=>{this.setState({newURL:e.target.value})}} placeholder="URL nového obrázka" />
          </FormGroup>

          <FormGroup>
            <Label for="newURLorder">Poradie (prazdne = posledné)</Label>
            <Input type="number" name="newURLorder" id="newURLorder" value={this.state.newURLorder} onChange={(e)=>{this.setState({newURLorder:e.target.value})}} placeholder="Poradie" />
            {parseInt(this.state.newURLorder) < 1 && <Label className="infoText" style={{color:'red'}}>Musí byť väčšie ako 0</Label>}
          </FormGroup>
          {}

          <FormGroup>
            <Label for="newURLheader">Nadpis</Label>
            <Input name="newURLheader" id="newURLheader" value={this.state.newURLheader} onChange={(e)=>{this.setState({newURLheader:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <FormGroup>
            <Label for="newURLdescription">Podnadpis</Label>
            <Input name="newURLdescription" id="newURLdescription" value={this.state.newURLdescription} onChange={(e)=>{this.setState({newURLdescription:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <Button color="primary" disabled={this.state.newURL===''} onClick={()=>{
              if(this.state.newURL!==''){
                let newOne={description:this.state.newURLdescription,header:this.state.newURLheader,url:this.state.newURL};
                let newCarouselImages=[...this.state.carouselImages];
                let order = this.state.newURLorder;
                let setIndex=0;
                if(order==='' || isNaN(parseInt(order))|| parseInt(order)>this.state.carouselImages.length || parseInt(order) < 1){
                  newCarouselImages.push(newOne);
                }else{
                  newCarouselImages.splice(parseInt(order) -1 , 0, newOne);
                  setIndex=parseInt(order) -1;
                }
                rebase.updateDoc('/carousel-images/images', {images:newCarouselImages}).then(()=>{
                  this.refetch();
                });
                this.setState({newURL:'',newURLorder:'',newURLheader:'',newURLdescription:'',carouselCurrent:setIndex});
              }
            }}>Pridať</Button>
      </div>
        </DropdownMenu>
      </Dropdown>}

      {(this.props.user!==null) &&this.state.carouselLoaded && this.state.carouselImages.length!==0 &&
        <Button style={{backgroundColor:'inherit',border:'none',color:'#212529'}}
          onClick={()=>{
            let index = this.state.carouselCurrent;
            if (window.confirm('Si si istý?')) {
              let newImages=[...this.state.carouselImages];
              newImages.splice(index,1);
              rebase.updateDoc('/carousel-images/images', {images:newImages}).then(()=>this.refetch());
              this.setState({images:[...newImages], carouselCurrent:0});
            } else {
              return;
            }
          }}
          >
        <FontAwesomeIcon icon={faTrashAlt} />
      </Button>
      }
      {(this.props.user!==null) && this.state.carouselLoaded &&
        <Dropdown isOpen={this.state.editCarouselOpen} toggle={()=>this.setState({editCarouselOpen:!this.state.editCarouselOpen, editedCarousel:null})} direction="down" className="loginDropdown">
        <DropdownToggle style={{backgroundColor:'inherit',border:'none',color:'#212529'}}
          onClick={()=>{
            let current=this.state.carouselImages[this.state.carouselCurrent];
            this.setState({
              editedCarousel:this.state.carouselCurrent,
              editedURL:current.url,
              editedURLorder:this.state.carouselCurrent+1,
              editedURLheader:current.header,
              editedURLdescription:current.description,
            });
          }}
          >
          <FontAwesomeIcon icon={faEdit}/>
        </DropdownToggle>
        <DropdownMenu left style={{marginTop:0}}>
          <div style={{padding:10, width:400}}>
          <FormGroup>
            <Label for="editedURL">URL</Label>
            <Input name="editedURL" id="editedURL" value={this.state.editedURL} onChange={(e)=>{this.setState({editedURL:e.target.value})}} placeholder="URL nového obrázka" />
          </FormGroup>

          <FormGroup>
            <Label for="editedURLorder">Poradie (prazdne = posledné)</Label>
            <Input type="number" name="editedURLorder" id="editedURLorder" value={this.state.editedURLorder} onChange={(e)=>{this.setState({editedURLorder:e.target.value})}} placeholder="Poradie" />
            {parseInt(this.state.editedURLorder) < 1 && <Label className="infoText" style={{color:'red'}}>Musí byť väčšie ako 0</Label>}
          </FormGroup>

          <FormGroup>
            <Label for="editedURLheader">Nadpis</Label>
            <Input name="editedURLheader" id="editedURLheader" value={this.state.editedURLheader} onChange={(e)=>{this.setState({editedURLheader:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <FormGroup>
            <Label for="editedURLdescription">Podnadpis</Label>
            <Input name="editedURLdescription" id="editedURLdescription" value={this.state.editedURLdescription} onChange={(e)=>{this.setState({editedURLdescription:e.target.value})}} placeholder="Nadpis" />
          </FormGroup>

          <Button color="primary" disabled={this.state.editedURL===''} onClick={()=>{
              if(this.state.editedURL!==''){
                let editedOne={description:this.state.editedURLdescription,header:this.state.editedURLheader,url:this.state.editedURL};
                let editedCarouselImages=[...this.state.carouselImages];
                let order = this.state.editedURLorder;
                let setIndex=0;
                editedCarouselImages.splice(this.state.carouselCurrent,1);
                if(order==='' || isNaN(parseInt(order))|| parseInt(order)>this.state.carouselImages.length || parseInt(order) < 1){
                  editedCarouselImages.push(editedOne);
                }else{
                  editedCarouselImages.splice(parseInt(order) -1 , 0, editedOne);
                  setIndex=parseInt(order) -1;
                }
                rebase.updateDoc('/carousel-images/images', {images:editedCarouselImages}).then(()=>{
                  this.refetch();
                });
                this.setState({editedURL:'',editedURLorder:'',editedURLheader:'',editedURLdescription:'',carouselCurrent:setIndex});
              }
            }}>Uložiť</Button>
      </div>
        </DropdownMenu>
      </Dropdown>}

      {this.state.carouselLoaded && <Carousel
        activeIndex={this.state.carouselCurrent}
        next={this.nextCarouselItem.bind(this)}
        previous={this.prevCarouselItem.bind(this)}
        >
        <CarouselIndicators items={this.state.carouselImages.map((item,index)=>({url:item,key:index,id:index}))} activeIndex={this.state.carouselCurrent}
          onClickHandler={(newIndex)=>{
            if (this.state.carouselAnimated) return;
            this.setState({ carouselCurrent: newIndex });
          }} />
          {
            this.state.carouselImages.map((item,index)=>
            <CarouselItem
              onExiting={()=>this.setState({carouselAnimated:true})}
              onExited={()=>this.setState({carouselAnimated:false})}
              key={index}
              >
              <div style={(this.props.width > 1150) ? {width:900,height:400}:{width:this.props.width-100,height:(this.props.width-100)/9*4}}>
              <img src={item.url} alt={item.url} style={{height:'auto',width:'100%'}} />
              </div>
              <CarouselCaption captionText={item.description} captionHeader={item.header} />
            </CarouselItem>
          )
        }
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.prevCarouselItem.bind(this)} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextCarouselItem.bind(this)} />
      </Carousel>}
    </div>
    )
  }
}

const mapStateToProps = ({ reducer }) => {
  const { content, contentLoaded, language, user } = reducer;
  return { content, contentLoaded, language, user };
};

export default connect(mapStateToProps, { setContent })(MainCarousel);
