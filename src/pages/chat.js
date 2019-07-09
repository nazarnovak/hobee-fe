import React from "react";

const statusIdentifying = "identifying";
const statusConnecting = "connecting";
const statusSearching = "searching";
const statusMatched = "matched";
const statusDisconnected = "disconnected";

const typeActivity = "a";
const typeSystem = "s";
const typeChatting = "c";
const typeOwn = "o";
const typeBuddy = "b";
// const ADMIN = "a";

const systemSearch = "s";
const systemConnect = "c";
const systemDisconnect = "d";

const activityUserActive = "ua";
const activityUserInactive = "ui";
const activityRoomActive = "ra";
const activityRoomInactive = "ri";
const activityOwnTyping = "t";

const svgX = require('../images/xWhite.svg');
const svgNext = require('../images/nextWhite2.svg');
const svgSendWhite = require('../images/sendWhite.svg');

const svgHeartWhite = require('../images/heartWhite.svg');
const svgDisketteWhite = require('../images/disketteWhite.svg');
const svgExclamationWhite = require('../images/exclamationWhite.svg');

const svgHeartBlueEmpty = require('../images/heartBlueEmpty.svg');
const svgHeartBlueFilled = require('../images/heartBlueFilled.svg');

// const svgDisketteYellow = require('../images/disketteYellow.svg');

