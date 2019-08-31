import React, { Component } from 'react'
import http from '../services/httpService';
import CheckBox from './common/checkBox';
import {Table,Button,Form,Row,Col} from 'react-bootstrap';
import {
    apiUrl
} from '../config.json';
const apiEndpoint = apiUrl + '/article/';
const apiEndpointUpdate = apiUrl + '/article/update/';
export default class EditColis extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            produits:[],
            show:false,
            showUpdate:false,
            designation:'',
            quantity:'',
            price:'',
            size:'',
            color:'',
            id:'',
            search: '',
        }
    }
    handleAllChecked = (event) => {
        let produits = this.state.produits
        produits.forEach(produit => produit.isChecked = event.target.checked) 
        this.setState({produits: produits})
    }
    handleCheckChieldElement = (event) => {
        let produits = this.state.produits
        produits.forEach(produit => {
           if (produit.designation === event.target.value)
              produit.isChecked =  event.target.checked
        })
        this.setState({produits: produits})
      }
    deleteProduit(id){
        const mes = alert('Do you really want to delete ?')
        if(mes){
         http.delete(apiEndpointUpdate+'/'+id+'/').then((resp)=>{
           this.refreshProduits();
         });
        }
      }
      updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
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
   
    render() {
        let filterProduits = this.state.produits.filter((produit)=>{
            let produitInfos = produit.designation.toLowerCase()+produit.price+
            produit.size + produit.color.toLowerCase();
            return produitInfos.indexOf(this.state.search.toLowerCase())!==-1;
          });
        return (
            <div>
                <Row>
                    <Col >
                      <Button variant="primary" size="sm" className="mt-2 mb-2" >
                          add product(s)
                      </Button>
                    </Col>
                    <Col>
                        <Button variant="primary" size="sm" className="mt-2 mb-2" >
                            create product
                        </Button>
                    </Col>
                    <Col>
                      <Form className="form-inline mt-2 mb-2">
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder="Chercher produit"size="sm" />
                          <Button className="btn btn-outline-success my-2 my-sm-0 text-light" size="sm" type="submit">Search</Button>
                        </Form.Group>
                      </Form>
                    </Col>
                </Row>
                <h3 className="text-success"><marquee direction="right"> Choisir vos produits à mettre dans le colis</marquee></h3>
                <div className="form-check">
                    <input type="checkbox" onClick={this.handleAllChecked} className="form-check-input" id="check" value="checkedall" />
                    <label className="form-check-label" htmlFor="check">Cocher tout</label>
                </div>
                <Table striped>
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Désignation</th>
                    <th>Prix Unitaire</th>
                    <th>Taille</th>
                    <th>Couleur</th>
                  </tr>
                </thead>
                <tbody>
                   {
                    filterProduits.map((produit) => {
                        return (<CheckBox key={produit.id} handleCheckChieldElement={this.handleCheckChieldElement}  {...produit} />)
                    })
                    }
                  </tbody>
              </Table>
            </div>
                
        )
    }
}

