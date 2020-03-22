import React from "react";

import Nav from "../nav";

const statusIdentifying = "identifying";
const statusConnecting = "connecting";
const statusSearching = "searching";
const statusMatched = "matched";
const statusDisconnected = "disconnected";

const messageTypeActivity = "a";
const messageTypeChatting = "c";
const messageTypeResult = "r";
const messageTypeSystem = "s";

const activityUserActive = "ua";
const activityUserInactive = "ui";
const activityRoomActive = "ra";
const activityRoomInactive = "ri";
const activityOwnTyping = "t";

const messageTypeOwn = "o";
const messageTypeBuddy = "b";

const resultLike = "rl";
const resultDislike = "rd";

// Has to be 6 items to fit the height perfectly
const reportOptions = {
  'rdl': `I didn't like the conversation`,
  'rsp': 'Spam',
  'rse': 'Sexism',
  'rha': 'Harassment',
  'rra': 'Racism',
  'rot': 'Other',
};

const systemSearch = "s";
const systemConnect = "c";
const systemDisconnect = "d";

const svgXWhite = require('../images/xWhite.svg');
const svgXGrey = require('../images/xGrey.svg');
const svgNext = require('../images/nextWhite2.svg');
const svgSendWhite = require('../images/sendWhite.svg');

const svgHeartWhite = require('../images/heartWhite.svg');
const svgExclamationWhite = require('../images/exclamationWhite.svg');

