import React from "react";
import {Route, Switch} from "react-router-dom";

import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/chat";
import About from "./pages/about";
import Contact from "./pages/contact";
import History from "./pages/history";
import NotFound from "./pages/notfound";

export default class Routing extends React.Component {
  render() {
    return (
      <Switch location={ this.props.location } >
        <Route path="/" exact render={() => <Home height={ this.props.height } width={ this.props.width } />}
               location={ this.props.location } />
        <Route path="/chat" exact render={() => <Chat height={ this.props.height } width={ this.props.width }
          location={ this.props.location } />} />
        <Route path="/contact" exact render={() => <Contact location={ this.props.location } />} />
        {/*<Route path="/history" exact render={() => <History />} />*/}
        {/*<Route path="/about" exact component={ About } location={ this.props.location } />*/}
        {/*<Route path="/signup" exact component={ Signup } />*/}
        {/*<Route path="/login" exact component={ Login} />*/}
        <Route component={ NotFound } />
      </Switch>
    );
  }
}
