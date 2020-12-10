import React from "react";
// import MediaQuery from 'react-responsive';
import { Link } from "react-router-dom";

// const colorBlack = '#000000';
// const colorWhite = '#FFFFFF';
// const colorMediumBlue = '#0000CD';
// const colorBlueSoft = '#0074d9';
// const colorBlueDarker = '#005299';

const logo = require('./images/s.svg');

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: window.location,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ location: nextProps.location });
  // }

  render() {
    // let signupVisible = true;
    // let pathname = this.state.location.pathname;

    // Don't show signup button in signup page
    // Hack: temporarily don't show it on /chat as well
    // if (pathname === "/chat") {
    //   signupVisible = false;
    // }

    return (
      <div className="nav-height">
        <div className="nav nav-height">
          <Link className="logo-link logo-height" to="/" >
            <img className="logo logo-height" src={logo} alt="Logo" />
          </Link>
          {/*<ChatButton visible={signupVisible} />*/}
        </div>
      </div>
    );
  }
}

// class SignupButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hover: false,
//     };
//
//     this.onMouseEnter = this.onMouseEnter.bind(this);
//     this.onMouseLeave = this.onMouseLeave.bind(this);
//   }
//
//   onMouseEnter() {
//     this.setState({ hover: true });
//   }
//
//   onMouseLeave() {
//     this.setState({ hover: false });
//   }
//
//   render() {
//     return (
//         <div style={{ position: 'absolute', top: '18px', right: this.props.margin }}>
//           <Link to="/signup">
//             <button className={`sign-up-button ${this.props.visible ? '' : 'fade'}`} style={{ width: this.props.width }}>
//               Sign up
//             </button>
//           </Link>
//         </div>
//     );
//   }
// }
//
// class ChatButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hover: false,
//     };
//
//     this.onMouseEnter = this.onMouseEnter.bind(this);
//     this.onMouseLeave = this.onMouseLeave.bind(this);
//   }
//
//   onMouseEnter() {
//     this.setState({ hover: true });
//   }
//
//   onMouseLeave() {
//     this.setState({ hover: false });
//   }
//
//   render() {
//     return (
//         <div className="chat-button-link-wrapper">
//           <Link to="/chat">
//             <button className={`chat-button-link scale${this.props.visible ? '' : ' fade'}`}>
//               Chat
//             </button>
//           </Link>
//         </div>
//     );
//   }
// }