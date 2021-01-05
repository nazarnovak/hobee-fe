import React from "react";
import { Link } from "react-router-dom";
import Nav from "../nav";

const telescope = require('../images/telescope.svg');
const rocket = require('../images/rocket.svg');
const astronauts = require('../images/astronauts.svg');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
      feedbackModalOpen: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ didMount: true })
    }, 0)
  }

  handleFeedbackOpen = () => {
    this.setState({ feedbackModalOpen: true });
  }

  handleFeedbackClose = () => {
    this.setState({ feedbackModalOpen: false });
  }

// If height is less than 750 only then do we not fit everything on the screen? Or should we scale it down?
  render() {
    // const sectionHeightHalf = (this.props.height - 140) / 2;
    // const sectionWidthThird = (this.props.width - 100) / 3;

    // const { didMount } = this.state;

    return (
        <div class="home scale">
          <Nav location={this.props.location} />
          <div className="home-main scale">
            <div className="motto scale">
              <div className="motto-main scale">Hobee chat - happy chats</div>
              <div className="motto-extra scale">Have interesting, funny, meaningful chats!</div>
                <Link to="/chat"><button className={`chat-button-link scale`}>Chat now</button></Link>
                {/*<FeedbackModal open={this.state.feedbackModalOpen} onClose={this.handleFeedbackClose} />*/}
                {/*<button className={`chat-button-link scale`} style={{ border: '1px solid black', width: '200px' }}*/}
                        {/*onClick={this.handleFeedbackOpen}>*/}
                  {/*Open feedback dialog*/}
                {/*</button>*/}
            </div>
            <div className="jobs">
              <div className="jobs-items-wrapper scale">
                <div className="jobs-items scale">
                  <div className="jobs-circles scale">
                    <img className="jobs-icons scale" src={telescope} alt={'Discover'} />
                  </div>
                  <p className="jobs-titles">Discover</p>
                  <p className="jobs-texts scale">New people, share your expriences, and explore new stories </p>
                </div>
                <div className="jobs-items scale">
                  <div className="jobs-circles scale">
                    <img className="jobs-icons scale" src={rocket} alt={'Engage'} />
                  </div>
                  <p className="jobs-titles">Engage</p>
                  <p className="jobs-texts scale">Interesting discussions, fun chats, and share a happy moments together</p>
                </div>
                <div className="jobs-items scale">
                  <div className="jobs-circles scale">
                    <img className="jobs-icons scale" src={astronauts} alt={'Find'} />
                  </div>
                  <p className="jobs-titles">Find</p>
                  <p className="jobs-texts scale">Amazing connections, someone you're happy with, and who understands you</p>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Link className="contact-link" to="/contact">Contact</Link>
          </div>
        </div>
    );
  }
}

// class FeedbackModal extends React.Component {
//   render() {
//     if (!this.props.open) {
//       return null;
//     }

//     return (
//         <div className="backdrop" onClick={this.props.onClose}>
//           <div className="report-modal">
//             <div className="report-header">
//               <div className="report-header-side"></div>
//               <div className="report-header-title">Feedback</div>
//               <div className="report-header-side">
//                 <img className="report-x" src={svgXGrey} alt="Close" onClick={this.props.onClose}></img>
//               </div>
//             </div>
//             <div className="report-options">
//               Test
//             </div>
//           </div>
//         </div>
//     );
//   }
// }