import React from "react";

import Nav from "../nav";

export default class Contact extends React.Component {
  render() {
    return (
      <div>
        <Nav location={this.props.location} />
        <div className="main-content">
          <div className="auth-page">
            <h1 className={`heading`}>How</h1>
            <div className={`text-content`}>
              <p>All the focus is about conversations and what you feel about it, from when we try to match you with the right person, start the conversation and help you with it. That is why it's critical for us to understand if you liked or disliked the conversation</p>
              <p>The more you <a href="/chat">chat</a>, the more we can help you improve the likelihood of matching someone you want. Immediate question can arise - are you storing and processing my chat? Yes it is stored for a limited time, and it is processed with a single purpose - improve the platform, and understand you, your likes and needs, to match you appropriately. If you have any questions about it, please <a href="/contact">contact us</a></p>
              <p>There's a better solution in the works soon, that will allow you to be in complete control over your information and chats, and not allow us to process it if you don't want to. We believe in complete transparency and privacy towards the user. More information on that is coming soon</p>
              <p>Additionally, please let us know why do you want to have a chat right now, and <a href="/contact">let us know</a> about any thoughts you have about the service, if something works great, or sucks, we appreciate all opinions - that help us be better for you and provide you with a better service</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
