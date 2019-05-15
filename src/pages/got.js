import React from "react";

import Chat from "./chat";

// TODO:
// - Clean everything up as much as possible into old code vs new code and then git commit!
// - If error - show reconnect link
// - Would be cool if there is any error happening to send it back to the backend to see what possible
// problems user had on the FE
// - Maybe have a counter of fails to "Reconnect". If it's like 3-5-10 - show a "Contact support" link
// so the user doesn't torture themselves ;(
// - Set websocket field as a global state parameter! That way even if you change pages the websockets will still be alive
// ^_^
// - Maybe check status when connected to WS, that way we know if we're ready to chat or there's an existing
// chat going on right now so we can reconnect to it?
// - Probably overcomplicating the loading/connecting/matching page design? :(

const SYSTEM = "s";
const OWN = "o";
const BUDDY = "b";
// const ADMIN = "a";
//
const SYS_SEARCH = "s";
const SYS_CONNECT = "c";
const SYS_DISCONNECT = "dc";
//
// const ACTION_SEARCH = "Search";
// const ACTION_SEARCHING = "Searching";
// const ACTION_DISCONNECT = "Disconnect";
//
// const STATUS_DISCONNECTED = "Disconnected";
// const STATUS_SEARCHING = "Searching";
// const STATUS_CONNECTED = "Connected";

export default class GOT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Connecting to chat...',
      matched: false,
      websocket: null,
      messages: [],
    };

    this.connectToChat = this.connectToChat.bind(this);
    this.connectToWs = this.connectToWs.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sendWebsocketMessage = this.sendWebsocketMessage.bind(this);
    this.handleSystemMessage = this.handleSystemMessage.bind(this);
    this.handleOwnMessage = this.handleOwnMessage.bind(this);
    this.handleSystemMessage = this.handleSystemMessage.bind(this);
  }

  async connectToChat() {
    // Obtain cookie if not set
    let success = this.identify();
    if (!success) {
      return;
    }

    success = this.connectToWs();
    if (!success) {
      // Try to reconnect again soon
      return;
    }

    // If all goes successfully - do not prompt to reconnect
    return true;
  }

  async connectToWs() {
    // Connect to WS
    let ws;

    try {
      ws = await new WebSocket("ws://localhost:8080/got");
      if (ws === undefined) {
        throw new Error("Could not connect to ws");
      }
    } catch(err) {
      console.log(err);
      return false;
    }

    ws.binaryType = "arraybuffer";

    ws.onopen = this.onOpen;
    ws.onclose = this.onClose;
    ws.onmessage = this.onMessage();

    this.setState({ websocket: ws });

    return true;
  }

  async componentDidMount() {
    this.connectToChat();
  }

  handleSystemMessage(text) {
    switch(text) {
      case SYS_CONNECT:
        console.log("Matched");
        this.setState({ matched: true });
        break;
      case SYS_DISCONNECT:
        console.log("Disconnected");
        // this.setState({ matched: false });
        break;
    }
  }

  handleOwnMessage(text) {
    var messages = this.state.messages.slice();
    messages.push({
      "sender": 0,
      "message": text,
    });
    this.setState( { messages: messages } );
  }

  handleBuddyMessage(text) {
    var messages = this.state.messages.slice();
    messages.push({
      "sender": 1,
      "message": text,
    });
    this.setState( { messages: messages } );
  }

  async identify() {
    let url = "http://localhost:8080/api/identify" + window.location.search;

    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch(err) {
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
    this.setState({ status: 'Connection lost' })
  }

  onMessage = () => {
    return (e) => {
      var receivedJson = JSON.parse(e.data);

      if (receivedJson === null || receivedJson === undefined) {
        console.log("Received unexpected JSON:", receivedJson);
      }
console.log("Received message:", receivedJson);
      switch(receivedJson.type) {
        case SYSTEM:
          this.handleSystemMessage(receivedJson.text);
          break;
        case OWN:
          this.handleOwnMessage(receivedJson.text);
          break;
        case BUDDY:
          this.handleBuddyMessage(receivedJson.text);
          break;
        default:
          console.log("Unexpected json:", receivedJson);
      }
    }
  }

  onOpen() {
    this.setState({ status: 'Searching for conversants...'});

    this.sendWebsocketMessage(SYSTEM, SYS_SEARCH)
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
    } catch(err) {
      console.log(err);
      return false
    }

    return true;
  }

  render() {
    if (this.state.matched) {
      return <Chat websocket={ this.state.websocket }  messages={ this.state.messages } />
    }

    return (
        <div className="status-wrapper">
          <div className="loader"></div>
          <div className="status">{this.state.status}</div>
        </div>
    );
  }
}
