import React, { Component } from 'react'

export default class Infos extends Component {
    render() {
        return (
            <div>
            <marquee behavior="alternate" >
             <p className="text-success">
             OuiCarry est un transitaire qui propose des services logistiques sur mesure pour les professionnels. Transitaire door to door,
             OuiCarry se charge de livrer vos marchandises et/ou vos équipements au Sénégal et en Afrique de l’Ouest.
             Commandez votre matériel informatique, vos équipements agricoles, vos fournitures de bureau, vos outils industriels, etc… 
             En tant que transitaire, notre service complet assure le transport, le dédouanement et livraison dernier km. Recevez en toute 
             simplicité vos commandes avec votre transitaire OuiCarry
             </p>
            </marquee>
            </div>
        )
    }
}
