import React from "react";

export default class Height extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
          <div style={{ width: '100%', height: '40%', backgroundColor: 'red' }}></div>
          <div style={{ width: '100%', height: '40%', backgroundColor: 'green' }}></div>
          <div style={{ width: '100%', height: '20%', backgroundColor: 'blue' }}></div>
        </div>
    );
  }
}
