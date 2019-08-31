import React, { Component } from 'react';
import http from '../services/httpService';
import {Table,Button,Modal,Form,Row,Col} from 'react-bootstrap';

import {
    apiUrl
  } from '../config.json';
const apiEndpoint = apiUrl + '/delivery/';
const IN_PROGRESS = "En cours"
const DELIVERED = "Livré"
export default class Livraison extends Component {
    constructor(props,context){
        super(props,context);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowUpdate = this.handleShowUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            deliveries:[],
            delivery:'',
            show:false,
            showUpdate:false,
            search:'',
            date_creation:'',
            disabledButton:'false',
            tracking_number:'',
            commentaire:'',
            name:'',
            block:'',
            phone:'',
            weight:'',
            date_livraison:'',
            status:'',
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
      handleChange = (e) => {
        this.setState({
           [e.target.name]: e.target.value
        })
      }
        canBeSubmitted = () =>{
          if(this.state.commentaire)
            return true;
          else {
            return false;
          }
        }
        async refreshLivraison(){
          const { data: delivery } = await http.get(apiEndpoint)
          this.setState({ deliveries: delivery})
        }
        
  
        contenuLivraison(id) {
          window.location.href = '/#contenu/livraison/' + id;
        }
  
        deleteLivraison(id) {
          const mes = window.confirm('Do you really want to delete ?')
          if (mes) {
              http.delete(apiEndpoint + 'delete/' + id + '/').then((resp) => {
              this.refreshLivraison();
              })
            }
            
        }
        async componentWillMount(){
          this.refreshLivraison();
          //const { data:colis} = await http.get(apiEnd)
          //this.setState({ colis: colis})
        }
        getStatus =(livraison)=>{
          if (livraison.status === IN_PROGRESS) return 'ajout colis'
          else if (livraison.status === DELIVERED) return 'fin tournée'
        }
        handleChangeLabelButton = (status,id) =>{
          window.location.href = '/#addColis/livraison/' + id;
          if (status === DELIVERED) {
            this.refreshLivraison();
          }
        }
        disabledButton = (livraison) => {
          if (livraison.status === DELIVERED) return true
          else return false
        }
        updateSearch(event){
            this.setState({search:event.target.value.substr(0,20)});
          }
          onSubmit(e){
            e.preventDefault();
            if (!this.canBeSubmitted()) {
                e.preventDefault();
                return;
               }
            
            const livraison = {
               commentaire: this.state.commentaire  
            };
            http.post(apiEndpoint+'create/',livraison)
              .then(res => {
                  console.log('data ', res.data);
                  this.setState({
                    commentaire: '',
                    show:false
                  });
                this.refreshLivraison();
                });
          }
          editLivraison(id,commentaire){
            this.setState({
              id: id,
              commentaire:commentaire,
              showUpdate:true
            })
          }
          onUpdate(e) {
            e.preventDefault();
            if (!this.canBeSubmitted()) {
              e.preventDefault();
              return;
             }
          
          const livraison = {
            commentaire: this.state.commentaire,
            parcels:[]
          };
          http.put(apiEndpoint+'update/'+ this.state.id +'/',livraison)
            .then(res => {
                console.log('data ', res.data);
                this.setState({
                  commentaire: '',
                  showUpdate:false
                });
              this.refreshLivraison();
              });
          }
          addColisToLivraison = () =>{
            
          }
          
        
        render() {
          const { commentaire,colis} = this.state;
          const isEnabled = this.canBeSubmitted();
          console.log('commentaire:',commentaire,'active:', isEnabled,'colisLength:',colis)
            let filterLivraison = this.state.deliveries.filter((livraison)=>{
                let livraisonInfos = livraison.delivery_number + livraison.id +livraison.date_creation + livraison.status.toLowerCase() + livraison.commentaire.toLowerCase();
                return livraisonInfos.indexOf(this.state.search.toLowerCase())!==-1;
            });
          let livraison = filterLivraison.map((livraison)=>{
            return(
              <tr key={livraison.id}>
              <td>{livraison.id}</td>
              <td>{livraison.delivery_number}</td>
              <td>{livraison.date_creation}</td>
              <td>{livraison.commentaire}</td>
              <td>{livraison.status}</td>
              <td>
                <Button variant="success" size="sm" className="mr-2" 
                  onClick={this.editLivraison.bind(this,livraison.id,livraison.commentaire)}>Edit</Button>
                  <Button variant="primary" size="sm" className="mr-2" disabled = {this.disabledButton(livraison)} onClick={this.handleChangeLabelButton.bind(this,livraison.status, livraison.id)}>{this.getStatus(livraison)}</Button>
                <Button variant="secondary" size="sm" className="mr-2" onClick={this.contenuLivraison.bind(this,livraison.id)}>contenu</Button>
                <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteLivraison.bind(this,livraison.id)}>delete</Button>
              </td>
            </tr>
            )
          });
            return (
             <div>
                  <Row>
                    <Col md={4}>
                      <Button variant="primary" size="sm" className="mt-2 mb-2" onClick={this.handleShow}>
                          Créer Tournée
                      </Button>
                    </Col>
                    <Col md={{ offset: 4 }}>
                      <Form className="form-inline mt-2 mb-2">
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher Tournée"size="sm" />
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
                    <th>Date Création</th>
                    <th>Commentaire</th>
                    <th>Status</th>
                    <th>Actions sur la tournée</th>
                 </tr>
                </thead>
                <tbody>
                  {livraison}
                </tbody>
              </Table>
              <div>
                  <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success"><marquee direction="right">Création Tournée!</marquee></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Commentaire:  </label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="commentaire"
                              value={commentaire}
                              onChange={this.handleChange}
                              />
                        </div>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary" disabled={!isEnabled}>
                        Créer Tournée
                      </Button>
                  </Modal.Footer>
                  </form>     
                  </Modal.Body>
                </Modal>
                </div>
                <div>
                  <Modal show={this.state.showUpdate} onHide={this.handleCloseUpdate}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success"><marquee direction="right">Modification de la tournée !</marquee></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onUpdate}>
                        <div className="form-group">
                            <label>Commentaire:  </label>
                            <input 
                              type="text" 
                              className="form-control"
                              name="commentaire"
                              value={commentaire}
                              onChange={this.handleChange}
                              />
                        </div>
                     <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleCloseUpdate}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary">
                        Modifier tournée
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
