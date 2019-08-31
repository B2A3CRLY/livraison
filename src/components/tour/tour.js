import React, { Component } from 'react';
import './tour.scss';
import { Modal,Button } from 'react-bootstrap';
export default class Tour extends Component {
    state ={
        show:false
    }
    handleInfo =()=>{
        this.setState({
            show:!this.state.show
        })
    }
    handleClose =()=> {
        this.setState({ show: false });
      }
    render() {
        const {id,city,img,name,info} = this.props.tour;
        const {removeTour} = this.props;
        return (
            <article className="tour">
              <div className="img-container">
                  <img src={img} alt="" className="card-img-top"/>
                  <span className="close-btn" onClick={()=>{removeTour(id)}}>
                      <i className="fas fa-window-close"/>
                  </span>
              </div>
              <div className="tour-info">
                  <h3>{city}</h3>
                  <h4>{name}</h4>
                  <h5>info{""}
                    <span onClick={this.handleInfo}>
                        <i className="fas fa-caret-square-down"/>
                    </span>
                  </h5>
                </div>
                <div>
                  <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success">
                    Information sur {name}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <strong>{info}</strong>
                     <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                     </Modal.Footer>
                  </Modal.Body>
                 </Modal>
               </div>
                
            </article>
        )
    }
}
