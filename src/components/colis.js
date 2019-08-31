import React, { Component } from 'react';
import http from '../services/httpService';
import auth from '../services/authService';
import {Link} from 'react-router-dom';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';



import {
    apiUrl
  } from '../config.json';
const apiEndpoint = apiUrl + '/parcel/';
const apiEndpointUpdate = apiUrl + '/parcel/update/';
const apiEndpointDelete = apiUrl + '/parcel/delete/';
const PENDING = "En attente de collecte"
const REPOSITORY = "Avec la société de livraison"
const IN_PROGRESS = "Avec le livreur"
const DELIVERED = "Livré"
var dateFormat = require('dateformat');
var tempDate = new Date ();
var date = tempDate.getFullYear () + '-' + (tempDate.getMonth () + 1) + '-' + tempDate.getDate ();
const currDate = "Date actuelle = " + date;
console.log(currDate);
export default class Colis extends Component {
    constructor(props,context){
        super(props,context);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowUpdate = this.handleShowUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
        this.toAddColis = this.toAddColis.bind(this);
        this.toEditColis = this.toEditColis.bind(this);
        this.toAddColis = this.toAddColis.bind(this);
        this.handleChangeTrack = this.handleChangeTrack.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeTel = this.handleChangeTel.bind(this);
        this.handleChangePoids = this.handleChangePoids.bind(this);
        this.handleChangeCreationDate = this.handleChangeCreationDate.bind(this);

        this.state = {
            parcels:[],
            show:false,
            showUpdate:false,
            search:'',
            date_livraison:'',
            tracking_number:'',
            labelButton:'collecter',
            name:'',
            phone:'',
            weight:'',
            disabledButton: 'false',
            idClient:'',
            id:''
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
        handleChangeTrack(e){
          this.setState({
            tracking_number:e.target.value
          });
      }
      handleChangeName(e){
        this.setState({
          name:e.target.value
        });
      }
      handleChangeTel(e){
        this.setState({
          phone:e.target.value
        });
      }
      handleChangePoids(e){
        this.setState({
          weight:e.target.value
        });
      }
      handleChangeCreationDate(e){
        this.setState({
          date_creation:e.target.value
        });
  }
  getStatus = colis => {
    if (colis.status === PENDING) return 'collecter'
    else if (colis.status === REPOSITORY) return 'charger'
    else if (colis.status === IN_PROGRESS) return 'confirmer'
    else if (colis.status === DELIVERED) return 'livré'
  }
  handleChangeLabelButton = (status, id, idClient) => {
    window.location.reload(false);
    if (status === PENDING) {
      const colis = {
        client: { id: idClient },
        articles: [],
        status: REPOSITORY
      };
      http.put(apiEndpointUpdate + id + '/', colis)
        .then(res => {
          console.log('data ', res.data);
          console.log('idClient', idClient)
        })
      this.refreshColis();
    }
    if (status === REPOSITORY) {
      const colis = {
        client: { id: idClient },
        articles: [],
        status: IN_PROGRESS
      };
      http.put(apiEndpointUpdate + id + '/', colis)
        .then(res => {
          console.log('data ', res.data);
          console.log('idClient', idClient)
        })
        this.refreshColis(); 
    }
    if (status === IN_PROGRESS) {
      const colis = {
        client: { id: idClient },
        articles: [],
        status: DELIVERED,
        date_delivery:date
      };
      http.put(apiEndpointUpdate + id + '/', colis)
        .then(res => {
          console.log('data ', res.data);
          console.log('idClient', idClient)
        })
      }
      this.refreshColis();
      if (status === DELIVERED) {
          this.refreshColis();
          this.setState({ disabledButton: !this.state.disabledButton });
        }
      }  
    
        refreshColis(){
            http.get(apiEndpoint).then((res)=>{
            this.setState({
                parcels: res.data
            })
            });
        }
         async componentWillMount(){
         const user = await auth.getUserObject();
         console.log('usee',user)
         this.setState({user})
         this.refreshColis();
        }
        updateSearch(event){
            this.setState({search:event.target.value.substr(0,20)});
          }
        deleteColis(id){
            const mes = window.confirm('Do you really want to delete ?');
            if(mes){
              http.delete(apiEndpointDelete + id + '/').then((resp) => {
                this.refreshColis();
              });
            }
          }
          infosColis(){

          }
          toAddColis(){
            window.location.href = '/#addColis';
          }
          disabledButton = (colis) => {
            if (colis.status === DELIVERED) return true
            else return false
          }
          toAddProduit = (id) => {
            window.location.href = '#/colis/'+id
          }
          toEditColis(){
            window.location.href = '/#editColis';
          }
          toAddProduct(){
            window.location.href = '/#addProduct'; 
  }
  

          
  render() {
            const {user} = this.state;
            let filtercolis = this.state.parcels.filter((colis)=>{
              let colisInfos = colis.tracking_number.toLowerCase() + dateFormat(colis.date_creation,"isoDate");
                return colisInfos.indexOf(this.state.search.toLowerCase())!==-1;
            });
          let colis = filtercolis.map((colis)=>{
            return (
              
              <tr key={colis.id}>
              <td>{colis.id}</td>
              <td>{colis.tracking_number}</td>
              <td>{colis.client.full_name}</td>
              <td>{colis.client.phone}</td>
              <td>{colis.client.address}</td>
              <td>{colis.weight} kg</td>
              <td>{colis.delivery_price}</td>
              <td>{colis.status}</td>
              <td>{colis.comment}</td>
              <td>{(colis.client.created_by.first_name && colis.client.created_by.last_name)?colis.client.created_by.first_name+' '+colis.client.created_by.last_name:''}</td>
              <td>{dateFormat(colis.date_creation, "isoDate")}</td>
              {!user.is_superuser && (<React.Fragment>
              <td>
                 <Button variant="success" size="sm" className="mr-2"><Link to={"/edit/colis/"+colis.id}>Edit</Link></Button>
                <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteColis.bind(this,colis.id)}>delete</Button>
                  <Button className="mr-2 mt-3" size="sm" onClick={this.toAddProduit.bind(this,colis.id)} disabled={this.disabledButton(colis)}>produits</Button>
                <Button variant="warning"className="mr-2" size="sm"><Link to={"/contenu/colis/"+colis.id}>contenu</Link></Button>
              </td>
              </React.Fragment>)}
              {user.is_superuser && (<React.Fragment>
              <td>
                 <Button variant="success" size="sm" className="mr-2"><Link to={"/edit/colis/"+colis.id}>Edit</Link></Button>
                <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteColis.bind(this,colis.id)}>delete</Button>
                  <Button className="mr-2" size="sm" onClick={this.toAddProduit.bind(this,colis.id)} disabled={this.disabledButton(colis)}>produits</Button>
                <Button variant="warning"className="mr-2" size="sm"><Link to={"/contenu/colis/"+colis.id}>contenu</Link></Button>
                <Button variant="dark" size="sm" onClick={() => { this.handleChangeLabelButton(colis.status, colis.id, colis.client.id) }}>{this.getStatus(colis)}</Button>
              </td>
              </React.Fragment>)}
            </tr>
            )
          });
          return ( 
                <div>
                  <Row>
                    <Col md={4}>
                      <Button variant="primary" size="sm" className="mt-2 mb-2" onClick={this.toAddColis}>
                          Créer Colis
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
                    <th>Numéro tracking</th>
                    <th>Prénom Nom</th>
                    <th>Téléphone client</th>
                    <th>Adresse client</th>
                    <th>Poids</th>
                    <th>Prix livraison</th>
                    <th>Status</th>
                    <th>Commentaire</th>
                    <th>Propriétaire</th>
                    <th>Date Création</th>
                    <th>Modifications des actions au niveau du colis</th>
                 </tr>
                </thead>
                <tbody>
                  {colis}
                </tbody>
              </Table>
            </div> 
        );
      
    }
}
