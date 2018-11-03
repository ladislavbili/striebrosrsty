import React, {Component} from 'react';
import {setContent} from '../redux/actions';
import { connect } from "react-redux";
import {rebase} from '../index';
import { Card, CardHeader,CardTitle, CardText, CardBody, Button,  Carousel,  CarouselIndicators,  CarouselItem,
  CarouselCaption, CarouselControl, DropdownToggle, FormGroup, Label, Input, DropdownMenu, Dropdown,
  Modal,  ModalHeader,  ModalBody,  ModalFooter} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {timestampToString} from '../helperFunctions';
import { faEdit,faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
  }
  this.nextCarouselItem.bind(this);
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
    rebase.get('/texts/main', {
      context: this,
    }).then(content=>{this.props.setContent(content)});
    rebase.get('/carousel-images/images', {
      context: this,
    }).then(data=>{this.setState({carouselImages:data.images,carouselLoaded:true})});

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
              <div className="row">
                <div className="aboutContainer">
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
              <div style={{width:900,height:400}} className="row">
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
                        <div style={{width:900,height:400}}>
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
