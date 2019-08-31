import React, { Component } from 'react'
import http from '../services/httpService'
import {Table,Button,Modal,Form,Row,Col} from 'react-bootstrap';
import {
    apiUrl
} from '../config.json';
import AvoidColis from './common/avoidColis';
const apiEndPoint = apiUrl + '/delivery/';
const DELIVERED = "Livré"
export default class ContenuLivraison extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            colis: [],
            search:'',
        }
    }
    async refreshLivraison() {
        const idLiv = this.props.match.params.id;
        const { data:delivery } = await http.get(apiEndPoint + 'detail/' + idLiv + '/')
        this.setState({ colis: delivery.parcels })
        this.updateLivraison();
        console.log('colis',this.state.colis)
    }
    componentDidMount() {
        this.refreshLivraison();
    }
    updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
    }
    contenuColis(id) {
        window.location.href = '/#contenu/colis/'+id;
    }
    deleteColis(itemID,itemStatus) {
        const idLiv = this.props.match.params.id;
        const mes = window.confirm('Do you really want to delete ?')
        if (mes && itemStatus !== DELIVERED) {
          const elementRemoved = {
           parcels:[{id:itemID}]
          }
          http.post(apiEndPoint + 'update/' + idLiv +'/', elementRemoved).then((resp) => {
            this.refreshLivraison();
         })
        }
        if(itemStatus === DELIVERED){alert('Impossible de retirer,le colis est déja livré')}
    }
    checkStatus() {
        var x = 1;
        if (this.state.colis.length === 0) return 0;
        else if (this.state.colis) {
                console.log("length ", this.state.colis.length)
                  this.state.colis.map((col) => {
                      if (col.status !== DELIVERED) {
                        x*=0;
                      }
                    })
                  return x*=1 ;
              }
              
        }
        updateLivraison() {
            const idLiv = this.props.match.params.id;
            const isDelivered = this.checkStatus();
            console.log('Livré',isDelivered)
            if (isDelivered === 1) {
              const upLiv = {
                status:DELIVERED
              }
              http.put(apiEndPoint + 'delete/' + idLiv + '/', upLiv).then((resp) => {
                this.refreshLivraison();
                })
            }
          }
    render() {
        console.log('colis',this.state.colis)
        const { colis, search } = this.state;
        const idLiv = this.props.match.params.id;
        let filterColis = null;
        let colisList = null;
        if (!colis.length) {
            colisList = <AvoidColis />
        }
        else {
            filterColis = colis.filter((col) => {
                let colisInfos = col.tracking_number.toLowerCase() +
                    col.client.full_name.toLowerCase() + col.client.phone + col.weight + col.delivery_price + col.date_creation + col.status.toLowerCase() + col.comment.toLowerCase();
                return colisInfos.indexOf(search.toLowerCase()) !== -1;
            })
            colisList = filterColis.map((col) => {
            
                return (
                  
                    <tr key={col.id}>
                        <td>{col.id}</td>
                        <td>{col.tracking_number}</td>
                        <td>{col.client.full_name}</td>
                        <td>{col.client.phone}</td>
                        <td>{col.weight}</td>
                        <td>{col.delivery_price}</td>
                        <td>{col.status}</td>
                        <td>{col.comment}</td>
                        <td>{col.date_creation}</td>
                        <td>
                            <Button variant="success" size="sm" className="mr-2"
                                onClick={this.contenuColis.bind(this, col.id)}>contenu colis</Button>
                            <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteColis.bind(this, col.id,col.status)}>retirer</Button>
                        </td>
                    </tr>
                )
            })
        }
     return (
            <div>
                <Row>
                 <Col md={8}>
                     <h3><marquee direction="right">Contenu tournée numéro {idLiv}</marquee></h3>
                 </Col>
                 <Col md={{ offset: 8 }}>
                     <Form className="form-inline mt-2 mb-2">
                       <Form.Group controlId="formBasicEmail">
                         <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher colis"size="sm" />
                         <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                       </Form.Group>
                     </Form>
                   </Col>
                 </Row>
             <Table striped>
               <thead className="thead-dark">
                 <tr>
                   <th>#</th>
                   <th>Numéro Tracking</th>
                   <th>Prénom Nom</th>
                   <th>Téléphone</th>
                   <th>Poids</th>
                   <th>Prix Livraison</th>
                   <th>Status</th>
                   <th>Commentaire</th>
                   <th>Date Création</th>
                   <th>Action sur le colis</th>
                 </tr>
               </thead>
               <tbody>
                 {colisList}
               </tbody>
             </Table>
           </div>
          )
         }
        }
