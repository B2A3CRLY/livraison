import React, { Component } from 'react';
import http from '../services/httpService';
import { Button, Form, Modal,Table} from 'react-bootstrap';
import Select from 'react-select';

import {
    apiUrl
  } from '../config.json';
const apiEndpoint = apiUrl + '/parcel/';
const apiClient = apiUrl + '/client/';
const options = [{ value: 'Feminin', label: 'Feminin' }, { value: 'Masculin', label: 'Masculin' }];
export default class AddColis extends Component {
    constructor(props,context){
        super(props,context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseAdd = this.handleCloseAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitAdd = this.onSubmitAdd.bind(this);
        this.addClient = this.addClient.bind(this);
        this.toColis = this.toColis.bind(this);
        this.handleShowAdd = this.handleShowAdd.bind(this);
        this.handleChangeSexe = this.handleChangeSexe.bind(this);
        this.onChoice = this.onChoice.bind(this);
        
        this.state = {
            clients:[],
            show:false,
            showAdd:false,
            showUpdate: false,
            search:'',
            options:'',
            address:'',
            description:'',
            date_livraison:'',
            tracking_number: '',
            delivery_price:'',
            name:'',
            phone:'',
            sexe:'',
            weight:'',
            id: '',
            newId:''
            
            
        };
    }
    handleClose() {
        this.setState({ show: false });
    }
      handleShow() {
        this.setState({ show: true });
    }
    handleChange = (e) => {
        this.setState({
           [e.target.name]: e.target.value
        })
    }
    addClient(e){
        this.setState({
            name:e.target.value,
            show:false
        });
    }
    handleShowAdd(e){
        this.setState({
            showAdd:true
        });
    }
    handleCloseAdd(e){
        this.setState({
            showAdd:false
        });
    }
    handleChangeSexe(sexe){
        this.setState({sexe});
        
        console.log(`Option selected:`, sexe["value"]);
      }
    refreshClients(){
        http.get(apiClient).then((res)=>{
          this.setState({
            clients: res.data
          })
        });
       }
    componentDidMount(){this.refreshClients();}
    addProduit(){} 
    onChoice(id,full_name,phone) {
        this.setState({
            id:id,
            name: full_name,
            phone:phone,
            show: false
        });   
    }
    updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
    }
    canBeSubmitted(){
       if(this.state.name){
         return(this.state.weight.length>0);
        }
    }
    canBeSubmittedAdd(){
        if(this.state.sexe){
       return(this.state.name.length>0 && this.state.phone.length>0 && this.state.address.length>0 && this.state.description.length>0);
        }
      }
   
        
       onSubmit(e){
        e.preventDefault();
        if (!this.canBeSubmitted()) {
            e.preventDefault();
            return;
           }
        
           const colis = {

            client:{
                   id: this.state.id,
                   full_name: this.state.name,
                   phone:this.state.phone
            },
           weight: this.state.weight,
           delivery_price:this.state.delivery_price,
           articles:[]
        
           };
           http.post(apiEndpoint+'create/',colis)
            .then(res => {
                console.log('data ', res.data);
                this.setState({
                  name:'',    
                  weight:''
                });
            });
        }
        onSubmitAdd(e){
           e.preventDefault();
              const client = {
              full_name:this.state.name,
              phone:this.state.phone,
              address:this.state.address,
              sexe:this.state.sexe["value"],
              bio:this.state.description
             };
             http.post(apiClient+'create/',client)
                .then(res => {
                    console.log('client ', res.data);
                    
                    this.setState({
                    name: this.state.name,
                    phone:this.state.phone,    
                    address:'',
                    sexe:'',
                    description:'',
                    showAdd: false,
                    id: res.data.id
                    });
                });
            }
             
