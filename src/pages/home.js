import React from "react";
import { Link } from "react-router-dom";
import MediaQuery from 'react-responsive';
import Nav from "../nav";

const styles = {
  section1: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '0 50px',
    borderBottom: '1px solid #e6e6e6',
    minHeight: '300px',
    height: '100%',
  },
  section1Small: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  section2: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '0 50px',
    minHeight: '300px',
    height: '100%',
    backgroundColor: '#fcfcff',
  },
  footer: {
    // boxShadow: 'rgba(0, 0, 0, 0.1) 0px -4px 2px -2px',
    border: '1px solid #ccc',
    fontSize: '16px',
    lineHeight: '70px',
    height: '70px',
    textAlign: 'center',
    padding: '0 50px',
    boxSizing: 'border-box',
  },
  motto: {
    color: '#fff',
    display: 'inline-block',
    fontSize: '54px',
    margin: '0',
    textAlign: 'center',
    // whiteSpace: 'pre-line',
    width: '100%',
  }
}

// const blueCircle = require('../images/bluecircle.png');
// const checkmark = require('../images/checkmark.svg');
// const shield = require('../images/shield.svg');
// const people = require('../images/people.svg');
// const people2 = require('../images/people2.svg');
// const crown = require('../images/crown.svg');

const crown2 = require('../images/crown2.svg');
const shield2 = require('../images/shield2.svg');
const people4 = require('../images/people4.svg');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didMount: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
        this.setState({didMount: true})
    }, 0)
  }

// If height is less than 750 only then do we not fit everything on the screen? Or should we scale it down?
  render() {
    const sectionHeightHalf = (this.props.height - 140) / 2;
    const sectionWidthThird = (this.props.width - 100) / 3;

    const { didMount } = this.state;

    return (
      <div class="home scale">
        <Nav location={this.props.location} />
        <div className="home-main">
          <div className="motto scale">
            <div className="motto-main scale">Quality conversations</div>
            <div className="motto-extra scale">Anonymous dialogue chat, with the focus on the quality of the conversation</div>
          </div>
          <div className="jobs scale">
            <div className="jobs-items scale">
              <div className="jobs-circles">
                {/*<img src={crown2} height="100px" widht="100px" style={{ display: 'block', margin: '25px auto' }} alt={'Crown'} />*/}
              </div>
              <p className="jobs-titles">Discover</p>
              <p className="jobs-texts">New people and share your stories</p>
            </div>
            <div className="jobs-items scale">
              <div className="jobs-circles">
                {/*<img src={shield2} height="80px" widht="80px" style={{ display: 'block', margin: '35px auto 25px auto' }} alt={'Shield'} />*/}
              </div>
              <p className="jobs-titles">Engage</p>
              <p className="jobs-texts">In an interesting discussion or a simple conversation</p>
            </div>
            <div className="jobs-items scale">
              <div className="jobs-circles">
                {/*<img src={people4} height="100px" widht="100px" style={{ display: 'block', margin: '25px auto 5px auto' }} alt={'People'} />*/}
              </div>
              <p className="jobs-titles">Find</p>
              <p className="jobs-texts">Wonderful experiences and relationships</p>
            </div>
          </div>
        </div>
        <div className="footer">
          <span className="footer-item"><Link to="/contact">Contact</Link></span>
        </div>
      </div>
    );
  }
}
