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
              <p>All the focus is about conversations and what you feel about it, from the moment we try to match you
                with the right person to starting the conversation to helping you during it. That is why it's critical
                for us to understand how it went for you, what was great and what we can do better for you</p>
              <p>Higher number of <a href="/chat">chats</a> will help us learn more about you, how to match you
                better, and improve the platform for everyone. You probably wonder now - are you storing and
                processing my chat? First of all, it is encrypted, so no one can read it in the open. It is stored
                for a limited time, and it is processed with a single purpose - improve the platform, understand
                you, and match your needs, all to match you best in the future. If you have any questions about it,
                please <a href="/contact">contact us</a></p>
              <p>There's a better solution in the works, that will allow you to be in complete control over your
                information and chats, and not allow us to process it if you don't want to. We believe in complete
                transparency and privacy towards the user. More information on that is coming soon</p>
              <p>Additionally, please let us know what you want to talk about and why before you match someone,
                and <a href="/contact">let us know</a> about any thoughts you have about the service, if something
                works great, or sucks, we appreciate all opinions - that helps us be best for you and provide you
                with the best service</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
