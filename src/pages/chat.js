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

const systemRoomActive = "ra";
const systemRoomInactive = "ri";

const svgX = require('../images/xWhite.svg');
const svgNext = require('../images/nextWhite2.svg');
const svgSendWhite = require('../images/sendWhite.svg');

const svgHeartWhite = require('../images/heartWhite.svg');
const svgDisketteWhite = require('../images/disketteWhite.svg');
const svgExclamationWhite = require('../images/exclamationWhite.svg');

const svgHeartBlueEmpty = require('../images/heartBlueEmpty.svg');
const svgHeartBlueFilled = require('../images/heartBlue2.svg');
const svgDisketteYellow = require('../images/disketteYellow.svg');
const svgExclamationRed = require('../images/exclamationRed.svg');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      status: statusIdentifying,
      websocket: null,
      liked: false,
      reported: false,
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

    let port = 8080;
    if (!!process && !!process.env && !!process.env.PORT) {
      port = process.env.PORT;
    }

    try {
      var loc = window.location, wsUrl;
      if (loc.protocol === "https:") {
        wsUrl = "wss:";
      } else {
        wsUrl = "ws:";
      }
      wsUrl += "//" + loc.host;
      wsUrl += "/api/got";

      ws = await new WebSocket(wsUrl);
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
    window.addEventListener("focus", this.onFocus);

    this.connectToChat();
  }

  async pullRoomMessages() {
    let url = "/api/messages";
    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.messages === undefined) {
      console.log("Unknown response:", json);
      return false;
    }

    return json.messages;
  }

  async handleSystemMessage(msg) {
    let status, messages = this.state.messages.slice();

    switch (msg.text) {
      case systemConnect:
        console.log("Matched");
        status = statusMatched;
        break;
      case systemDisconnect:
        console.log("Disconnected");
        status = statusDisconnected;
        break;
      case systemSearch:
        console.log("Available for search");
        status = statusSearching;
        break;
      case systemRoomActive:
        console.log("Room active");
        status = statusMatched;

        messages = await this.pullRoomMessages();
        break;
      case systemRoomInactive:
        console.log("Room inactive");
        status = statusDisconnected;

        messages = await this.pullRoomMessages();
        break;
      default:
        throw new Error("Unknown system message", msg.text);
    }

    messages.push(msg);

    if (status === statusSearching) {
      this.sendWebsocketMessage(typeSystem, systemSearch);
    }

    this.setState({status: status, messages: messages});
  }

  handleBuddyMessage(msg) {
    var messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({messages: messages});
  }

  handleOwnMessage(msg) {
    var messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({messages: messages});

    this.scrollToBottom();
  }

  scrollToBottom() {
    document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
  }

  async identify() {
    let url = "/api/identify" + window.location.search;
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

      switch (receivedJson.type) {
        case typeSystem:
          this.handleSystemMessage(receivedJson);
          break;
        case typeOwn:
          this.handleOwnMessage(receivedJson);
          break;
        case typeBuddy:
          this.handleBuddyMessage(receivedJson);
          break;
        default:
          console.log("Unexpected json:", receivedJson);
      }
    }
  }

  onOpen() {
  }

  sendWebsocketMessage(t, msg) {
    // check type
    var o = {
      type: t,
      text: msg
    };

    if (this.state.websocket === null || this.state.websocket === undefined) {
      console.log("Not connected to WS");
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

  handleLike = () => {
    this.setState({liked: !this.state.liked});
  }

  handleSave = () => {
    console.log("Save clicked");
  }

  handleReport = () => {
    console.log("Report clicked");
  }

  render() {
    return (
        <div className={`main-content`}>
          <ChatMessages messages={this.state.messages}
                        searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                        status={this.state.status}/>
          <ChatControls websocket={this.state.websocket} handleDisconnect={this.handleDisconnect}
                        handleSearch={this.handleSearch} disconnected={this.state.status === statusDisconnected}
                        matched={this.state.status === statusMatched} handleLike={this.handleLike}
                        liked={this.state.liked}
                        handleSave={this.handleSave} handleReport={this.handleReport}
                        searching={this.state.status === statusConnecting || this.state.status === statusSearching}
          />
        </div>
    );
  }
}

class ChatMessages extends React.Component {
  render() {
    let msgItems = this.props.messages.filter(function (msg) {
          if (msg.type === typeSystem) {
            return false;
          }

          return true;
        }
    );

    msgItems = msgItems.map((msg) =>
        <div className={`${ msg.type === typeOwn ? 'my-message-container' : 'buddy-message-container'}`}>
          <div
              className={`chat-message ${ msg.type === typeOwn ? 'my-message' : 'buddy-message' }`}>{msg.text}</div>
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
          {msgItems}
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
    return (
        <div className={`chat-controls connected fade-in`}>
          <DisconnectSearchButton handleDisconnect={this.props.handleDisconnect} handleSearch={this.props.handleSearch}
                                  disconnected={this.props.disconnected}/>
          <MiddleControl matched={this.props.matched} onKeyDown={this.handleKeyDown} onChange={this.handleOnChange}
                         handleLike={this.props.handleLike} liked={this.props.liked} handleSave={this.props.handleSave}
                         handleReport={this.props.handleReport} searching={this.props.searching}/>
          <div className="circle-wrapper send">
            <button
                className={`chat-send-button circle` +
                ((this.props.disconnected || this.state.inputText === '') ? ' disabled' : '')}
                onClick={this.handleSendClick}
                disabled={(this.props.disconnected || this.state.inputText === '' ? ' disabled' : '')}>
              <img className="button-icon" src={svgSendWhite} alt="Send"></img>
            </button>
          </div>
        </div>
    );
  }
}

class DisconnectSearchButton extends React.Component {
  render() {
    if (this.props.disconnected) {
      return (
          <div className="circle-wrapper">
            <button className={`chat-next-button circle`} onClick={this.props.handleSearch}>
              <img className="button-icon" src={svgNext} alt="Next"></img>
            </button>
          </div>
      );
    }

    return (
        <div className="circle-wrapper">
          <button className={`chat-disconnect-button circle`} onClick={this.props.handleDisconnect}>
            <img className="button-icon x" src={svgX} alt="Disconnect"></img>
          </button>
        </div>
    );
  }
}
// TODO: mobile vh is not set ATM. will break for height, need to do --vh for classes?
class MiddleControl extends React.Component {
  render() {
    if (this.props.searching) {
      return (
          <div className={`middle-buttons`}></div>
      );
    }

    if (this.props.matched) {
      return (
          <input type="text" placeholder="Message"
                 className={`chat-input` + (this.props.disconnected ? ' chat-controls-disabled' : '')}
                 onKeyDown={this.props.onKeyDown} onChange={this.props.onChange} maxLength={1024 - 40}
                 disabled={(this.props.disconnected ? ' disabled' : '')}/>
      );
    }
    return (
        <div className={`middle-buttons`}>
          <div className="circle-wrapper">
            <button className={`middle-button circle like-button` + (this.props.liked ? ' active' : '')}
                    onClick={this.props.handleLike}>
              <img className="button-icon like" src={(this.props.liked ? svgHeartBlueFilled : svgHeartBlueEmpty)}
                   alt="Like"></img>
              <div className={(this.props.liked ? ' like-text animate' : 'like-text')}>Liked</div>
            </button>
          </div>
          {/*<div className="circle-wrapper">*/}
          {/*<button className={`middle-button circle save-button`} onClick={this.props.handleSave}>*/}
          {/*<img className="button-icon" src={svgDisketteWhite} alt="Save"></img>*/}
          {/*</button>*/}
          {/*</div>*/}
          <div className="circle-wrapper">
            <button className={`middle-button circle report-button` + (this.props.liked ? ' active' : '')}
                    onClick={this.props.handleReport}>
              <img className="button-icon" src={(this.props.liked ? svgExclamationWhite : svgExclamationRed)}
                   alt="Report"></img>
            </button>
          </div>
        </div>
    );
  }
}
