import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

// This helps know when the page is changed, since the whole thing is a single page application sort of with react
// router
import WithRouterContainer from './WithRouterContainer';

import Nav from './nav';

// Separate pages
import NotFound from './pages/notfound';
import Home from './pages/home';
import Login from './pages/login';
import About from './pages/about';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      height: window.innerHeight,
      width: window.innerWidth
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({ width: window.innerWidth, height: window.innerHeight});
  }

  handleRouteChange(newLocation) {
    this.setState({ location: newLocation});
  }

  render() {
    return (
      <BrowserRouter>
        <WithRouterContainer onRouteChange={newLocation => this.handleRouteChange(newLocation)}>
          <Nav height={this.state.height} width={this.state.width} location={this.state.location}/>
          <Switch>
              <Route path="/" exact render={()=><Home height={this.state.height} width={this.state.width} />}/>
              <Route path="/login" exact component={Login} />
              <Route path="/about" exact component={About} />
              <Route component={NotFound} />
          </Switch>
        </WithRouterContainer>
      </BrowserRouter>
    );
  }
}

export default App;
