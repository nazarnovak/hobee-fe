import React from "react";
import { Link } from "react-router-dom";

import styles from './home.module.scss';

import Nav from "../nav";

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
    // const { didMount } = this.state;

    return (
        <div className={styles.home}>
          <Nav location={this.props.location} />
          <div className={styles.content}>
            <div className={styles.contentTop}>
              <div className={styles.motto}>Talk to friends you haven't met yet</div>
              <div className={styles.mottoExtra}>Have interesting, funny, meaningful conversations one-on-one</div>
              <Link to="/chat"><button className={`chat-button-link scale`}>Chat now</button></Link>
                {/*<FeedbackModal open={this.state.feedbackModalOpen} onClose={this.handleFeedbackClose} />*/}
                {/*<button className={`chat-button-link scale`} style={{ border: '1px solid black', width: '200px' }}*/}
                        {/*onClick={this.handleFeedbackOpen}>*/}
                  {/*Open feedback dialog*/}
                {/*</button>*/}
            </div>
            <div className={styles.jobs}>
              <div className={styles.jobsItems}>
                <div className={styles.jobsCircles}>
                  <img className={styles.jobsIcons} alt={'Discover'} />
                </div>
                <p className={styles.jobsTitles}>Search</p>
                <p className={styles.jobsTexts}>And match an interesting person</p>
              </div>
              <div className={styles.jobsItems}>
                <div className={styles.jobsCircles}>
                  <img className={styles.jobsIcons} alt={'Engage'} />
                </div>
                <p className={styles.jobsTitles}>Chat</p>
                <p className={styles.jobsTexts}>About what interests you</p>
              </div>
              <div className={styles.jobsItems}>
                <div className={styles.jobsCircles}>
                  <img className={styles.jobsIcons} alt={'Find'} />
                </div>
                <p className={styles.jobsTitles}>Enjoy</p>
                <p className={styles.jobsTexts}>A good time together</p>
              </div>
            </div>
          </div>
          <div className="footer">
            <Link className="contact-link" to="/contact">Contact</Link>
            {/*<Link className="contact-link" to="/how">How</Link>*/}
            {/*<Link className="contact-link" to="/why">Why</Link>*/}
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