import React from "react";

import Nav from "../nav";

export default class Contact extends React.Component {
  render() {
    return (
      <div>
        <Nav location={this.props.location} />
        <div className="main-content">
          <div className="auth-page">
            <h1 className={`heading`}>Why</h1>
            <div className={`text-content`}>
                <p>We believe in a world, where people are more connected and happier together. People are now more lonely than ever (In the US for example, number of close friends, dropped from 3 in 1985 to 2 in 2011. More similar stats can be found <a href="https://sites.google.com/view/sourcesloneliness/startseite">here</a>), during a time when we are most connected than ever with internet and different communities</p>
                <p>We don't trust each other and don't feel like we connect with people around us or people online, that's what we're trying to solve. Our belief is that it doesn't matter what background, race, sex, religion you're have, or interests or topics you are discussing. We believe understanding comes on a deeper, more personal level, and part of it is you discovering yourself, and discovering what people you're interested in, we are just a tool that helps you speed up that process</p>
                <p>A lot of existing services are quite scattered - the choice is up to you to find the right fit, to know yourself and what you are and what you want, try to figure out who you want to find and what you want from them, that process is complicated and it's a very noisy and busy world out there, it's not easy to do it</p>
                <p>We believe we can start small and improve, together with you, to increase the likelyhood of you having a great chat with someone you didn't know before, and finding a happy conversation, a new best friend, or a soulmate</p>
                <p>It is a difficult journey and we need any help we can get, if you ever feel like something on the service doesn't work or makes you unhappy - please <a href="/contact">let us know right away</a>. Anything you feel and think about, we highly value your opinion and it's valuable for us to be better and learn. We want to understand you and help you to be happier - that's what we're about</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
