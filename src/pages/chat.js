import React from "react";

const statusIdentifying = "identifying";
const statusConnecting = "connecting";
const statusSearching = "searching";
const statusMatched = "matched";
const statusDisconnected = "disconnected";

const typeSystem = "s";
const typeOwn = "o";
const typeBuddy = "b";
// const ADMIN = "a";

const systemSearch = "s";
const systemConnect = "c";
const systemDisconnect = "d";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      status: statusIdentifying,
      websocket: null,
    };

    this.connectToChat = this.connectToChat.bind(this);
    this.connectToWs = this.connectToWs.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sendWebsocketMessage = this.sendWebsocketMessage.bind(this);
    this.handleSystemMessage = this.handleSystemMessage.bind(this);
    this.handleOwnMessage = this.handleOwnMessage.bind(this);
    this.clearChat = this.clearChat.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.setState({messages: this.props.messages});
    }
  }

  componentWilUnmount() {
    window.removeEventListener("focus", this.onFocus)
  }

  clearChat() {
    this.setState({messages: []});
  }

  onFocus = () => {
    this.scrollToBottom();
  }

  async connectToChat() {
    // Obtain cookie if not set
    let response = await this.identify();
    if (!response) {
      return false;
    }
    this.setState({status: statusConnecting});

    let success = this.connectToWs();
    if (!success) {
      // Try to reconnect again soon
      return;
    }

    // If all goes successfully - do not prompt to reconnect
    return true;
  }

  async connectToWs() {
    // Connect to WS
    let ws = null;

    try {
      ws = await new WebSocket("ws://" + window.location.hostname + ":8080/got");
      if (ws === undefined) {
        throw new Error("Could not connect to ws");
      }
    } catch (err) {
      console.log(err);
      return false;
    }

    ws.binaryType = "arraybuffer";

    ws.onopen = this.onOpen;
    ws.onclose = this.onClose;
    ws.onmessage = this.onMessage();

    this.setState({websocket: ws});

    return true;
  }

  async componentDidMount() {
    window.addEventListener("focus", this.onFocus)

    this.connectToChat();
  }

  handleSystemMessage(text) {
    switch (text) {
      case systemConnect:
        console.log("Matched");
        this.setState({status: statusMatched});
        break;
      case systemDisconnect:
        console.log("Disconnected");
        this.setState({status: statusDisconnected});
        break;
    }
  }

  handleBuddyMessage(text) {
    var messages = this.state.messages.slice();
    messages.push({
      "type": typeBuddy,
      "text": text,
    });
    this.setState({messages: messages});
  }

  handleOwnMessage(text) {
    var messages = this.state.messages.slice();
    messages.push({
      "type": typeOwn,
      "text": text,
    });
    this.setState({messages: messages});

    this.scrollToBottom();
  }

  scrollToBottom() {
    document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
  }

  async identify() {
    let url = "http://" + window.location.hostname + ":8080/api/identify" + window.location.search;
    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.error === undefined || json.error) {
      console.log("Unknown response:", json);
      return false;
    }

    return true;
  }

  onClose() {
    this.setState({status: statusDisconnected});
  }

  onMessage = () => {
    return (e) => {
      var receivedJson = JSON.parse(e.data);

      if (receivedJson === null || receivedJson === undefined) {
        console.log("Received unexpected JSON:", receivedJson);
      }
      console.log("Received message:", receivedJson);
      switch (receivedJson.type) {
        case typeSystem:
          this.handleSystemMessage(receivedJson.text);
          break;
        case typeOwn:
          this.handleOwnMessage(receivedJson.text);
          break;
        case typeBuddy:
          this.handleBuddyMessage(receivedJson.text);
          break;
        default:
          console.log("Unexpected json:", receivedJson);
      }
    }
  }

  onOpen() {
    this.setState({status: statusSearching});

    this.sendWebsocketMessage(typeSystem, systemSearch)
  }

  sendWebsocketMessage(t, msg) {
    // check type
    var o = {
      type: t,
      text: msg
    };

    if (this.state.websocket === null || this.state.websocket === undefined) {
      console.log("Not connect to WS");
      return false;
    }

    try {
      this.state.websocket.send(JSON.stringify(o));
    } catch (err) {
      console.log(err);
      return false
    }

    return true;
  }

  handleDisconnect = () => {
    if (!window.confirm("Are you sure you want to disconnect?")) {
      return false;
    }

    var o = {
      type: typeSystem,
      text: systemDisconnect,
    };
console.log("Disconnecting:", o);
    this.state.websocket.send(JSON.stringify(o));

    this.setState({status: statusDisconnected});
  }

  handleSearch = () => {
    this.clearChat();

    var o = {
      type: typeSystem,
      text: systemSearch,
    };

    this.state.websocket.send(JSON.stringify(o));

    this.setState({status: statusSearching});
  }

  render() {
    return (
        <div className={`main-content`}>
          <ChatMessages messages={this.state.messages}
                        searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                        status={this.state.status} />
          <ChatControls websocket={this.state.websocket} handleDisconnect={this.handleDisconnect}
                        handleSearch={this.handleSearch} disconnected={this.state.status === statusDisconnected}/>
        </div>
    );
  }
}

