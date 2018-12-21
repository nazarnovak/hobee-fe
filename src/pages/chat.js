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
this.setState({ foundBee: true });
return;
    let that = this;

    setTimeout(function() {
      that.handleStop();
    }, 2000);
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

    const messages = [
      {
        "sender": 0,
        "message": 'Hi 😋'
      },
      {
        "sender": 1,
        "message": 'Heya'
      },
      {
        "sender": 1,
        "message": `How's it going?`
      },
      {
        "sender": 0,
        "message": `Pretty good, what about yourself?`
      },
      {
        "sender": 1,
        "message": `Yeah, I'm doing fantastic! Thanks for asking!`
      },
      {
        "sender": 0,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      },
      {
        "sender": 1,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      },
      {
        "sender": 0,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      },
      {
        "sender": 1,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      },
        {
        "sender": 0,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      },
      {
        "sender": 1,
        "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      }
    ];

    return (
        <div className={`main-content ${foundBee ? 'background-shade-darker' : ''}`}>
          <ChatWindow foundBee={foundBee} height={this.props.height} messages={messages}/>
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

    // Extra 20 are top+bottom margin (20 + 20)
    const chatWindowHeight = (this.props.height - 110 - 40);

    // - paddings top+bottom 20 + 20
    const chatWindowInnerHeight = chatWindowHeight - 40;

    const messageItems = this.props.messages.map((message) =>
      <div className={`${ message.sender === 0 ? 'your-message-container' : 'my-message-container'}`}>
        <div className={`chat-message ${ message.sender === 0 ? 'your-message' : 'my-message' }`}>{message.message}</div>
      </div>
    );

    return (
        <div className='chat-window-outer fade-in' style={{ height: chatWindowHeight }}>
          <div className='chat-window fade-in' style={{ height: chatWindowInnerHeight }}>
            {messageItems}
          </div>
        </div>
    );
  }
}

class ChatControls extends React.Component {
  render() {
    if (!this.props.foundBee) {
      return null;
    }

    return (
        <div className='chat-controls fade-in'>
          <input type="text" placeholder="Message..." className={`chat-input`} />
        </div>
    );
  }
}
