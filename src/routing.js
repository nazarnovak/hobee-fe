import React from "react";
import {Route, Switch} from "react-router-dom";

import Home from "./pages/home";
import Chat from "./pages/chat";
import Contact from "./pages/contact";
import How from "./pages/how";
import Why from "./pages/why";
import NotFound from "./pages/notfound";
// import Signup from "./pages/signup";
// import Login from "./pages/login";
// import About from "./pages/about";
// import History from "./pages/history";

export default class Routing extends React.Component {
  render() {
    return (
      <Switch location={ this.props.location } >
        <Route path="/" exact render={() => <Home height={ this.props.height } width={ this.props.width } />}
               location={ this.props.location } />
        <Route path="/chat" exact render={() => <Chat height={ this.props.height } width={ this.props.width }
          location={ this.props.location } />} />
        <Route path="/contact" exact render={() => <Contact location={ this.props.location } />} />
        <Route path="/how" exact component={ How } location={ this.props.location } />
        <Route path="/why" exact component={ Why } location={ this.props.location } />
        {/*<Route path="/history" exact render={() => <History />} />*/}
        {/*<Route path="/about" exact component={ About } location={ this.props.location } />*/}
        {/*<Route path="/signup" exact component={ Signup } />*/}
        {/*<Route path="/login" exact component={ Login} />*/}
        <Route component={ NotFound } />
      </Switch>
    );
  }
}
