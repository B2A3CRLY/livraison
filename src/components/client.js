import React, { Component } from 'react'
import http from '../services/httpService';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'; 
import Select from 'react-select';
import {
  apiUrl
} from '../config.json';
const apiEndpoint = apiUrl + '/client';
const apiEndpointUpdate = apiUrl + '/client/update';
const options = [{value:'Feminin',label:'Feminin'},{value:'Masculin',label:'Masculin'}]
class Client extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleShowUpdate = this.handleShowUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeTel = this.handleChangeTel.bind(this);
    this.handleChangeAd = this.handleChangeAd.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangeSexe = this.handleChangeSexe.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.state = {
      clients:[],
      show: false,
      showUpdate:false,
      id:'',
      full_name:'',
      phone:'',
      address:'',
      sexe:'',
      bio:'',
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
 handleChangeName(e){
  this.setState({
    full_name:e.target.value
  });
}
handleChangeTel(e){
  this.setState({
    phone:e.target.value
  });
}
handleChangeAd(e){
  this.setState({
    address:e.target.value
  });
}
handleChangeDesc(e){
  this.setState({
    bio:e.target.value
  });
}
handleChangeSexe(sexe){
  this.setState({sexe});
  
  console.log(`Option selected:`, sexe["value"]);
}
 canBeSubmitted(){
   if(this.state.sexe){
  return(this.state.full_name.length>0 && this.state.phone.length>0 && this.state.address.length>0) ;
   }
 }
  onSubmit(e) {
 
  if (!this.canBeSubmitted()) {
    e.preventDefault();
    return;
  }
  const client = {
    full_name:this.state.full_name,
    phone:this.state.phone,
    address:this.state.address,
    sexe:this.state.sexe["value"],
    bio:this.state.bio
   };
   http.post(apiEndpoint+'/create/',client)
      .then(res => {
        console.log(res.data);
        this.setState({
          full_name:'',
          phone:'',
          address:'',
          sexe:'',
          bio:'',
          show:false
          });
        console.log(`The values are :${this.state.sexe["value"]}`);
        this.refreshClients();
      });
    }
 refreshClients(){
  http.get(apiEndpoint).then((res)=>{
    this.setState({
      clients: res.data
    })
  });
 }
  componentDidMount(){
   this.refreshClients();
  }
  editClient(id,full_name,phone,address,sexe,bio){
    this.setState({
     id:id,
     full_name:full_name,
     phone:phone,
     address:address,
     sexe:sexe,
     bio:bio,
     showUpdate:true
    });
  }
  onUpdate(e){
    const client = {
      full_name:this.state.full_name,
      phone:this.state.phone,
      address:this.state.address,
      sexe:this.state.sexe["value"],
      bio:this.state.bio
     };
     http.put(apiEndpointUpdate+'/'+this.state.id+'/',client).
     then((resp)=>{
       console.log(resp.data);
       console.log(`The values are:${this.state.full_name},${this.state.sexe["value"]},${this.state.address},
       ${this.state.bio}`);
       this.refreshClients();
       this.setState({
        full_name:'',
        phone:'',
        address:'',
        sexe:'',
        bio:'',
        showUpdate:false
      })
     });
  }
  deleteClient(id,full_name){
    const mes = window.confirm('Do you really want to delete '+full_name+' ?')
    if(mes){
     http.delete(apiEndpointUpdate+'/'+id+'/').then((resp)=>{
       this.refreshClients();
     });
    }
  }
  infosClient(){
    alert('actuellement en conception # Babacar Ly')
  }
  updateSearch(event){
    this.setState({search:event.target.value.substr(0,20)});
  }
   
  
render() {
  const { sexe} = this.state;
  const isEnabled = this.canBeSubmitted();
  let filterClient = this.state.clients.filter((client)=>{
    let clientInfos = client.full_name+client.phone+
    client.address.toLowerCase() +client.sexe.toLowerCase();
    return clientInfos.indexOf(this.state.search.toLowerCase())!==-1;
  });
  let clients = filterClient.map((client)=>{
    return(
      <tr key={client.id}>
      <td>{client.id}</td>
      <td>{client.full_name}</td>
      <td>{client.phone}</td>
      <td>{client.address}</td>
      <td>{client.sexe}</td>
      <td>{(client.created_by.first_name&&client.created_by.last_name)?client.created_by.first_name+''+client.created_by.last_name:''}</td>
      <td>{client.bio}</td>
     <td>
        <Button variant="success" size="sm" className="mr-2" 
          onClick={this.editClient.bind(this,client.id,client.full_name,client.phone,client.address,client.sexe,client.bio)}>Edit</Button>
        <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteClient.bind(this,client.id,client.full_name)}>delete</Button>
        <Button variant="primary" size="sm" onClick={this.infosClient}>infos</Button>
      </td>
    </tr>
    )
  });
    return ( 
     <div>
          <Row>
            <Col md={4}>
              <Button variant="primary" size="sm" className="mt-2 mb-2" onClick={this.handleShow}>
                  Créer client
              </Button>
            </Col>
            <Col md={{ offset: 4 }}>
              <Form className="form-inline mt-2 mb-2">
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher client"size="sm" />
                  <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
      <Table striped>
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Prénom Nom</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Sexe</th>
            <th>Propriétaire</th>
            <th>Description</th>
            <th>actions sur client</th>
          </tr>
        </thead>
        <tbody>
          {clients}
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
                    <label>Prénom Nom:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.full_name}
                      onChange={this.handleChangeName}
                      />
                </div>
                <div className="form-group">
                    <label>Adresse:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.address}
                      onChange={this.handleChangeAd}
                      />
                </div>
                <div className="form-group">
                    <label>Téléphone:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.phone}
                      onChange={this.handleChangeTel}
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
                    <label>description:  </label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="le champ n'est pas obligatoire"
                      value={this.state.bio}
                      onChange={this.handleChangeDesc}
                      />
                </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="btn btn-primary" disabled={!isEnabled}>
                Ajouter Client
              </Button>
          </Modal.Footer>
          </form>     
          </Modal.Body>
        </Modal>
      </div>


      <div>
        <Modal show={this.state.showUpdate} onHide={this.handleCloseUpdate}>
          <Modal.Header closeButton>
            <Modal.Title className="text-success"><marquee direction="right">Modification client !</marquee></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={this.onUpdate}>
                <div className="form-group">
                    <label>Prénom Nom:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.full_name}
                      onChange={this.handleChangeName}
                      />
                </div>
                <div className="form-group">
                    <label>Adresse:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.address}
                      onChange={this.handleChangeAd}
                      />
                </div>
                <div className="form-group">
                    <label>Téléphone:  </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.phone}
                      onChange={this.handleChangeTel}
                      />
                </div>
                <div className="form-group">
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
                      value={this.state.bio}
                      onChange={this.handleChangeDesc}
                      />
                </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseUpdate}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="btn btn-primary">
                Modifier Client
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

export default Client;