class ChatMessages extends React.Component {
  render() {
    const messageItems = this.props.messages.map((message) =>
        <div className={`${ message.type === typeOwn ? 'my-message-container' : 'buddy-message-container'}`}>
          <div
              className={`chat-message ${ message.type === typeOwn ? 'my-message' : 'buddy-message' }`}>{message.text}</div>
        </div>
    );

    if (this.props.searching) {
      return (
          <div className="chat-messages">
            <div className="status-wrapper">
              <div className="loader"></div>
              <div className="status">{this.props.status}</div>
            </div>
          </div>
      )
    }

    return (
        <div className='chat-messages fade-in'>
          {messageItems}
        </div>
    );
  }
}

class ChatControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
  }

  sendInputMessage = () => {
    let input = document.getElementsByTagName('input')[0];
    let text = input.value;

    // If input is empty - nothing to send
    if (text === '') {
      return true;
    }

    var o = {
      type: "o",
      text: text,
    };

    this.props.websocket.send(JSON.stringify(o));

    console.log("Sent message:", text);
    input.value = '';
    this.setState({inputText: input.value});

    return true;
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.sendInputMessage();
      return true;
    }
  }

  handleOnChange = (e) => {
    let input = document.getElementsByTagName('input')[0];
    if (!!input) {
      this.setState({inputText: input.value});
      return true;
    }
// + send "typing" event here?
  }

  handleSendClick = () => {
    this.sendInputMessage();
  }

  render() {
// Will this re-render everything?
    return (
        <div className='chat-controls fade-in'>
          {/*Change disconnect button to "Search"*/}
          <DisconnectSearchButton handleDisconnect={this.props.handleDisconnect} handleSearch={this.props.handleSearch}
                                  disconnected={this.props.disconnected}/>
          <input type="text" placeholder="Message"
                 className={`chat-input` + (this.props.disconnected ? ' disabled' : '')}
                 onKeyDown={this.handleKeyDown} onChange={this.handleOnChange} maxLength={1024 - 40}
                 disabled={(this.props.disconnected ? ' disabled' : '')}/>
          <button
              className={`chat-send-button` + (this.props.disconnected || this.state.inputText === '' ? ' disabled' : '')}
              onClick={this.handleSendClick} disabled={(this.props.disconnected || this.state.inputText === '' ? ' disabled' : '')}>Send
          </button>
        </div>
    );
  }
}

class DisconnectSearchButton extends React.Component {
  render() {
    if (this.props.disconnected) {
      return (<button className={`chat-search-disconnect-button`} onClick={this.props.handleSearch}>Search</button>);
    }

    return (
        <button className={`chat-search-disconnect-button`} onClick={this.props.handleDisconnect}>Disconnect</button>
    );
  }
}
