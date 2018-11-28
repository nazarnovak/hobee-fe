import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Nav from './nav';

// Separate pages
import NotFound from './notfound';
import Home from './home';
import About from './about';

// TODO list:
// 1) Move all the colors to a single colors.js to reuse easily throughout the system?
// 2)

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: window.innerWidth, height: window.innerHeight};

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

  render() {
    return (
      <Router>
        <div>
          <Nav height={this.state.height} width={this.state.width} />
          <Switch>
              <Route path="/" exact render={()=><Home height={this.state.height} width={this.state.width} />}/>
              <Route path="/about" exact component={About} />
              <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
