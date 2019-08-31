import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import auth from "./services/authService";
import Navbar from "./components/layout/navbar";
import NotFound from "./components/notFound";
import LoginForm from "./components/loginForm";
import registerForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import Client from "./components/client";
import Home from "./components/home";
import Colis from "./components/colis";
import Produit from "./components/produit";
import Livraison from "./components/livraison";
import AddColis from "./components/addColis";
import "./custom.css";
import AddProductColis from "./components/addProductColis";
import ContenuLivraison from "./components/contenuLivraison";
import AddColisLivraison from "./components/addColisLivraison";
import InfoColis from "./components/infoColis";
import EditParcel from "./components/editParcel";
let hours = 120; // Reset when storage is more than 72hours
let now = new Date().getTime();

var setupTime = localStorage.getItem("setupTime");
if (setupTime == null) {
  localStorage.setItem("setupTime", now);
} else {
  if (now - setupTime > hours * 60 * 60 * 1000) {
    localStorage.clear();
    localStorage.setItem("setupTime", now);
  }
}

class App extends Component {
  state = {};
  async componentDidMount() {
    const user = await auth.getCurrentUser();
    const loginUser = await auth.getUserObject();
    console.log("userObject ", loginUser);
    this.setState({ user, loginUser });
  }
  render() {
    const { user, loginUser } = this.state;
    return (
      <React.Fragment>
        <Router>
          <Navbar user={user} loginUser={loginUser} />
          <main className="container-fluid">
            <Switch>
              <ProtectedRoute exact path="/" component={Home} />
              <Route path="/register" component={registerForm} />
              <Route path="/login" component={LoginForm} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute
                exact
                path="/addColis/livraison/:id"
                component={AddColisLivraison}
              />
              <ProtectedRoute
                exact
                path="/contenu/livraison/:id"
                component={ContenuLivraison}
              />
              <ProtectedRoute exact path="/addColis" component={AddColis} />
              <ProtectedRoute
                exact
                path="/colis/:id"
                component={AddProductColis}
              />
              <ProtectedRoute
                exact
                path="/edit/colis/:id"
                component={EditParcel}
              />
              <ProtectedRoute
                exact
                path="/contenu/colis/:id"
                component={InfoColis}
              />
              <ProtectedRoute path="/client" component={Client} />
              <ProtectedRoute path="/colis" component={Colis} />
              <ProtectedRoute path="/livraison" component={Livraison} />
              <ProtectedRoute path="/produit" component={Produit} />
              <Route path="/not-found" component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </main>
        </Router>
      </React.Fragment>
    );
  }
}
export default App;
