import React from "react";
import {Route, Switch} from "react-router-dom";

import Home from "./pages/home";
import Signup from "./pages/signup";
import Chat from "./pages/chat";
import About from "./pages/about";
import Contact from "./pages/contact";
import NotFound from "./pages/notfound";

export default class Routing extends React.Component {
  render() {
    return (
      <Switch location={ this.props.location } >
        <Route path="/" exact render={() => <Home height={ this.props.height } width={ this.props.width } />} />
        <Route path="/signup" exact component={ Signup } />
        <Route path="/chat" exact component={ Chat } />
        <Route path="/about" exact component={ About } location={ this.props.location } />
        <Route path="/contact" exact component={ Contact } />
        <Route component={ NotFound } />
      </Switch>
    );
  }
}
