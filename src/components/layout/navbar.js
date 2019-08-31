import React from 'react';
import { NavLink} from 'react-router-dom';


const Navbar = ({ user,loginUser}) => {
	return (
	<React.Fragment>
		<nav className="navbar navbar-expand-lg header-color ">
        <a className="navbar-brand" href="#">Ouicarry</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<i className="fa fa-bars" aria-hidden="true"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto topnav">
                <li className="nav-item">
                <NavLink className=" nav-link" to="/">
					Home
				</NavLink>
				</li>
                <li className="nav-item">
				<NavLink className="nav-link" to="/produit">
					Produit
				</NavLink>
				</li>
                 <li className="nav-item">
				<NavLink className="nav-link" to="/client">
					Client
				</NavLink>
				</li>
                <li className="nav-item">
				<NavLink className="nav-link" to="/colis">
					Colis
				</NavLink>
				</li>
                <li className="nav-item">
				<NavLink className="nav-link" to="/livraison">
					Tournee
				</NavLink>
				</li>
				{!user && (
                    <React.Fragment>
                    <li className="nav-item">
                        <NavLink className=" nav-link" to="/login">
                            Login
                        </NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink className=" nav-link" to="/register">
                            Register
                        </NavLink>
                    </li>   
                </React.Fragment>
                )}
                {user && (
			<React.Fragment>
            <NavLink to="#" className="nav-link"id="navbarDropdown" role="button"        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {user.username}
            </NavLink>
            <NavLink className="nav-link" to="/logout">Logout</NavLink>
            </React.Fragment>
            )}
            </ul>
          </div>
        </nav>
	  </React.Fragment>
	);
};

export default Navbar;