const svgHeartBlueEmpty = require('../images/heartBlueEmpty.svg');
const svgHeartBlueFilled = require('../images/heartBlueFilled.svg');

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
      reportModalOpen: false,
      reported: '',
      tabActive: true,
      unread: 0,
      statusShow: false,
      statusText: '',
      typingTimeout: setTimeout(function () {
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
    window.removeEventListener('resize', this.onResize);
  }

  clearChat() {
    this.setState({messages: []});
  }

  onFocus = () => {
    this.scrollToBottom();
    this.setState({tabActive: true, unread: 0});

    document.title = 'hobee: Quality conversations';
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
      wsUrl += "/api/chat";

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
    window.addEventListener('resize', this.onResize);

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

  async pullResult() {
    let url = "/api/result";
    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.liked === undefined) {
      throw new Error("Unknown pull result response", json);
      return false;
    }

    return json;
  }

  chatStatusFromMessages(messages) {
    let statusShow = this.state.statusShow;
    let statusText = this.state.statusText;

    messages.map((msg) => {
      if (msg.type === messageTypeActivity && msg.authoruuid === messageTypeBuddy && msg.text === activityUserInactive) {
        statusShow = true;
        statusText = 'Buddy is inactive';
      }

      if (msg.type === messageTypeActivity && msg.authoruuid === messageTypeBuddy && msg.text === activityUserActive) {
        statusShow = false;
      }

      if (msg.type === messageTypeSystem && msg.text === systemDisconnect) {
        statusShow = true;
        statusText = 'You disconnected';

        if (msg.authoruuid === messageTypeBuddy) {
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
        if (msg.authoruuid === messageTypeBuddy) {
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
      this.sendWebsocketMessage(messageTypeSystem, systemSearch);
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
        status = statusMatched;

        messages = await this.pullRoomMessages();
        this.chatStatusFromMessages(messages);
        break;
      case activityRoomInactive:
        status = statusDisconnected;
        messages = await this.pullRoomMessages();
        this.chatStatusFromMessages(messages);

        let result = await this.pullResult();
        this.setState({liked: result.liked, reported: result.reported});
        break;
      case activityUserActive:
        // If buddy goes active - remove the status
        if (msg.authoruuid === messageTypeBuddy) {
          this.setState({statusShow: false});
        }
        break;
      case activityUserInactive:
        // If buddy goes inactive - add the status
        if (msg.authoruuid === messageTypeBuddy) {
          this.setState({statusShow: true, statusText: 'Buddy is inactive'});
        }
        break;
      case activityOwnTyping:
        this.setState({statusShow: true, statusText: 'Buddy is typing...'});

        clearTimeout(this.state.typingTimeout);

        let that = this;

        this.setState({
          typingTimeout: setTimeout(function () {
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

    document.title = '(' + this.state.unread + ')' + ' hobee: Quality conversations';
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
        case messageTypeSystem:
          this.handleSystemMessage(receivedJson);
          break;

        case messageTypeChatting:
          this.handleChatMessage(receivedJson);
          break;
        case messageTypeActivity:
          this.handleActivityMessage(receivedJson);
          break;
        default:
          console.log("Unexpected json:", receivedJson);
      }
    }
  }

  onOpen() {
  }

  onResize = () => {
    this.scrollToBottom()
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
      type: messageTypeSystem,
      text: systemDisconnect,
    };

    this.state.websocket.send(JSON.stringify(o));
  }

  handleMessageClick = (e) => {
    let el = e.target;
    if (el.parentElement.querySelector('.message-timestamp').classList.contains('visible')) {
      el.parentElement.querySelector('.message-timestamp').classList.remove('visible');
      return true;
    }

    el.parentElement.querySelector('.message-timestamp').classList.add('visible');
    return true;
  }

  handleReportModalClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.setState({reportModalOpen: false});
  }

  handleReportOptionClick = (e) => {
    const text = e.target.getAttribute('data-key');

    let found = false;

    Object.keys(reportOptions).map(function (key) {
      if (key === text) {
        found = true
      }
    });

    // Someone messing with the data-keys ;)
    if (!found) {
      return false;
    }

    this.sendWebsocketMessage(messageTypeResult, text);

    this.setState({reportModalOpen: false, reported: text});
  }

  handleSearch = () => {
    this.clearChat();

    var o = {
      type: messageTypeSystem,
      text: systemSearch,
    };

    this.state.websocket.send(JSON.stringify(o));

    this.setState({status: statusSearching, statusShow: false, reported: '', liked: false});
  }

  handleLike = () => {
    if (this.state.liked) {
      this.sendWebsocketMessage(messageTypeResult, resultDislike);
    }

    if (!this.state.liked) {
      this.sendWebsocketMessage(messageTypeResult, resultLike);
    }

    this.setState({liked: !this.state.liked});
  }

  handleSave = () => {
    console.log("Save clicked");
  }

  handleReport = () => {
    this.setState({reportModalOpen: true});
  }

  // Temporarily disabled, to allow mobile to see timestamp too, so now it's on click instead
  // handleMouseEnter = (e) => {
  //   let el = e.target;
  //   el.parentElement.querySelector('.message-timestamp').classList.add('visible');
  // }
  //
  // handleMouseLeave = (e) => {
  //   let el = e.target;
  //   el.parentElement.querySelector('.message-timestamp').classList.remove('visible');
  // }

  render() {
    return (
        <div>
          <Nav location={this.props.location} />
          <div className={`main-content`}>
            <ChatMessages messages={this.state.messages}
                          searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                          status={this.state.status} handleMessageClick={this.handleMessageClick}/>
            <ChatControls websocket={this.state.websocket} handleDisconnect={this.handleDisconnect}
                          handleSearch={this.handleSearch} disconnected={this.state.status === statusDisconnected}
                          matched={this.state.status === statusMatched} handleLike={this.handleLike}
                          liked={this.state.liked} reported={this.state.reported}
                          handleSave={this.handleSave} handleReport={this.handleReport}
                          searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                          statusShow={this.state.statusShow} statusText={this.state.statusText}
                          sendWebsocketMessage={this.sendWebsocketMessage} reportModalOpen={this.state.reportModalOpen}
                          handleReportModalClose={this.handleReportModalClose}
                          handleReportOptionClick={this.handleReportOptionClick}
            />
          </div>
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

    let msgs = this.props.messages;

    let msgsHTML = msgs.map((msg) => {
          // We skip the room active/inactive messages, which are only for us to know if we need to pull messages and
          // show disconnected state
          if (msg.type === messageTypeSystem || msg.type === messageTypeActivity) {
            return;
          }

          if (msg.type !== messageTypeChatting) {
            throw new Error('Unknown message type in chat messages', msg.type);
            return;
          }

          if (msg.authoruuid === messageTypeOwn) {
            return (
                <div className={`my-message-container`}>
                  <Timestamp direction={'left'} timestamp={msg.timestamp}/>
                  <div className={`chat-message my-message`} onClick={this.props.handleMessageClick}>
                    {msg.text}
                  </div>
                  {/*<div className={`my-message-corner`}>*/}
                  {/*<div className={`my-message-corner-blue`}></div>*/}
                  {/*<div className={`my-message-corner-white`}></div>*/}
                  {/*</div>*/}
                </div>
            );
          }

          if (msg.authoruuid === messageTypeBuddy) {
            return (
                <div className={`buddy-message-container`}>
                  {/*<div className={`buddy-message-corner`}>*/}
                  {/*<div className={`buddy-message-corner-grey`}></div>*/}
                  {/*<div className={`buddy-message-corner-white`}></div>*/}
                  {/*</div>*/}
                  <div className={`chat-message buddy-message`} onClick={this.props.handleMessageClick}>
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

    if (!this.state.typing) {
      this.setState({typing: true});

      var that = this;

      this.props.sendWebsocketMessage(messageTypeActivity, activityOwnTyping);

      // Reset the typing in the state after 1 second
      setTimeout(function () {
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
                         searching={this.props.searching} reportModalOpen={this.props.reportModalOpen}
                         handleReportModalClose={this.props.handleReportModalClose}
                         handleReportOptionClick={this.props.handleReportOptionClick}/>
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
            <img className="button-icon x" src={svgXWhite} alt="Disconnect"></img>
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
            <button className={`middle-button circle like-button` + (this.props.liked ? '' : ' active')}
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
            <ReportModal open={this.props.reportModalOpen} onClose={this.props.handleReportModalClose}
                         handleReportOptionClick={this.props.handleReportOptionClick} reported={this.props.reported}/>
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

class ReportModal extends React.Component {
  render() {
    if (!this.props.open) {
      return null;
    }

    const alreadyReported = (this.props.reported !== '');

    const reportOptionsHTML = Object.keys(reportOptions).map((key) => {
      if (alreadyReported) {
        return (
            <div className={`report-option` + (this.props.reported === key ? ` selected` : ` disabled`)} data-key={key} key={key}>
              {reportOptions[key]}
            </div>
        );
      }

      return (
          <div className="report-option enabled" data-key={key} key={key} onClick={this.props.handleReportOptionClick}>
            {reportOptions[key]}
          </div>
      );
    });

    return (
        <div className="backdrop" onClick={this.props.onClose}>
          <div className="report-modal">
            <div className="report-header">
              <div className="report-header-side"></div>
              <div className="report-header-title">Report</div>
              <div className="report-header-side">
                <img className="report-x" src={svgXGrey} alt="Close" onClick={this.props.onClose}></img>
              </div>
            </div>
            <div className="report-options">
              {reportOptionsHTML}
            </div>
          </div>
        </div>
    );
  }
}
