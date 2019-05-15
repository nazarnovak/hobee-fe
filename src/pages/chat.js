import React from "react";

// const logo = require('../images/h.svg');
//
// const styles = {
//   logo: {
//     position: 'absolute',
//     height: '50px',
//     top: '50%',
//     left: '50%',
//     margin: '-25px 0 0 -25px',
//   }
// }

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.setState({ messages: this.props.messages });
    }
  }

  render() {
    // const messages = [
      // {
      //   "sender": 0,
      //   "message": 'Hi 😋'
      // },
      // {
      //   "sender": 1,
      //   "message": 'Heya'
      // },
      // {
      //   "sender": 1,
      //   "message": `How's it going?`
      // },
      // {
      //   "sender": 0,
      //   "message": `Pretty good, what about yourself?`
      // },
      // {
      //   "sender": 1,
      //   "message": `Yeah, I'm doing fantastic! Thanks for asking!`
      // },
      // {
      //   "sender": 0,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      // },
      // {
      //   "sender": 1,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      // },
      // {
      //   "sender": 0,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      // },
      // {
      //   "sender": 1,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      // },
      //   {
      //   "sender": 0,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
      // },
      // {
      //   "sender": 1,
      //   "message": `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`,
      // }
    // ];

    return (
        <div className={`main-content background-shade-darker`}>
          <ChatWindow height={800} messages={ this.state.messages } />
          <ChatControls websocket={this.props.websocket} />
        </div>
    );
  }
}

class ChatWindow extends React.Component {
  render() {
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
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      let input = document.getElementsByTagName('input')[0];
      let text = input.value;

      var o = {
        type: "o",
        text: text,
      };

      this.props.websocket.send(JSON.stringify(o));

      console.log("Sent message:", text);
      input.value = '';
    }
  }

  render() {
    return (
        <div className='chat-controls fade-in'>
          <input type="text" placeholder="Message..." className={`chat-input`} onKeyDown={this.handleKeyDown} />
        </div>
    );
  }
}