const svgReportEmpty = require('../images/reportEmpty.svg');
const svgReportFilled = require('../images/reportFilled.svg');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    let that = this;

    this.state = {
      messages: [],
      status: statusIdentifying,
      websocket: null,
      liked: false,
      reported: false,
      tabActive: true,
      unread: 0,
      statusShow: false,
      statusText: '',
      typingTimeout: setTimeout(function() {
        if (that.state.statusText !== 'Buddy is typing...') {
          return false;
        }

        that.setState({statusShow: false});
      }, 2000),
    };

    this.connectToChat = this.connectToChat.bind(this);
    this.connectToWs = this.connectToWs.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sendWebsocketMessage = this.sendWebsocketMessage.bind(this);
    this.handleSystemMessage = this.handleSystemMessage.bind(this);
    this.handleChatMessage = this.handleChatMessage.bind(this);
    this.clearChat = this.clearChat.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.setState({messages: this.props.messages});
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleEscKey, false);
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);
  }

  clearChat() {
    this.setState({messages: []});
  }

  onFocus = () => {
    this.scrollToBottom();
    this.setState({tabActive: true, unread: 0});

    document.title = 'hobee: Dialogue definite';
  }

  onBlur = () => {
    this.setState({tabActive: false});
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
    window.addEventListener("keydown", this.handleEscKey, false);
    window.addEventListener("focus", this.onFocus);
    window.addEventListener("blur", this.onBlur);

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

  chatStatusFromMessages(messages) {
    let statusShow = this.state.statusShow;
    let statusText = this.state.statusText;

    messages.map((msg) => {
      if (msg.type === typeActivity && msg.authoruuid === typeBuddy && msg.text === activityUserInactive) {
        statusShow = true;
        statusText = 'Buddy is inactive';
      }

      if (msg.type === typeActivity && msg.authoruuid === typeBuddy && msg.text === activityUserActive) {
        statusShow = false;
      }

      if (msg.type === typeSystem && msg.text === systemDisconnect) {
        statusShow = true;
        statusText = 'You disconnected';

        if (msg.authoruuid === typeBuddy) {
          statusText = 'Buddy disconnected';
        }
      }
    });

    this.setState({statusShow: statusShow, statusText: statusText});
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
        let statusText = 'You disconnected';
        if (msg.authoruuid === typeBuddy) {
          statusText = 'Buddy disconnected';
        }

        this.setState({statusShow: true, statusText: statusText});

        status = statusDisconnected;
        break;
      case systemSearch:
        console.log("Available for search");
        status = statusSearching;
        break;
      default:
        throw new Error("Unknown system message", msg.text);
    }

    if (status != statusSearching) {
      messages.push(msg);
    }

    if (status === statusSearching) {
      this.clearChat();
      this.sendWebsocketMessage(typeSystem, systemSearch);
    }

    this.setState({status: status, messages: messages});
  }

  handleChatMessage(msg) {
    var messages = this.state.messages.slice();
    messages.push(msg);
    this.setState({messages: messages});

    this.scrollToBottom();
    this.pushUnreadMessage();
  }

  async handleActivityMessage(msg) {
    let status = this.state.status, messages = this.state.messages.slice();

    switch (msg.text) {
      case activityRoomActive:
        console.log("Room active");
        status = statusMatched;

        messages = await this.pullRoomMessages();
        this.chatStatusFromMessages(messages);
        break;
      case activityRoomInactive:
        status = statusDisconnected;
        messages = await this.pullRoomMessages();
        this.chatStatusFromMessages(messages);
        break;
      case activityUserActive:
        // If buddy goes active - remove the status
        if (msg.authoruuid === typeBuddy) {
          this.setState({statusShow: false});
        }
        break;
      case activityUserInactive:
        // If buddy goes inactive - add the status
          if (msg.authoruuid === typeBuddy) {
            this.setState({statusShow: true, statusText: 'Buddy is inactive'});
          }
        break;
      case activityOwnTyping:
        this.setState({statusShow: true, statusText: 'Buddy is typing...'});

        clearTimeout(this.state.typingTimeout);

        let that = this;

        this.setState({
          typingTimeout: setTimeout(function(){
            // User might go inactive right after typing, this will cause a bug where the status will be removed
            if (that.state.statusText !== 'Buddy is typing...') {
              return false;
            }

            that.setState({statusShow: false});
            }, 2000
          ),
        });

        // Return now, we don't need to update status/messages, or scroll to the bottom
        return;
      default:
        throw new Error("Unknown activity received", msg);
    }

    messages.push(msg);

    this.setState({status: status, messages: messages});

    this.scrollToBottom();
  }

  handleEscKey = (e) => {
    if (e.key === "Escape") {
      this.handleDisconnect();
      return true;
    }
  }

  pushUnreadMessage() {
    // We only push unread messages when the tab is not active
    if (this.state.tabActive) {
      return false;
    }

    this.setState({unread: this.state.unread + 1});

    document.title = '(' + this.state.unread + ')' + ' hobee: Dialogue definite';
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

        case typeChatting:
          this.handleChatMessage(receivedJson);
          break;
        case typeActivity:
          this.handleActivityMessage(receivedJson);
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
    if (this.state.status !== statusMatched) {
      return false;
    }

    if (!window.confirm("Are you sure you want to disconnect?")) {
      return false;
    }

    var o = {
      type: typeSystem,
      text: systemDisconnect,
    };

    this.state.websocket.send(JSON.stringify(o));
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
    this.setState({reported: !this.state.reported});
  }

  handleMouseEnter = (e) => {
    let el = e.target;
    el.parentElement.querySelector('.message-timestamp').classList.add('visible');
  }

  handleMouseLeave = (e) => {
    let el = e.target;
    el.parentElement.querySelector('.message-timestamp').classList.remove('visible');
  }

  render() {
    return (
        <div className={`main-content`}>
          <ChatMessages messages={this.state.messages}
                        searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                        status={this.state.status} handleMouseEnter={this.handleMouseEnter}
                        handleMouseLeave={this.handleMouseLeave}/>
          <ChatControls websocket={this.state.websocket} handleDisconnect={this.handleDisconnect}
                        handleSearch={this.handleSearch} disconnected={this.state.status === statusDisconnected}
                        matched={this.state.status === statusMatched} handleLike={this.handleLike}
                        liked={this.state.liked} reported={this.state.reported}
                        handleSave={this.handleSave} handleReport={this.handleReport}
                        searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                        statusShow={this.state.statusShow} statusText={this.state.statusText}
                        sendWebsocketMessage={this.sendWebsocketMessage}
          />
        </div>
    );
  }
}

