import React from 'react';
import joi from 'joi-browser';
import Form from './common/form';
import * as userService from '../services/userService';
import auth from '../services/authService';
import { NavLink } from 'react-router-dom';

class RegisterForm extends Form {
	state = {
		data: { email: '', password: '', username: '', first_name:'', last_name:'' },
		errors: {}
	};
	schema = {
		email: joi.string().email({ minDomainAtoms: 2 }),
		password: joi.string().min(5).regex(/^[a-zA-Z0-9]{3,30}$/),
		username: joi.string().required(),
		first_name: joi.string().required(),
		last_name: joi.string().required()
	};
	doSubmit = async () => {
		try {
			const { data } = await userService.register(this.state.data);
			auth.loginWithJwt(data.token);
			window.location = '/';
		} catch (error) {
			if (error.response && error.response.status === 400) {
				const errors = { ...this.state.errors };
				// errors.email = error.response.data;
				errors.non_field_errors = error.response.data;
				this.setState({ errors });
				console.log('erreur ', errors);
			}
		}
	};
	render() {
		console.log('first_name',this.state.first_name,'email',this.state.email)
			return(
			<div>
				<div className="row">
					<div className="col-md-3"></div>
					<div className="card mt-4 col-md-6">
						<h2>Création d'un nouveau compte</h2>
						<form onSubmit={this.handleSubmit}>
							<span className="input-group-addon"><i className="fas fa-restroom"></i></span>
							{this.renderInput('first_name', 'Prénom', 'text', '', 'Enter your first name')}
							<span className="input-group-addon"><i className="fas fa-signature"></i></span>
							{this.renderInput('last_name', 'Nom', 'text','','Enter your last name')}
							<span className="input-group-addon"><i className="fa fa-user fa-fw mb-2"></i></span>
							{this.renderInput('username', 'Username', 'text','','Enter your username')}
							<span className="input-group-addon"><i className="fa fa-key fa-fw mb-2"></i></span>
							{this.renderInput('password', 'Password', 'password','','Enter your password')}
							<span className="input-group-addon"><i className="fa fa-envelope-square fa-fw fa-1x"></i></span>
							{this.renderInput('email', 'Email','','','Enter your email address')}
							{this.renderButton('Register')}
							<NavLink className=" nav-link text-primary" to={"/login"}>Se connecter</NavLink>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default RegisterForm;
