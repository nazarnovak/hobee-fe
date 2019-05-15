import React from "react";

export default class Contact extends React.Component {
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
          <h1 className={`header`}>Contact</h1>
          <form style={{ textAlign: 'center' }}>
            {/*Reason dropdown with nice rounded corners: https://www.w3schools.com/code/tryit.asp?filename=FYMRDTDV2KDM*/}
            <p><input type="text" placeholder="name" className={`auth-input`} /></p>
            <p><input type="text" placeholder="email" className={`auth-input`} /></p>
            <p><textarea className={`auth-textarea`} placeholder="message" rows="7"></textarea></p>
            <p><input type="text" className={`error-auth ${err && 'visible'}`} value={ err } readOnly /></p>
            <button className={`submit-button`} onClick={this.handleFormSubmit}>Contact</button>
          </form>
        </div>
      </div>
    );
  }
}
