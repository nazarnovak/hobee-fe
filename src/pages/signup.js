import React from "react";

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
      <div className={`main-content`} style={{ height: '200px', width: '500px' }}>
        <h1 className={`header`}>Sign up</h1>
        <form style={{ textAlign: 'center' }}>
          <p><input type="text" placeholder="email" className={`input`} /></p>
          <p><input type="password" placeholder="password" className={`input`} /></p>
          <p><input type="text" className={`input error ${err && 'visible'}`} value={ err } readOnly /></p>
          <button className={`submit-button`} onClick={this.handleFormSubmit}>Sign up</button>
        </form>
      </div>
    );
  }
}
