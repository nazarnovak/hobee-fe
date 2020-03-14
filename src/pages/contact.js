import React from "react";

import Nav from "../nav";

const svgCircleCheckmark = require('../images/circle_checkmark.svg');

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: '',
      sent: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let message = document.getElementById('message').value;

    if (name == "") {
      this.setState({ err: 'Please provide your name' });
      return false;
    }

    if (email == "") {
      this.setState({ err: 'Please provide your email' });
      return false;
    }

    if (message == "") {
      this.setState({ err: 'Please provide your message' });
      return false;
    }

    let url = "/api/contact";
    let json;

    let params = {
      name,
      email,
      message
    };

    try {
      let response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.error) {
      this.setState({ err: json.msg });
      return false;
    }

    this.setState({ err: '', sent: true });
  }

  render() {
    const { err } = this.state;

    return (
      <div>
        <Nav location={this.props.location} />
        <div className="main-content">
          <div className="auth-page">
            <h1 className={`heading`}>Contact</h1>
              <form className={`contact-form` + (this.state.sent ? '' : ' visible')}>
                {/*Reason dropdown with nice rounded corners: https://www.w3schools.com/code/tryit.asp?filename=FYMRDTDV2KDM*/}
                <input id="name" type="text" placeholder="name*" className={`auth-input`} />
                <input id="email" type="text" placeholder="email*" className={`auth-input`} />
                <textarea id="message" placeholder="message*" className={`auth-textarea`} rows="7"></textarea>
                <input type="text" className={`error-auth ${err && 'visible'}`} value={ err } readOnly />
                <button className={`submit-button`} onClick={this.handleFormSubmit}>Contact</button>
              </form>
            <div className={`contact-success`  + (this.state.sent ? ' visible' : '')}>
              <img className="contact-success-checkmark" src={svgCircleCheckmark} alt="Success"></img>
              <h1 className="contact-success-heading">Thank you for your feedback</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
