import React, { Component } from 'react'
import {Jumbotron,Button} from 'react-bootstrap';
import Infos from './infos';
import TourList from '../components/tourList';
export default class Home extends Component {
    state = {
        textVisisble:false
    }
    onLearnMore(){
        this.setState({textVisisble:!this.state.textVisisble});
    };
    render() {
        return (
           <div> 
                <p></p>
                <Jumbotron className="w-90" style={{height:'265px'}}>
                <h1 className="p-3 m-1 bg-success text-white text-center">
                    Bienvenue dans votre plate-forme de livraison OuiCarry !
                </h1>
                 <p>
                 OuiCarry est une entreprise spécialisée dans la livraison des achats en ligne au niveau internationale
                 Cette plate-forme est à cet effet conçue pour permettre à nos clients vendeurs
                 de mieux interagir avec notre start-up avec comme objectif principal
                 de faciliter la collaboration.
                </p>
                </Jumbotron>
                <TourList/>
        </div> 
        )
    }
}
