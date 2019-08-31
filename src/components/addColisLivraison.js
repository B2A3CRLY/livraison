import React, { Component } from 'react'
import http from '../services/httpService';
import CheckBox from './common/checkBox';
import {Table,Button,Form,Row,Col} from 'react-bootstrap';
import {
    apiUrl
} from '../config.json';
const apiEndpoint = apiUrl + '/parcel/';
const apiLiv = apiUrl + '/delivery/';

export default class AddColisLivraison extends Component {
   constructor(props, context) {
      super(props, context)
      this.state = {
         colis: [],
         show:false,
         showUpdate: false,
         id:'',
         search: '',
         tracking_number: '',
         weight:'',
         status: '',
         delivery_price:''
      }
   }
   handleAllChecked = (event) => {
      let colis = this.state.colis
      colis.forEach(colis => colis.isChecked = event.target.checked) 
      this.setState({colis: colis})
   }
   handleCheckChieldElement = (event) => {
      let colis = this.state.colis
      colis.forEach(col => {
         if (col.tracking_number === event.target.value)
            col.isChecked =  event.target.checked
      })
      this.setState({ colis: colis })
      console.log('col',this.state.colis)
   }
   updateSearch(event){
      this.setState({search:event.target.value.substr(0,20)});
    }
   refreshColis(){
         http.get(apiEndpoint).then((res)=>{
         this.setState({
            colis: res.data
         })
         const filterColis = this.state.colis.filter(col => col.isChecked !== true)
         this.setState({colis:filterColis})
      });
   }
   canBeSubmitted() {
      let isTrue = false;
      this.state.colis.forEach(col => {
         if (col.isChecked === true) {
            isTrue = true;
         }
      })
      return isTrue
   }
  
   onSubmit = (e) => {
      const idTournee = this.props.match.params.id;
      e.preventDefault();
      const colis = {
         parcels: []
      }
      this.state.colis.forEach(col => {
         if (col.isChecked === true) {
            colis.parcels.push({ id: col.id })
            const upcolis = {
               isChecked: true,
               client: { id: col.client.id },
               articles:[]
            }
            http.put(apiEndpoint + 'update/' + col.id + '/',upcolis)
         }
      })
      http.put(apiLiv+'update/'+idTournee+'/',colis)
      .then(res => {
         console.log('data ', res.data);
         if (res.data.id) {
            alert('colis ajouté(s) avec succées')
            this.refreshColis();
         }
      });
   }
   componentDidMount(){
      this.refreshColis();
  }
   render() {
      const { colis, search } = this.state;
      const isEnabled = this.canBeSubmitted();
      console.log('colis checked:',colis,'isEnabled',isEnabled)
      let filterColis = colis.filter((colis)=>{
         let colisInfos = colis.tracking_number.toLowerCase() + colis.delivery_price +
            colis.status.toLowerCase() + colis.weight;
         return colisInfos.indexOf(search.toLowerCase())!==-1;
      });
  return (
               <div>
                  <Row>
                  <Col md={{ offset: 4 }}>
                     <Form className="form-inline mt-2 mb-2">
                        <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" value={search} onChange={this.updateSearch.bind(this)} placeholder="Chercher produit"size="sm" />
                        <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                        </Form.Group>
                     </Form>
                  </Col>    
               </Row>
               <form onSubmit={this.onSubmit}>
                   <Button variant="primary" type="submit" size="sm" className="btn btn-primary mt-2 mb-2" disabled={!isEnabled}>
                     Ajouter les colis
                  </Button>
                <Table striped>
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th></th>
                    <th>Numéro Tracking</th>
                    <th>Prénom Nom</th>
                    <th>Téléphone</th>
                    <th>Poids Colis</th>
                    <th>Status</th>
                    <th>Prix Livraison</th>
                    <th>Date Création</th>
                  </tr>
                </thead>
                <tbody>
                   {
                    filterColis.map((colis) => {
                        return (<CheckBox key={colis.id} handleCheckChieldElement={this.handleCheckChieldElement} {...colis} />)
                    })
                   }
                     
                  </tbody>
               </Table>
               </form>
            </div>
       )
     }
  }
