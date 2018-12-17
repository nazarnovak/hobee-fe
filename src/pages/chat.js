import React from "react";

const logo = require('../images/h.svg');

const styles = {
  logo: {
    position: 'absolute',
    height: '50px',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px',
  }
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundBee: false,
      searchStartTimestamp: 0,
    };

    this.handleStop = this.handleStop.bind(this);
  }

  componentDidMount() {
    this.setState( { searchStartTimestamp: Date.now() } );

    // TODO: To make work faster. Remove later
    let that = this;

    setTimeout(function() {
      that.handleStop();
    }, 4000);
  }

  handleStop() {
    let loadTime = Date.now() - this.state.searchStartTimestamp;

    this.waitRemainder(loadTime);
  }

  waitRemainder(loadTime) {
    let that = this;

    // Full animation time is 3s, so we need to make it finish the animation before proceeding
    setTimeout(function() {
      that.setState({ foundBee: true });
    }, 3000 - (loadTime % 3000));
  }

  render() {
    const { foundBee } = this.state;

    return (
        <div className={`main-content ${foundBee ? 'background-shade' : ''}`}>
          <ChatWindow foundBee={foundBee} height={this.props.height} />
          <ChatControls foundBee={foundBee} />
          <img src={logo} style={{ ...styles.logo }} alt="Logo" className={foundBee ? 'loader-animate-done' : 'loader-animate'} />
        </div>
    );
  }
}

class ChatWindow extends React.Component {
  render() {
    if (!this.props.foundBee) {
      return null;
    }

    // Extra 40 are top+bottom margin (20 x 2)
    const chatWindowHeight = (this.props.height - 110 - 40);
console.log(this.props.height, chatWindowHeight);

    return (
        <div className='chat-window fade-in' style={{ height: chatWindowHeight }}></div>
    );
  }
}

class ChatControls extends React.Component {
  render() {
    if (!this.props.foundBee) {
      return null;
    }

    return (
        <div className='chat-controls fade-in'></div>
    );
  }
}
