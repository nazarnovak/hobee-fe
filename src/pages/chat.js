import React from "react";

import Nav from "../nav";

const statusOffline = "offline";
const statusConnecting = "connecting";
const statusSearching = "searching";
const statusMatched = "matched";
const statusDisconnected = "disconnected";

const messageTypeActivity = "a";
const messageTypeChatting = "c";
const messageTypeResultLike = "rl";
const messageTypeResultReport = "rr";
const messageTypeSystem = "s";

const activityUserActive = "ua";
const activityUserInactive = "ui";
const activityRoomActive = "ra";
const activityRoomInactive = "ri";
const activityOwnTyping = "t";

const messageTypeOwn = "o";
const messageTypeBuddy = "b";

// const resultLike = "rl";
// const resultDislike = "rd";

// Has to be 6 items to fit the height perfectly
const reportOptions = {
  'rdl': `I didn't like the conversation`,
  'rsp': 'Spam',
  'rse': 'Sexism',
  'rha': 'Harassment',
  'rra': 'Racism',
  'rot': 'Other',
};

// Has to be 6 items to fit the height perfectly
const likeOptions = {
  'lpo': `Positive`,
  'lun': 'Understanding',
  'lfu': 'Funny',
  'lsm': 'Smart',
  'lhe': 'Helpful',
  'lgr': 'Great',
};

const systemSearch = "s";
const systemConnect = "c";
const systemDisconnect = "d";

const svgXWhite = require('../images/xWhite.svg');
const svgXGrey = require('../images/xGrey.svg');
const svgNext = require('../images/nextWhite2.svg');
const svgSendWhite = require('../images/sendWhite.svg');

// const svgHeartWhite = require('../images/heartWhite.svg');
// const svgExclamationWhite = require('../images/exclamationWhite.svg');

const svgHeartBlueEmpty = require('../images/heartBlueEmpty.svg');
const svgHeartBlueFilled = require('../images/heartBlueFilled.svg');

