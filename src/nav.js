import React from "react";
// import MediaQuery from 'react-responsive';
import { Link } from "react-router-dom";

// const colorBlack = '#000000';
// const colorWhite = '#FFFFFF';
// const colorMediumBlue = '#0000CD';
const colorBlueSoft = '#0074d9';
const colorBlueDarker = '#005299';

const styles = {
  nav: {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 2px -2px',
    height: '70px',
    padding: '0 50px',
    textAlign: 'center',
    zIndex: '2',
  },
  logo: {
    height: '50px',
    marginTop: '10px',
    outline: 'none',
  },
  signUp: {
    backgroundColor: colorBlueSoft,
    border: '1px solid ' + colorBlueSoft,
    borderRadius: '30px',
    color: '#f3f3f3',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '500',
    height: '40px',
    outline: 'none',
    width: '120px',
    transition: 'all 0.2s ease-in-out',
  },
  signUpHover: {
    backgroundColor: colorBlueDarker,
    border: '1px solid ' + colorBlueDarker,
    color: '#ffffff',
    transition: 'all 0.2s ease-in-out',
  }
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
    let buttonWidth = '130px';
    let sideMargin = '50px';

    switch(true) {
    case this.props.width < 500:
        buttonWidth = '100px';
        sideMargin = '10px';
        break;
    case this.props.width < 800:
        buttonWidth = '110px';
        sideMargin = '30px';
        break;
    default:
        buttonWidth = '130px';
        sideMargin = '50px';
    }

    let signupButton = undefined;
    let pathname = this.state.location.pathname;

    // Don't show signup button in signup page
    if (pathname !== "/signup") {
      signupButton = <SignupButton margin={sideMargin} width={buttonWidth}/>
    }

    return (
      <div style={{ ...styles.nav, position: 'relative', paddingLeft: sideMargin, paddingRight: sideMargin}}>
        <Link to="/">
          <img src={logo} style={{...styles.logo}} alt="Logo" />
        </Link>
        {signupButton}
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
        <div style={{ position: 'absolute', top: '15px', right: this.props.margin }}>
          <Link to="/signup">
            <button style={{...styles.signUp, width: this.props.width,
              ...(this.state.hover ? styles.signUpHover : undefined)}} onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}>
              Sign up
            </button>
          </Link>
        </div>
    );
  }
}
