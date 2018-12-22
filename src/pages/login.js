import React from "react";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      err: 'Error occured!',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.setState({ hasError: !this.state.hasError });
  }

  render() {
    const { hasError, err } = this.state;

    return (
      <div className="main-content background-shade-darker">
        <div className="auth-page">
          <h1 className={`header`}>Log in</h1>
          <form style={{ textAlign: 'center' }}>
            <p><input type="text" placeholder="email" className={`auth-input`} /></p>
            <p><input type="password" placeholder="password" className={`auth-input`} /></p>
            <p><input type="text" className={`error-auth ${hasError ? 'visible' : ''}`} value={ err } readOnly /></p>
            <button className={`submit-button`} onClick={this.handleFormSubmit}>Log in</button>
          </form>
        </div>
        <div className="or">
          <Link to="/signup"> I don't have an account</Link>
        </div>
        <div className="or">
          <Link to="/login"> I have forgotten my password</Link>
        </div>
      </div>
    );
  }
}