const svgReportEmpty = require('../images/flag.svg');
const svgReportFilled = require('../images/reportFilled.svg');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    let that = this;

    this.state = {
      messages: [],
      status: statusOffline,
      websocket: null,
      likeModalOpen: false,
      likes: [],
      reportModalOpen: false,
      reports: [],
      tabActive: true,
      unread: 0,
      statusShow: false,
      statusText: statusOffline,
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
  };

  onBlur = () => {
    this.setState({tabActive: false});
  };

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
      return false;
    }

    // If all goes successfully - do not prompt to reconnect
    return true;
  }

  async connectToWs() {
    // Connect to WS
    let ws = null;

    // let port = 8080;
    // if (!!process && !!process.env && !!process.env.PORT) {
    //   port = process.env.PORT;
    // }

    try {
      var loc = window.location, wsUrl;
      wsUrl = "ws:";

      if (loc.protocol === "https:") {
        wsUrl = "wss:";
      }

      wsUrl += "//" + loc.hostname;

      if (process.env.NODE_ENV === "development") {
        wsUrl += ":8080"
      }

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
    let port = '';
    if (process.env.NODE_ENV === "development") {
        port = ':8080';
    }

    let url = `${window.location.protocol}//${window.location.hostname}${port}/api/messages`;

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
    let port = '';
    if (process.env.NODE_ENV === "development") {
        port = ':8080';
    }

    let url = `${window.location.protocol}//${window.location.hostname}${port}/api/result`;
    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.likes === undefined) {
      throw new Error("Missing likes in pull response", json);

      return false;
    }

    if (json.reports === undefined) {
      throw new Error("Missing reports in pull response", json);

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

    if (status !== statusSearching) {
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

        this.setState({ likes: result.likes, reports: result.reports });
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

    document.title = `(${this.state.unread}) hobee: Quality conversations`;
  }

  scrollToBottom() {
    document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
  }

  async identify() {
    let port = '';
    if (process.env.NODE_ENV === "development") {
        port = ':8080';
    }
    let url = `${window.location.protocol}//${window.location.hostname}${port}/api/identify${window.location.search}`;
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

  handleMessageMouseEnter = (e) => {
    // let el = e.target;
    //
    // if (el.parentElement.querySelector('.message-timestamp').classList.contains('visible')) {
    //   el.parentElement.querySelector('.message-timestamp').classList.remove('visible');
    //   return true;
    // }
    //
    // el.parentElement.querySelector('.message-timestamp').classList.add('visible');
    // return true;
  }

  handleMessageClick = (e) => {
    // let el = e.target;
    // if (el.parentElement.querySelector('.message-timestamp').classList.contains('visible')) {
    //   el.parentElement.querySelector('.message-timestamp').classList.remove('visible');
    //   return true;
    // }
    //
    // el.parentElement.querySelector('.message-timestamp').classList.add('visible');
    // return true;
  }

  handleModalsClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.setState({likeModalOpen: false, reportModalOpen: false});
  }

  handleLikeButtonClick = (selectedLikes) => {
    // Nothing selected from the options
    if (selectedLikes.length === 0) {
      return false;
    }

    // Already has likes
    if (this.state.likes.length !== 0) {
      return false;
    }

    let sent = this.sendWebsocketMessage(messageTypeResultLike, JSON.stringify(selectedLikes));

    if (!sent) {
      console.log("Could not send user likes");
      return false;
    }

    this.setState({ likes: selectedLikes, likeModalOpen: false });

    return true;
  }

  handleReportButtonClick = (selectedReports) => {
    // Nothing selected from the options
    if (selectedReports.length === 0) {
      return false;
    }

    // Already has reports
    if (this.state.reports.length !== 0) {
      return false;
    }

    let sent = this.sendWebsocketMessage(messageTypeResultReport, JSON.stringify(selectedReports));

    if (!sent) {
      console.log("Could not send user likes");
      return false;
    }

    this.setState({ reports: selectedReports, reportModalOpen: false });

    return true;
  }

  handleSearch = () => {
    this.clearChat();

    var o = {
      type: messageTypeSystem,
      text: systemSearch,
    };

    this.state.websocket.send(JSON.stringify(o));

    this.setState({status: statusSearching, statusShow: false, reports: [], likes: []});
  }

  handleLikeIconClick = () => {
    this.setState({likeModalOpen: true});
  }

  handleReportIconClick = () => {
    this.setState({reportModalOpen: true});
  }

  // handleSave = () => {
  //   console.log("Save clicked");
  // }

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
                          status={this.state.status} handleMessageMouseEnter={this.handleMessageMouseEnter}
                          handleMessageClick={this.handleMessageClick} offline={this.state.status === statusOffline}
            />
            <ChatControls websocket={this.state.websocket} handleDisconnect={this.handleDisconnect}
                          handleSearch={this.handleSearch} disconnected={this.state.status === statusDisconnected}
                          matched={this.state.status === statusMatched}
                          searching={this.state.status === statusConnecting || this.state.status === statusSearching}
                          statusShow={this.state.statusShow} statusText={this.state.statusText}
                          sendWebsocketMessage={this.sendWebsocketMessage}
                          handleSave={this.handleSave}
                          likes={this.state.likes} handleLikeIconClick={this.handleLikeIconClick}
                          likeModalOpen={this.state.likeModalOpen} handleLikeModalClose={this.handleModalsClose}
                          handleLikeButtonClick={this.handleLikeButtonClick}
                          // handleLikeOptionClick={this.handleLikeOptionClick}
                          reports={this.state.reports} handleReportIconClick={this.handleReportIconClick}
                          reportModalOpen={this.state.reportModalOpen} handleReportModalClose={this.handleModalsClose}
                          handleReportButtonClick={this.handleReportButtonClick}
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
              <div className="spinner">
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
                <div className="bar4"></div>
                <div className="bar5"></div>
                <div className="bar6"></div>
                <div className="bar7"></div>
                <div className="bar8"></div>
                <div className="bar9"></div>
                <div className="bar10"></div>
                <div className="bar11"></div>
                <div className="bar12"></div>
              </div>
              <div className="status">{this.props.status}</div>
            </div>
          </div>
      )
    } else if (this.props.offline) {
      return (
          <div className="chat-messages">
            <div className="status-wrapper">
              <div className="spinner stopped">
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
                <div className="bar4"></div>
                <div className="bar5"></div>
                <div className="bar6"></div>
                <div className="bar7"></div>
                <div className="bar8"></div>
                <div className="bar9"></div>
                <div className="bar10"></div>
                <div className="bar11"></div>
                <div className="bar12"></div>
              </div>
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

            // return;
          }

          if (msg.authoruuid === messageTypeOwn) {
            return (
                <div className={`my-message-container`}>
                  <Timestamp direction={'left'} timestamp={msg.timestamp}/>
                  <div className={`chat-message my-message`} onMouseOver={this.props.handleMessageHover} onClick={this.props.handleMessageClick}>
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
      }, 2000);
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
              handleSave={this.props.handleSave} searching={this.props.searching}
              likes={this.props.likes} likeModalOpen={this.props.likeModalOpen} handleLikeOptionClick={this.props.handleLikeOptionClick}
              handleLikeIconClick={this.props.handleLikeIconClick} handleLikeModalClose={this.props.handleLikeModalClose}
              handleLikeButtonClick={this.props.handleLikeButtonClick}
              // handleLikeOptionClick={this.props.handleLikeOptionClick}
              reports={this.props.reports} handleReportIconClick={this.props.handleReportIconClick}
              reportModalOpen={this.props.reportModalOpen} handleReportModalClose={this.props.handleReportModalClose}
              handleReportButtonClick={this.props.handleReportButtonClick}
          />
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
{/*// likes={this.props.likes} likeModalOpen={this.props.likeModalOpen} handleLikeOptionClick={this.props.handleLikeOptionClick}*/}
{/*// handleLikeIconClick={this.props.handleLikeIconClick} handleLikeModalClose={this.props.handleLikeModalClose}*/}
            <LikeModal likes={this.props.likes} open={this.props.likeModalOpen} handleLikeOptionClick={this.props.handleLikeOptionClick}
                           onClose={this.props.handleLikeModalClose} handleLikeButtonClick={this.props.handleLikeButtonClick} />
            <button className={`middle-button circle like-button` + (this.props.likes ? ' active' : '')}
                    onClick={this.props.handleLikeIconClick}>
              <img className="button-icon like" src={(this.props.likes ? svgHeartBlueFilled : svgHeartBlueEmpty)}
                   alt="Like"></img>
              {/*<div className={(this.props.likes ? ' like-text animate' : 'like-text')}>Likes</div>*/}
            </button>
          </div>
          {/*<div className="circle-wrapper">*/}
          {/*<button className={`middle-button circle save-button`} onClick={this.props.handleSave}>*/}
          {/*<img className="button-icon" src={svgDisketteWhite} alt="Save"></img>*/}
          {/*</button>*/}
          {/*</div>*/}
          <div className="circle-wrapper">
            <ReportModal open={this.props.reportModalOpen} onClose={this.props.handleReportModalClose} 
              reports={this.props.reports} handleReportButtonClick={this.props.handleReportButtonClick} />
            <button className={`middle-button circle report-icon-button` + (this.props.reports.length === 0 ? '' : ' active')}
                    onClick={this.props.handleReportIconClick}>
              <img className="button-icon report" src={(this.props.reports.length === 0 ? svgReportEmpty : svgReportFilled)}
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
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
    };
  }

  handleReportOptionClick = (e) => {
    const reportKey = e.target.getAttribute('data-key');

    let found = false;

    Object.keys(reportOptions).map(function (key) {
      if (key === reportKey) {
        found = true
      }
    });

    // Someone messing with the data-keys, return early ;)
    if (!found) {
      return false;
    }

    // Extra guard if someone clicks on the disabled option
    if (e.target.classList.contains('disabled')) {
      return false;
    }

    let updatedReports = this.state.reports;

    // Remove the key if it already exists in state, or add it if it's new
    let index = updatedReports.indexOf(reportKey);

    if (index !== -1) {
      updatedReports.splice(index, 1);
    } else {
      updatedReports = updatedReports.concat(reportKey);
    }

    this.setState({reports: updatedReports});

    return true;
    //this.sendWebsocketMessage(messageTypeResultReport, text);
  }

  render() {
    if (!this.props.open) {
      return null;
    }

    // Feels kind of hacky, probably better to do it with ref somehow, but I don't know how to properly pass it from outside
    if (this.props.reports.length !== 0 && this.state.reports.length == 0) {
      this.setState({ reports: this.props.reports });
    }

    // const alreadyHasReports = (this.props.reports !== '');

    const reportOptionsHTML = Object.keys(reportOptions).map((key) => {
      return (
          <div className={`report-option` + (this.state.reports.includes(key) ? ` selected` : ` normal`) + (this.props.reports.length !== 0 ? ` disabled` : ``)} data-key={key} key={key} onClick={this.handleReportOptionClick}>
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
            <div className="report-footer">
              <button className={`report-dialog-button` + (this.state.reports.length === 0 || this.props.reports.length !== 0 ? ` disabled` : ``)} onClick={() => this.props.handleReportButtonClick(this.state.reports)}>Report</button>
            </div>
          </div>
        </div>
    );
  }
}

class LikeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      likes: [],
    };
  }

  handleLikeOptionClick = (e) => {
    const likeKey = e.target.getAttribute('data-key');

    let found = false;

    Object.keys(likeOptions).map(function (key) {
      if (key === likeKey) {
        found = true
      }
    });

    // Someone messing with the data-keys, return early ;)
    if (!found) {
      return false;
    }

    // Extra guard if someone clicks on the disabled option
    if (e.target.classList.contains('disabled')) {
      return false;
    }

    let updatedLikes = this.state.likes;

    // Remove the key if it already exists in state, or add it if it's new
    let index = updatedLikes.indexOf(likeKey);

    if (index !== -1) {
      updatedLikes.splice(index, 1);
    } else {
      updatedLikes = updatedLikes.concat(likeKey); 
    }

    this.setState({ likes: updatedLikes });

    return true;
  }

  render() {
    if (!this.props.open) {
      return null;
    }

    // Feels kind of hacky, probably better to do it with ref somehow, but I don't know how to properly pass it from outside
    if (this.props.likes.length !== 0 && this.state.likes.length == 0) {
      this.setState({ likes: this.props.likes });
    }

    const likeOptionsHTML = Object.keys(likeOptions).map((key) => {
      return (
          <div className={`like-option` + (this.state.likes.includes(key) ? ` selected` : ` normal`) + (this.props.likes.length !== 0 ? ` disabled` : ``)} data-key={key} key={key} onClick={this.handleLikeOptionClick}>
            {likeOptions[key]}
          </div>
      );
    });

    return (
        <div className="backdrop" onClick={this.props.onClose}>
          <div className="like-modal">
            <div className="like-header">
              <div className="like-header-side"></div>
              <div className="like-header-title">Like</div>
              <div className="like-header-side">
                <img className="like-x" src={svgXGrey} alt="Close" onClick={this.props.onClose}></img>
              </div>
            </div>
            <div className="like-options">
              {likeOptionsHTML}
            </div>
            <div className="like-footer">
              <button className={`like-dialog-button` + (this.state.likes.length === 0 || this.props.likes.length !== 0 ? ` disabled` : ``)} onClick={() => this.props.handleLikeButtonClick(this.state.likes)}>Like</button>
            </div>
          </div>
        </div>
    );
  }
}