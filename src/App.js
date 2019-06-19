import React from "react";
import { BrowserRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group'

// This helps know when the page is changed, since the whole thing is a single page application sort of with react
// router
import WithRouterContainer from './WithRouterContainer';

// Routing table
import Routing from './routing';
import Nav from './nav';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: window.location,
      height: window.innerHeight,
      width: window.innerWidth
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    this.setState({ width: window.innerWidth, height: window.innerHeight});
  }

  handleRouteChange(newLocation) {
    this.setState({ location: newLocation });
  }

  render() {
    return (
      <BrowserRouter>
        <WithRouterContainer onRouteChange={newLocation => this.handleRouteChange(newLocation)}>
          <Nav style={{ height: '10%' }} height={this.state.height} width={this.state.width} location={this.state.location} />
          <TransitionGroup>
            <CSSTransition
                  key={this.state.location.pathname}
                  classNames="fade"
                  in={true}
                  appear={true}
                  timeout={{ appear: 1000, enter: 1000, exit: 1000}}
            >
              <Routing height={this.state.height} width={this.state.width} location={this.state.location} />
            </CSSTransition>
          </TransitionGroup>
        </WithRouterContainer>
      </BrowserRouter>
    );
  }
}
