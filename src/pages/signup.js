import React from "react";
import { Link } from "react-router-dom";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: '',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (this.state.err === '') {
      this.setState({ err: 'Error occured!' });
      return
    }

    this.setState({ err: '' });
  }

  render() {
    const { err } = this.state;

    return (
      <div className="main-content background-shade-darker">
        <div className="auth-page">
          <h1 className={`header`}>Sign up</h1>
          <form style={{ textAlign: 'center' }}>
            <p><input type="text" placeholder="email" className={`input`} /></p>
            <p><input type="password" placeholder="password" className={`input`} /></p>
            <p><input type="text" className={`input error ${err && 'visible'}`} value={ err } readOnly /></p>
            <button className={`submit-button`} onClick={this.handleFormSubmit}>Sign up</button>
          </form>
        </div>
        <div className="or">
          <Link to="/login">I have an account</Link>
        </div>
      </div>
    );
  }
}
