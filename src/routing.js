import React from "react";
import {Route, Switch} from "react-router-dom";

import Home from "./pages/home";
import Signup from "./pages/signup";
import About from "./pages/about";
import NotFound from "./pages/notfound";

export default class Routing extends React.Component {
  render() {
    return (
      <Switch location={this.props.location}>
        <Route path="/" exact render={() => <Home height={this.props.height} width={this.props.width} />} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/about" exact component={About} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}