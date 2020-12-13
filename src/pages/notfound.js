import React from "react";
import Nav from "../nav";

export default class NotFound extends React.Component {
  render() {
    return (
        <div>
          <Nav location={this.props.location} />
          <div className="not-found">
            <h1 className="heading">42</h1>
            <p className="subheading">Just kidding, nothing meaningful here. You can find more meaning in the <a href="/chat">chat</a></p>
          </div>
        </div>
    );
  }
}
