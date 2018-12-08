import React from "react";

const colorBlueLight = '#e6f3ff';
const colorBlueSemiLight = '#b3daff';
const colorBlueSoft = '#0074d9';

const styles = {
  container: {
    left: '0',
    right: '0',
    margin: '0 auto',
    padding: '20px',
    height: '200px',
    width: '500px',
    position: 'absolute',
    top: '100px',
    zIndex: '1',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  input: {
    height: '30px',
    width: '250px',
    borderRadius: '30px',
    // backgroundColor: colorBlueLight,
    padding: '0 15px',
    outline: 'none',
  },
  // inputActive: {
  //   backgroundColor: colorBlueSemiLight,
  // }
  signUpButton: {
    borderRadius: '30px',
    color: '#fff',
    fontSize: '14px',
    height: '30px',
    width: '150px',
    backgroundColor: colorBlueSoft,
    outline: 'none',
  }
}

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
      <div style={{ ...styles.container }}>
        <h1 style={{ ...styles.header }}>Sign up</h1>
        <form style={{ textAlign: 'center' }}>
          <p><input type="text" placeholder="email" style={{ ...styles.input }} /></p>
          <p><input type="password" placeholder="password" style={{ ...styles.input }} /></p>
          <p><input type="text" style={{ ...styles.input }} className={`error ${err && 'visible'}`} value={ err } readOnly /></p>
          <button style={{ ...styles.signUpButton }} onClick={this.handleFormSubmit}>Sign up</button>
        </form>
      </div>
    );
  }
}
