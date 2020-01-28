import React from "react";

const messageTypeChatting = "c";

export default class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
    };
  }

  async componentDidMount() {
    let response = await this.identify();
    if (!response) {
      throw new Error("Couldn't identify user");
      return false;
    }

    response = await this.pullHistory();
    if (!response) {
      throw new Error("Couldn't pull user history");
      return false;
    }

    this.setState({chats: response.chats});
  }

  async pullHistory() {
    let url = "/api/history";
    let json;

    try {
      let response = await fetch(url, {credentials: "include"});
      json = await response.json();
    } catch (err) {
      console.log(err);
      return false;
    }

    if (json.chats === undefined) {
      throw new Error("Unknown pull result response", json);
      return false;
    }

    return json;
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


  render() {
    return (
        <div>
          <h1 className="heading">Recent chats</h1>
          <ChatHistory chats={this.state.chats}/>
        </div>
    );
  }
}

class ChatHistory extends React.Component {
  render() {
    if (this.props.chats.length === 0) {
      return (
          <div className="no-history">
            You don't have any chats yet
          </div>
      );
    }

    return (
        <div className="chats-rows">
          {this.props.chats.map(function (chat) {
            return (
                <div className="chat-row">
                  {chat.messages[0].timestamp} | {chat.duration} | {(!!chat.result.liked) ? "Liked" : "Not liked"} | {(!!chat.result.reported) ? chat.result.reported : "Not reported"}
                </div>
            );
          })}
        </div>
    );
  }
}
