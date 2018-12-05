import React from "react";

const styles = {
  container: {
    margin: '0 auto',
    padding: '50px',
    backgroundColor: '#eee',
    height: '200px',
  },
  header: {
    textAlign: 'center',
  }
}

export default class Signup extends React.Component {
  render() {
    return (
      <div style={{ ...styles.container }}>
        <h1 style={{ ...styles.header }}>Signup</h1>
      </div>
    );
  }
}
