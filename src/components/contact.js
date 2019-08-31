import React, { Component } from 'react';
import { Grid, Cell, List, ListItem, ListItemContent } from 'react-mdl';



class Contact extends Component {
  render() {
    return(
      <div className="contact-body">
        <Grid className="contact-grid">
          <Cell col={6}>
            <h2>Bienvenue à OuiCarry</h2>
              <img
                src="http://www.ouicarry.com/wp-content/uploads/2016/07/logo-ouicarry.png"
                alt="avatar"
                style={{height: '250px',width:'250px'}}
               />
                <p className="text-success" style={{ width: '100%', margin: 'auto', paddingTop: '1em'}}>
                OuiCarry est une jeune entreprise sénégalaise offrant 
                un service logistique complet permettant à tout client 
                au Sénégal, particulier ou entreprise, de passer commande 
                sur tout site marchand sur internet et de se faire livrer 
                ses colis à sa porte de domicile ou de bureau. OuiCarry est
                le premier investissement réalisé par Teranga Capital, 
                fonds d'impact sénégalais sponsorisé par I&P.
              </p>
          </Cell>
        </Grid>
      </div>
    )
  }
}

export default Contact;