class ChatMessages extends React.Component {
  render() {
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

    // let msgItems = this.props.messages.filter(function (msg) {
    //       if (msg.type === typeSystem) {
    //         return false;
    //       }
    //
    //       return true;
    //     }
    // );
    let msgs = this.props.messages;

    let msgsHTML = msgs.map((msg) => {
          // We skip the room active/inactive messages, which are only for us to know if we need to pull messages and
          // show disconnected state
          if (msg.type === typeSystem || msg.type === typeActivity) {
            return;
          }

          let wrapperClass = '', messageClass = '';

          switch (msg.type) {
            case typeChatting:
              // Chatting messages should only be own or buddy's
              if (msg.authoruuid !== typeOwn && msg.authoruuid !== typeBuddy) {
                throw new Error("Unknown message author", msg);
              }
              if (msg.authoruuid === typeOwn) {
                wrapperClass = 'my-message-container';
                messageClass = 'my-message';
              }
              if (msg.authoruuid === typeBuddy) {
                wrapperClass = 'buddy-message-container';
                messageClass = 'buddy-message';
              }
              break;
            default:
              throw new Error('Unknown message type', msg.type);
          }

          if (msg.authoruuid === typeOwn) {
            return (
                <div className={wrapperClass}>
                  <Timestamp direction={'left'} timestamp={msg.timestamp}/>
                  <div className={`chat-message ${messageClass}`} onMouseEnter={this.props.handleMouseEnter}
                       onMouseLeave={this.props.handleMouseLeave}>
                    {msg.text}
                  </div>
                </div>
            );
          }

          if (msg.authoruuid === typeBuddy) {
            return (
                <div className={wrapperClass}>
                  <div className={`chat-message ${messageClass}`} onMouseEnter={this.props.handleMouseEnter}
                       onMouseLeave={this.props.handleMouseLeave}>
                    {msg.text}
                  </div>
                  <Timestamp direction={'right'} timestamp={msg.timestamp}/>
                </div>
            );
          }

          throw new Error("Unknown where to show the message", msg);
        }
    );

    return (
        <div className='chat-messages fade-in'>
          {msgsHTML}
        </div>
    );
  }
}

class ChatStatus extends React.Component {
  render() {
    return (
        <div className={`chat-status-container` + (this.props.show ? ' visible' : '')}>
          <div className="chat-status">{this.props.text}</div>
        </div>
    );
  }
}

class ChatControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      typing: false,
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
    if (e.key === "Enter") {
      this.sendInputMessage();
      return true;
    }
  }

  handleOnChange = (e) => {
    let input = document.getElementsByTagName('input')[0];

    // Ignore on change if we can't find the element
    if (!input) {
      return false;
    }

    this.setState({inputText: input.value});

    if(!this.state.typing) {
      this.setState({typing: true});

      var that = this;

      this.props.sendWebsocketMessage(typeActivity, activityOwnTyping);

      // Reset the typing in the state after 1 second
      setTimeout(function(){
        that.setState({typing: false});
      }, 1000);
    }
  }

  handleSendClick = () => {
    this.sendInputMessage();
  }

  render() {
    return (
        <div className={`chat-controls connected fade-in`}>
          <ChatStatus show={this.props.statusShow} text={this.props.statusText}/>
          <DisconnectSearchButton handleDisconnect={this.props.handleDisconnect} handleSearch={this.props.handleSearch}
                                  disconnected={this.props.disconnected} matched={this.props.matched}/>
          <MiddleControl matched={this.props.matched} onKeyDown={this.handleKeyDown} onChange={this.handleOnChange}
                         handleLike={this.props.handleLike} liked={this.props.liked} reported={this.props.reported}
                         handleSave={this.props.handleSave} handleReport={this.props.handleReport}
                         searching={this.props.searching}/>
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
          <button className={`chat-disconnect-button circle` +
          ((this.props.matched) ? '' : ' disabled')} onClick={this.props.handleDisconnect}>
            <img className="button-icon x" src={svgX} alt="Disconnect"></img>
          </button>
        </div>
    );
  }
}

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
              {/*<div className={(this.props.liked ? ' like-text animate' : 'like-text')}>Liked</div>*/}
            </button>
          </div>
          {/*<div className="circle-wrapper">*/}
          {/*<button className={`middle-button circle save-button`} onClick={this.props.handleSave}>*/}
          {/*<img className="button-icon" src={svgDisketteWhite} alt="Save"></img>*/}
          {/*</button>*/}
          {/*</div>*/}
          <div className="circle-wrapper">
            <button className={`middle-button circle report-button` + (this.props.reported ? ' active' : '')}
                    onClick={this.props.handleReport}>
              <img className="button-icon" src={(this.props.reported ? svgReportFilled : svgReportEmpty)}
                   alt="Report"></img>
            </button>
          </div>
        </div>
    );
  }
}

class Timestamp extends React.Component {
  render() {
    // let hoursOffset = -(new Date().getTimezoneOffset() / 60);
    let dateTimestamp = new Date(this.props.timestamp);

    // dateTimestamp.setHours(dateTimestamp.getHours()+ hoursOffset);

    let hours = dateTimestamp.getHours();
    let minutes = dateTimestamp.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    let strTime = hours + ':' + minutes + ' ' + ampm;

    return (
        <span
            className={`message-timestamp` + (this.props.direction === 'bottom' ? ' timestamp-system' : '')}>{strTime}</span>
    );
  }
}
