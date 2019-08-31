import React, { Component } from 'react'
import http from '../services/httpService';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import {
    apiUrl
} from '../config.json';
const apiClient = apiUrl + '/client/';
const apiColisUpdate = apiUrl + '/parcel/update/';
const apiColis = apiUrl + '/parcel/';
export default class EditParcel extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            parcels: [],
            clients:[],
            designation:'',
            quantity: '',
            comment:'',
            name: '',
            show:false,
            weight: '',
            search:'',
            delivery_price:'',
            id: '',
            idClient:'',
            selectedOption:''
        }
    }
    onUpdate(e) {
        e.preventDefault();
        e.preventDefault();
        if (!this.canBeSubmitted()) {
            e.preventDefault();
            return;
           }
        
           const colis = {

            client:{
                id: this.state.idClient,
            },
            articles:[],
            weight: this.state.weight,
            delivery_price:this.state.delivery_price,
            comment:this.state.comment
            };
            http.put(apiColisUpdate+this.state.id+'/',colis)
            .then(res => {
                console.log('data ', res.data);
                this.setState({
                  name:'',    
                  weight:'',
                  delivery_price:''
                });
            })
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
    canBeSubmitted(){return(this.state.weight.length>0 && this.state.delivery_price && this.state.name);}
    updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
    }
    onChoice(id,full_name,phone) {
        this.setState({
            idClient:id,
            name: full_name,
            phone:phone,
            show: false
        });   
    }
    renderRedirect = () => {
        window.location.href = '/#colis';
    }
   
    async componentDidMount() {
        const idColis = this.props.match.params.id;
        console.log('colisId:',idColis)
        const { data: parcels } = await http.get(apiColis);
        const { data: clients } = await http.get(apiClient);
        parcels.map((colis) => { 
            if (colis.id===parseInt(idColis)) {
               this.setState({idClient:colis.client.id,name:colis.client.full_name,weight:colis.weight,delivery_price:colis.delivery_price,comment:colis.comment})
            }
        });
        this.setState({ id: idColis,clients})
        console.log("Data colis:",parcels,"idClient:",this.state.idClient,"clients:",this.state.clients)
    
    }
    
    render() {
        const isEnabled = this.canBeSubmitted();
        const { id, clients, name, weight, delivery_price, comment} = this.state;
        console.log(`name:${name},poids:${weight},prix:${delivery_price} isEnabled:${isEnabled} comment:${comment}`)
        let filterClient = clients.filter((client)=>{
            let clientInfos = client.full_name.toLowerCase() + 
                + client.phone;
            return clientInfos.indexOf(this.state.search.toLowerCase())!==-1;
          });
          let clientsUpdate = filterClient.map((client)=>{
            return(
            <tr key={client.id}>
              <td>{client.full_name}</td>
              <td>{client.phone}</td>
              <td><Button variant="primary" size="sm" onClick={this.onChoice.bind(this,client.id,client.full_name,client.phone)}>choisir</Button></td>
            </tr>
            )
          });
        return (
            <div>
                <div className="row">
                <div className="col-md-3"></div>
                <div className="card mt-2 col-md-6">
                    <div className="card-body">
                            <h3 className="text-success text-center mt-2"><marquee direction="right">Modification du colis numéro {id}</marquee></h3>
                            <form onSubmit={this.onUpdate}>
                            <div className="form-group">
                                <label>Nom Client:  </label>
                                <input 
                                type="text" 
                                className="form-control"
                                value={this.state.name}
                                onChange={this.handleChange}
                                    />
                                <Button variant="secondary" size="sm" className="mt-2 mr-2" onClick={this.handleShow}>Modifier client</Button>
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
                            <div className="form-group">
                                <label>Commentaire:  </label>
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder=""
                                name="comment"
                                value={this.state.comment} 
                                onChange={this.handleChange}
                                />
                            </div>
                            <Button variant="primary" type="submit" size="sm" className="btn btn-primary" onClick = {this.renderRedirect} disabled={!isEnabled}>
                                Modifier colis
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
                                    {clientsUpdate} 
                                 </tbody>
                            </Table>    
                        </div>
                    </Modal.Body>
                    </Modal>
                </div>
            </div>
        )
    }
}
