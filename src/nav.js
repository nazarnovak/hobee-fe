import React from "react";
// import MediaQuery from 'react-responsive';
import { Link } from "react-router-dom";

// const colorBlack = '#000000';
// const colorWhite = '#FFFFFF';
// const colorMediumBlue = '#0000CD';
// const colorBlueSoft = '#0074d9';
// const colorBlueDarker = '#005299';

const styles = {
  nav: {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 2px 0px',
    zIndex: '2',
    width: '100%',
    position: 'absolute',
  },
  logo: {
    outline: 'none',
  },
}

const logo = require('./images/h.svg');

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: window.location,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ location: nextProps.location });
  }

  render() {
    let navHeight = '7vh';
    let logoHeight = '4vh';
    let logoMarginTop = '1.5vh';

    // Make nav smaller when we're in chat mode
    if (window.location.pathname === "/got") {
      navHeight = '10%';
      logoHeight = '70%';
    }

    let signupVisible = true;
    let pathname = this.state.location.pathname;

    // Don't show signup button in signup page
    // Hack: temporarily don't show it on /chat as well
    if (pathname === "/signup" || pathname === "/chat") {
      signupVisible = false;
    }

    return (
      <div style={{ height: navHeight}}>
        <div style={{ ...styles.nav, height: navHeight}}>
          <Link to="/" style={{ height: '100%'}}>
            <div style={{ height: '15%' }}></div>
            <img src={logo} style={{ ...styles.logo, height: logoHeight, width: '100%'}} alt="Logo" />
          </Link>
          {/*<SignupButton margin={sideMargin} width={buttonWidth} visible={signupVisible} />*/}
        </div>
      </div>
    );
  }
}

class SignupButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({ hover: true });
  }

  onMouseLeave() {
    this.setState({ hover: false });
  }

  render() {
    return (
        <div style={{ position: 'absolute', top: '18px', right: this.props.margin }}>
          <Link to="/signup">
            <button className={`sign-up-button ${this.props.visible ? '' : 'fade'}`} style={{ width: this.props.width }}>
              Sign up
            </button>
          </Link>
        </div>
    );
  }
}
