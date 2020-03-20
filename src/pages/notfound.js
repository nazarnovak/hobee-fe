import React from "react";
import Nav from "../nav";

export default class NotFound extends React.Component {
  render() {
    return (
        <div>
          <Nav location={this.props.location} />
          <div className="not-found">
            <h1>Page not found</h1>
          </div>
        </div>
    );
  }
}
