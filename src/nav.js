import React from "react";
// import MediaQuery from 'react-responsive';
import { Link } from "react-router-dom";

// const colorBlack = '#000000';
const colorWhite = '#FFFFFF';
const colorMediumBlue = '#0000CD';
const colorBlueSoft = '#0074d9';
const colorBlueDarker = '#005299';

const styles = {
  nav: {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 2px -2px',
    height: '70px',
    padding: '0 50px',
    textAlign: 'center',
  },
  logo: {
    height: '50px',
    marginTop: '10px',
    outline: 'none',
  },
  logIn: {
    backgroundColor: colorBlueSoft,
    border: '1px solid ' + colorBlueSoft,
    borderRadius: '30px',
    color: '#f3f3f3',
    cursor: 'pointer',
    fontSize: '20px',
    height: '50px',
    outline: 'none',
    width: '150px',
    transition: 'all 0.2s ease-in-out',
  },
  logInHover: {
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
    this.state = {hover: false};

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
    let buttonWidth = '150px';
    let sideMargin = '50px';

    switch(true) {
    case this.props.width < 500:
        buttonWidth = '110px';
        sideMargin = '10px';
        break;
    case this.props.width < 800:
        buttonWidth = '130px';
        sideMargin = '30px';
        break;
    }

    return (
      <div style={{ ...styles.nav, position: 'relative', paddingLeft: sideMargin, paddingRight: sideMargin}}>
        <div style={{margin: '0px auto'}}>
          <Link to="/">
            <img src={logo} style={{...styles.logo}} alt={'Logo'} />
          </Link>
        </div>
        <div style={{position: 'absolute', top: '10px', right: sideMargin}}>
          <Link to="/login">
            <button style={{...styles.logIn, width: buttonWidth, ...(this.state.hover ? styles.logInHover : undefined)}}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}>
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
