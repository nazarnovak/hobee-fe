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
      <div className={`main-content`}>
        <h1 className={`header`}>Contact</h1>
        <form style={{ textAlign: 'center' }}>
          <p><input type="text" placeholder="name" className={`input`} /></p>
          <p><input type="text" placeholder="email" className={`input`} /></p>
          <p><input type="text" placeholder="message" className={`input`} /></p>
          <p><input type="text" className={`input error ${err && 'visible'}`} value={ err } readOnly /></p>
          <button className={`submit-button`} onClick={this.handleFormSubmit}>Contact</button>
        </form>
      </div>
    );
  }
}
