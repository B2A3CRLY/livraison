import React, { Component } from 'react'
import http from '../services/httpService'
import {Table,Button,Modal,Form,Row,Col} from 'react-bootstrap';
import {
    apiUrl
  } from '../config.json';
import AvoidArticle from './common/avoidArticle';
const apiColisUpdate = apiUrl + '/parcel/update/';
const getColis = apiUrl + '/parcel/';
const apiColis = apiUrl + '/parcel/detail/';
const apiParcelQuantity = apiUrl + '/parcel/get_article_quantity/';
const apiParcelQuantityUpdate = apiUrl + '/parcel/update_parcel_quantity/';
export default class InfoColis extends Component {
    constructor(props, context) { 
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleShowUpdate = this.handleShowUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseUpdate = this.handleCloseUpdate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.state = {
            parcel: '',
            colis:'',
            quantity_articles:[],
            articles:[],
            show:false,
            showUpdate:false,
            designation:'',
            quantity:'',
            price:'',
            size:'',
            color: '',
            modele:'',
            id: '',
            idColis:'',
            idArticle:'',
            idClient:'',
            search:''
        };
    }
    handleChange = (e) => {
        this.setState({
           [e.target.name]: e.target.value
        })
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
    async refreshParcel() {
        const idColis = this.props.match.params.id;
        const { data: parcel } = await http.get(apiColis + idColis + '/');
        const { data:quantity_} = await http.get(apiParcelQuantity + idColis+'/');
        const { data: colisUp } = await http.get(apiColisUpdate + idColis + '/');
        const { data: allColis } = await http.get(getColis);
        this.setState({ articles: parcel.articles, quantity_articles:quantity_.data, colis:colisUp,idColis:idColis})
        console.log("Articles avant:", this.state.colis.articles);
        allColis.map((colis) => { 
          if (colis.id===parseInt(idColis)) {
             this.setState({idClient:colis.client.id})
          }
        });
      }
    
   
      componentDidMount() {
        this.refreshParcel();
      }
    onUpdate(e) {
        e.preventDefault();
        const quantity = {
          quantity:this.state.quantity,
          id_article:this.state.idArticle,
          id_parcel : this.state.idColis
       }
         http.post(apiParcelQuantityUpdate,quantity)
         .then((resp)=>{
           console.log(resp.data);
           this.refreshParcel();
           this.setState({
             quantity: '',
             showUpdate:false
            })
         });
      }
    
    deleteColisArticle(itemID) {
      const idColis = this.props.match.params.id;
      const mes = window.confirm('Do you really want to delete ?')
      if (mes) {
        const elementRemoved = {
          client: {id:this.state.idClient},
          articles:[{id:itemID}]
        }
        http.post(apiColisUpdate + idColis +'/', elementRemoved).then((resp) => {
          this.refreshParcel();
       })
      }
    }
    editArticle(id) {
        this.setState({
          idArticle: id,
          showUpdate:true
        });
    }
      updateSearch(event){
        this.setState({search:event.target.value.substr(0,20)});
    }
    render() {
      const { articles, designation, price, quantity, size, color, modele, idArticle,idColis,quantity_articles,idClient} = this.state;
        let filterArticle = null;
        let articlesList = null;
        let quantity_number = null;
        console.log(`designation:${designation},price:${price},quantité:${quantity}size:${size}color:${color}modele:${modele},idArticle:${idArticle}idColis:${idColis} article length:${articles.length}idClient:${idClient}`)
        for (var i = 0; i < quantity_articles.length; i++) {
          if (quantity_articles[i].id_article === idArticle) {
            quantity_number = quantity_articles[i].quantity;
            break;
          }
        }
        console.log('result', quantity_number)
        
        if (!articles.length) {
                    articlesList = <AvoidArticle />
                }
        else {
            filterArticle = articles.filter((article) => {
                let articleInfos = article.designation.toLowerCase() + article.price +
                    article.size + article.color.toLowerCase() + article.modele.toLowerCase() + article.date_creation + article.total_costs;
                return articleInfos.indexOf(this.state.search.toLowerCase()) !== -1;
            })
            articlesList = filterArticle.map((article) => {
            
              return (
                    
                    <tr key={article.id}>
                        <td>{article.id}</td>
                        <td>{article.designation}</td>
                        <td>{article.price} FCFA</td>
                        <td>
                          { 
                            quantity_articles.map((quantity) => (
                              <React.Fragment key={quantity.id}><span>{article.id === quantity.id_article ? quantity.quantity : ''} </span></React.Fragment>
                            )) 
                          }
                        </td>
                        <td>{isNaN(article.size) ? article.size : <span>{article.size} m</span>}</td>
                        <td>{article.color}</td>
                        <td>{article.modele}</td>
                        <td>
                            <Button variant="success" size="sm" className="mr-2"
                              onClick={this.editArticle.bind(this, article.id)}>Edit</Button>
                            <Button variant="danger" size="sm" className="mr-2" onClick={this.deleteColisArticle.bind(this,article.id)}>retirer</Button>
                        </td>
                    </tr>
                )
            })
        }
        return (
            <div>
                <Row>
                   
                    <Col md={{ offset: 8 }}>
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
                    <th>Quantité</th>
                    <th>Taille</th>
                    <th>Couleur</th>
                    <th>Adresse de livraison</th>
                    <th>actions sur produit</th>
                  </tr>
                </thead>
                <tbody>
                  {articlesList}
                </tbody>
              </Table>
              <div>
                  <Modal show={this.state.showUpdate} onHide={this.handleCloseUpdate}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success"><marquee direction="right">Modification du produit !</marquee></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form onSubmit={this.onUpdate}>
                        <div className="form-group">
                            <label>Quantité:  </label>
                            <input 
                              type="text" 
                              className="form-control"
                              placeholder= "modifier la quantité"
                              name="quantity"
                              value={this.state.quantity}
                              onChange={this.handleChange}
                              />
                        </div>
                     <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleCloseUpdate}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" className="btn btn-primary">
                        Modifier article
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
