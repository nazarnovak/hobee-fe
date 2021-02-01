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
                <p>We believe in a world, where people are more connected, happier, and understand each other better -
                    together with you we believe we can improve that</p>
                <p>People are now more lonely than ever (In US, for example, number of close friends dropped from 3 in
                    1985 to 2 in 2011. Similar stats can be found <a href="https://sites.google.com/view/sourcesloneliness/startseite">here</a>),
                    during a time when we are most connected than ever with internet and different communities</p>
                <p>We <a href="https://fs.blog/2021/01/mistrust">don't trust each other</a> and don't feel like we
                    connect with people around us or people online. Not everyone has the best communication skills and
                    expresses themself clearly. We'd like to focus on the dialogue and make it rich and engaging. A lot
                    of existing services are quite confusing too - a lot of the work is up to you to find the right fit:
                    you need to know yourself, what you want, then try to figure out what kind of
                    person you want to talk to, and how to talk with them, taking into consideration their individual
                    needs and the way they communicate. That process is very complicated and even if you know all of the
                    above - the existing tools might not help your situation better. It's a very noisy and busy world
                    out there - it's not easy to do. Focusing only on topics and interests you like alone might not be enough</p>
                <p>Our belief is that it doesn't matter what background,
                    race, sex, religion you have, what interests or topics you are discussing. We believe understanding comes on a
                    deeper, more personal level, and part of it is you discovering yourself better, and discovering
                    people you interact with, and how to get to know them - we're just a tool that helps you simplify
                    that process</p>
                <p>We believe we can start small and improve, together with you, to increase the likelyhood of you
                    having a great chat with someone you didn't know before, and finding a happy conversation, a new
                    best friend, or a soulmate</p>
                <p>It is a difficult journey and we need any help we can get, if you ever feel like something on the
                    service doesn't work or makes you unhappy - please <a href="/contact">let us know right away</a>.
                    Anything you feel and think about, we highly value your opinion and it's valuable for us to be
                    better and learn. We want to understand you and help you to be happier - that's what we're about</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