        toColis(){
            window.location.href = '/#colis';
        }
    render() {
        const { sexe,delivery_price } = this.state;
        console.log('Selected Name:', this.state.name);
        console.log('Selected phone:', this.state.phone);
        console.log('Selected id:', this.state.id);
        console.log('Selected poids:', this.state.weight);
        console.log('Selected track:', this.state.tracking_number);
        console.log('Prix livraison:',delivery_price);
        let filterClient = this.state.clients.filter((client)=>{
            let clientInfos = client.full_name.toLowerCase() + 
                + client.phone;
            return clientInfos.indexOf(this.state.search.toLowerCase())!==-1;
          });
          let clients = filterClient.map((client)=>{
            return(
            <tr key={client.id}>
              <td>{client.full_name}</td>
              <td>{client.phone}</td>
              <td><Button variant="primary" size="sm" onClick={this.onChoice.bind(this,client.id,client.full_name,client.phone)}>choisir</Button></td>
            </tr>
            )
          });
        const isEnabled = this.canBeSubmitted();
        const isEnabledAdd = this.canBeSubmittedAdd();
        console.log(`The values are :${this.state.sexe["value"]}`,`${this.state.name}`,`${this.state.phone}`,`${this.state.address}`,`${this.state.description}`);
        return (
            <div>
                <div className="row">
                <div className="col-md-3"></div>
                <div className="card mt-2 col-md-6">
                    <div className="card-body">
                            <h3 className="text-success text-center mt-2">création d'un nouveau colis</h3>
                            <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Nom Client:  </label>
                                <input 
                                type="text" 
                                className="form-control" 
                                value={this.state.name}
                                onChange={this.handleChange}
                                    />
                                <Button variant="secondary" size="sm" className="mt-2 mr-2" onClick={this.handleShow}>Choisir client</Button>
                                <Button variant="secondary" size="sm" className="mt-2" onClick={this.handleShowAdd}>Créer nouveau client</Button>
                                    
                            </div>
                            <div className="form-group">
                                <label>Poids:  </label>
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder="00.00 kg"
                                name="weight"
                                value={this.state.weight} 
                                onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Prix de livraison:  </label>
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder="00.00 Fcfa"
                                name="delivery_price"
                                value={this.state.delivery_price} 
                                onChange={this.handleChange}
                                />
                            </div>
                            <Button variant="primary" type="submit" size="sm" className="btn btn-primary" onClick={this.toColis} disabled={!isEnabled}>
                                Créer colis
                            </Button>
                        </form>
                    </div>
                </div>
                </div>
                <div>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-success"><marquee direction="right">Ajouter un nouveau client !</marquee></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="form-inline mt-2 mb-2">
                            <Form.Group controlId="formBasicEmail">
                            <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher client"size="sm" />
                            <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                            </Form.Group>
                        </Form>
                        <div>
                            <Table striped>
                                <thead className="thead-dark">
                                <tr>
                                    <th>client</th>
                                    <th>phone</th>
                                    <th>choisir</th>
                                </tr>
                                </thead>
                                 <tbody>
                                        {clients}
                                 </tbody>
                            </Table>    
                        </div>
                    </Modal.Body>
                    </Modal>
                </div>
                <div>
                    <Modal show={this.state.showAdd} onHide={this.handleCloseAdd}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-success"><marquee direction="right">Ajouter un nouveau client !</marquee></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form onSubmit={this.onSubmitAdd}>
                                <div className="form-group">
                                    <label>Prénom Nom:  </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name"
                                    onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Adresse:  </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    name="address"
                                    onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone:  </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    name="phone"
                                    onChange={this.handleChange}
                                    />
                                </div>
                                <div>
                                <label>Sexe:  </label>
                                <Select
                                value={sexe}
                                onChange={this.handleChangeSexe}
                                options={options}
                                />
                                </div>
                                <div className="form-group">
                                    <label>Description:  </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    name="description"
                                    onChange={this.handleChange}
                                    />
                                </div>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseAdd}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="btn btn-primary"  disabled={!isEnabledAdd}>
                                Ajouter Client
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
