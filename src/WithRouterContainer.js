import React from "react";
import { withRouter } from 'react-router';

class WithRouter extends React.Component {
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      this.props.onRouteChange(location);
    });
  }

  componentWillUnmount() {
      this.unlisten();
  }

  componentDidMount() {
    this.props.onRouteChange(this.props.location);
  }

  render() {
     return (
         this.props.children
     );
  }
}

export default withRouter(WithRouter);
