import React, { Component } from 'react';
import http from '../services/httpService';
import {Table,Button,Modal,Form,Row,Col} from 'react-bootstrap';
import {
    apiUrl
  } from '../config.json';
const apiEndpoint = apiUrl + '/article/';
const apiEndpointUpdate = apiUrl + '/article/update/';
export default class Produit extends Component {
    constructor(props,context){
        super(props,context);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowUpdate = this.handleShowUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
        this.handleChangeDesignation = this.handleChangeDesignation.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleChangeModele = this.handleChangeModele.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            produits:[],
            show:false,
            showUpdate:false,
            designation:'',
            quantity:'',
            price:'',
            size:'',
            color:'',
            modele:'',
            id:'',
            search:''
        };
      }
      handleClose() {
        this.setState({ show: false });
      }
      handleShow() {
        this.setState({ show: true });
      }
      handleCloseUpdate() {
        this.setState({ showUpdate: false });
      }
      handleShowUpdate() {
        this.setState({ showUpdate: true });
      }
      handleChangeDesignation(e){
        this.setState({
          designation:e.target.value
        });
      }
      handleChangeQuantity(e){
        this.setState({
          quantity:e.target.value
        });
      }
      handleChangeSize(e){
        this.setState({
          size:e.target.value
        });
      }
      handleChangePrice(e){
        this.setState({
          price:e.target.value
        });
      }
      handleChangeColor(e){
        this.setState({
          color:e.target.value
        });
      }
      handleChangeModele(e){
        this.setState({
          modele:e.target.value
        });
      }
      
 onSubmit(e){
   e.preventDefault();
  const produit = {
    designation:this.state.designation,
    price:this.state.price,
    size:this.state.size,
    color: this.state.color,
    modele:this.state.modele
   };
   http.post(apiEndpoint+'create/',produit)
      .then(res => {
        console.log(res.data);
        this.refreshProduits();
      });
      console.log(`The values are :${this.state.designation}`,`${this.state.price}`,`${this.state.size}`,`${this.state.color}`)
    this.setState({
      designation:'',
      price:'',
      size:'',
      color:'',
      show:false
     });
    }
      refreshProduits(){
        http.get(apiEndpoint).then((res)=>{
          this.setState({
            produits: res.data
          })
        });
       }
        componentDidMount(){
         this.refreshProduits();
        }
      editProduit(id,designation,price,size,color,modele){
        this.setState({
         id:id,
         designation:designation,
         price:price,
         size:size,
         color:color,
         modele:modele,
         showUpdate:true
        });
      }
      onUpdate(e){
        const produit = {
          designation:this.state.designation,
          price:this.state.price,
          size:this.state.size,
          color: this.state.color,
          modele:this.state.modele
         };
         http.put(apiEndpointUpdate+this.state.id+'/',produit)
         .then((resp)=>{
           console.log(resp.data);
           console.log(`The values are:${this.state.designation},${this.state.price},${this.state.size},
           ${this.state.color}`);
           this.refreshProduits();
           this.setState({
            designation:'',
            price:'',
            size:'',
            color:'',
            modele:'',
            showUpdate:false
          })
         });
      }
      deleteProduit(id){
        const mes = window.confirm('Do you really want to delete ?')
        if(mes){
         http.delete(apiEndpointUpdate+id+'/').then((resp)=>{
           this.refreshProduits();
         });
        }
      }
      updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
      }
      infosproduit(){
        alert('En production #Mr. Ly');
      }
    render() {
        let filterProduits = this.state.produits.filter((produit)=>{
            let produitInfos = produit.designation.toLowerCase()+produit.price+
            produit.size + produit.color.toLowerCase();
            return produitInfos.indexOf(this.state.search.toLowerCase())!==-1;
          });
          let produits = filterProduits.map((produit)=>{
            return(
              <tr key={produit.id}>
              <td>{produit.id}</td>
              <td>{produit.designation}</td>
              <td>{produit.price} FCFA</td>
              <td>{isNaN(produit.size) ? produit.size : <span>{produit.size} m</span>}</td>
              <td>{produit.color}</td>
              <td>{produit.modele}</td>
              <td>
                <Button variant="success" size="sm" className="mr-2" 
                  onClick={this.editProduit.bind(this,produit.id,produit.designation,produit.price,produit.size,produit.color,produit.modele)}>Edit</Button>
                <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteProduit.bind(this,produit.id)}>delete</Button>
                <Button variant="primary" size="sm" onClick={this.infosproduit}>infos</Button>
              </td>
            </tr>
            )
          });
            return ( 
             <div>
                  <Row>
                    <Col md={4}>
                      <Button variant="primary" size="sm" className="mt-2 mb-2" onClick={this.handleShow}>
                          Créer produit
                      </Button>
                    </Col>
                    <Col md={{ offset: 4 }}>
                      <Form className="form-inline mt-2 mb-2">
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher produit"size="sm" />
                          <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>
              <Table striped>
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Désignation</th>
                    <th>Prix Unitaire</th>
                    <th>Taille</th>
                    <th>Couleur</th>
                    <th>Adresse de livraison</th>
                    <th>actions sur produit</th>
                  </tr>
                </thead>
                <tbody>
                  {produits}
                </tbody>
              </Table>
              <div>
                  <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success"><marquee direction="right">Ajouter un nouveau client !</marquee></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Désignation:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.designation}
                              onChange={this.handleChangeDesignation}
                              />
                        </div>
                        <div className="form-group">
                            <label>Prix:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.price}
                              onChange={this.handleChangePrice}
                              />
                        </div>
                        <div className="form-group">
                            <label>Taille:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.size}
                              onChange={this.handleChangeSize}
                              />
                        </div>
                        <div className="form-group">
                            <label>Couleur:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.color}
                              onChange={this.handleChangeColor}
                              />
                        </div>
                        <div className="form-group">
                            <label>Adresse de collecte:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.modele}
                              onChange={this.handleChangeModele}
                              />
                        </div>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary">
                        Ajouter Produit
                      </Button>
                  </Modal.Footer>
                  </form>     
                  </Modal.Body>
                </Modal>
              </div>
              <div>
                <Modal show={this.state.showUpdate} onHide={this.handleCloseUpdate}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success"><marquee direction="right">Modification du produit !</marquee></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onUpdate}>
                        <div className="form-group">
                            <label>Désignation:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.designation}
                              onChange={this.handleChangeDesignation}
                              />
                        </div>
                        <div className="form-group">
                            <label>Prix:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.price}
                              onChange={this.handleChangePrice}
                              />
                        </div>
                        <div className="form-group">
                            <label>Taille:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.size}
                              onChange={this.handleChangeSize}
                              />
                        </div>
                        <div className="form-group">
                            <label>Couleur:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.color}
                              onChange={this.handleChangeColor}
                              />
                        </div>
                        <div className="form-group">
                            <label>Adresse de collecte:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={this.state.modele}
                              onChange={this.handleChangeModele}
                              />
                        </div>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleCloseUpdate}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary">
                        Modifier produit
                      </Button>
                  </Modal.Footer>
                  </form>     
                  </Modal.Body>
                 </Modal>
               </div>
              </div> 
            );
    }
}
