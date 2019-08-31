import React, { Component } from 'react';
import http from '../services/httpService';
import { Button,Modal} from 'react-bootstrap';
import Select from 'react-select'
import '../custom.css';
import {
    apiUrl
} from '../config.json';
const apiEndpoint = apiUrl + '/article/';
const apiColisUpdate = apiUrl + '/parcel/update/';
const apiColis = apiUrl + '/parcel/';
const apiParcelQuantity = apiUrl + '/parcel/update_parcel_quantity/';
const apiProduit = apiUrl + '/article/';
export default class AddProductColis extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onSubmitAdd = this.onSubmitAdd.bind(this);
       
        this.state = {
            produits: [],
            parcels:[],
            show:false,
            showUpdate:false,
            designation:'',
            quantity: '',
            weight:'',
            price:'',
            size:'',
            color: '',
            modele:'',
            id: '',
            idClient:null,
            search: '',
            value: '',
            selectedOption:''
        }
    }
    handleChange = (e) => {
        this.setState({
           [e.target.name]: e.target.value
        })
    }
    canBeSubmitted() {
        if (this.state.selectedOption) {
            return this.state.quantity;
        }
    }
    canBeSubmittedProduct() {
        return this.state.price > 0 ;
    }
    onSubmitAdd(e) {
        e.preventDefault();
        const produit = {
          designation:this.state.designation,
          price:this.state.price,
          size:this.state.size,
          color: this.state.color,
          modele:this.state.modele
         };
         http.post(apiProduit+'create/',produit)
            .then(res => {
              console.log(res.data);
              if (res.data) {
                  alert("Successful!");
              }
              
            });
            
          this.setState({
            designation:'',
            price:'',
            size:'',
            color: '',
            modele:'',
            show:false
           });
        }
    onSubmit(e){
        e.preventDefault();
        console.log('colis',this)
        const colis = {
            id: this.state.id,
            client:{id:this.state.idClient},
            articles: [{id: this.state.selectedOption.id }]
            
        
        };
        const quantity = {
           quantity:this.state.quantity,
           id_article:this.state.selectedOption.id,
           id_parcel : this.state.id
        }
        http.put(apiColisUpdate+this.state.id+'/',colis)
            .then(res => {
                console.log('data ', res.data);
                this.setState({ selectedOption:''})
                alert('successfull!')
            });
        http.post(apiParcelQuantity,quantity)
            .then(res => {
                console.log('data ', res.data);
                this.setState({
                  quantity:''
                });
            });
    }
    updateId = (id) => {
        this.setState({ id: id });
    }
    handleClose() {
        this.setState({ show: false });
    }
      handleShow() {
        this.setState({ show: true });
    }
    async componentDidMount() {
        const idColis = this.props.match.params.id;
        console.log('colisId:',idColis)
        const { data: produits } = await http.get(apiEndpoint);
        const { data: parcels } = await http.get(apiColis);
        parcels.map((colis) => { 
            if (colis.id===parseInt(idColis)) {
               this.setState({idClient:colis.client.id})
            }
        });
        this.setState({produits,id:idColis})
        console.log("Data articles:", produits)
        console.log("Data colis:",parcels)
    
    }
    handleChangeS = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
      };
    render() {
        const isEnabled = this.canBeSubmitted();
        const isEnabledProduct = this.canBeSubmittedProduct();
        const idColis = this.props.match.params.id;
        const { selectedOption, produits,idClient,quantity,color,size,price,modele,designation} = this.state;
       
        console.log('idColis:', idColis, 'selectedOptionId:', selectedOption.id, 'idClient', idClient, 'quantité:', quantity)
        console.log(`designation:${designation} color:${color} size:${size} price:${price} modele:${modele} IsEnabled:${isEnabledProduct}`)
        return (
            <div>
                <div className="row">
                <div className="col-md-3"></div>
                <div className="card mt-2 col-md-6">
                        <div className="card-body">
                            <Button variant="primary" type="submit" size="sm" className="btn btn-primary" onClick={this.handleShow}>
                                 + produits
                            </Button>
                            <form onSubmit={this.onSubmit}>
                            <div className="row">    
                                <div style={{ marginTop: 40, marginLeft: 100 }}className="col-sm mt-5 mb-5">
                                <label>Désignation:</label>  
                                <Select
                                    getOptionLabel={option =>`${option.designation}`}
                                    value={selectedOption}
                                    onChange={this.handleChangeS}
                                    options={produits}
                                />
                                </div>
                                <div className="form-group col-sm mt-5 mb-5">
                                    <label>Quantité:  </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    name="quantity"
                                    value={this.state.quantity} 
                                    onChange={this.handleChange}
                                    />
                                </div> 
                            </div>        
                                        
                            <Button variant="primary" type="submit" size="sm" className="btn btn-primary pull-right" disabled={!isEnabled}>
                                Ajouter produit
                            </Button>
                        </form>
                    </div>
                </div>
                </div>
                <div>
                  <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success">Ajouter un nouveau client !</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onSubmitAdd}>
                        <div className="form-group">
                            <label>Désignation:  </label>
                            <input 
                              type="text" 
                              className="form-control"
                              name="designation" 
                              value={this.state.designation}
                              onChange={this.handleChange}
                              />
                        </div>
                        <div className="form-group">
                            <label>Prix:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="price" 
                              value={this.state.price}
                              onChange={this.handleChange}
                              />
                        </div>
                        <div className="form-group">
                            <label>Taille:  </label>
                            <input 
                              type="text" 
                              className="form-control"
                              name="size"  
                              value={this.state.size}
                              onChange={this.handleChange}
                              />
                        </div>
                        <div className="form-group">
                            <label>Couleur:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="color" 
                              value={this.state.color}
                              onChange={this.handleChange}
                              />
                        </div>
                        <div className="form-group">
                            <label>Adresse de livraison:  </label>
                            <input 
                              type="text" 
                              className="form-control"
                              name="modele" 
                              value={this.state.modele}
                              onChange={this.handleChange}
                              />
                        </div>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary" disabled={!isEnabledProduct}>
                        Ajouter Produit
                      </Button>
                  </Modal.Footer>
                  </form>     
                  </Modal.Body>
                </Modal>
              </div>
            </div>
        )
    }
}
