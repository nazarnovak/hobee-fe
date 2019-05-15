import React from "react";
import { Link } from "react-router-dom";
import MediaQuery from 'react-responsive';

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
    const sectionHeightHalf = (this.props.height - 140) / 2
    // const sectionHeightTwoThirds = (this.props.height - 140) * 0.6
    // const sectionHeightOneThirds = (this.props.height - 140) * 0.4
    const sectionWidthThird = (this.props.width - 100) / 3;
    // const sectionWidthHalf = (this.props.width - 100) / 2;

    const { didMount } = this.state;

    return (
      <div style={{ position: 'absolute', top: '70px', zIndex: '1'}}>
        <MediaQuery  query="(min-width: 801px)">
          <div style={{ backgroundColor: '#0074d9', height: sectionHeightHalf }} className={`fade-in-motto-bg ${didMount && 'visible'}`}>
          {/*<div style={{ backgroundImage: 'linear-gradient(180deg, #4fadff 10%, #0074d9)'}}>*/}
            <div style={{ ...styles.section1 }}>
              {/*<div style={{ height: '100%', width: sectionWidthThird }}>*/}
                {/*<img src={man} style={{ height: '100%'}} alt="Man" />*/}
              {/*</div>*/}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: sectionWidthThird}}>
                <div style={{...styles.motto}} className={`fade-in-motto ${didMount && 'visible'}`}>Dialogue definite</div>
                <div>Discuss your ideas, discover interesting people (What is the problem this site is solving?)</div>
              </div>
              {/*<div style={{height: '100%', width: sectionWidthThird}}>*/}
                {/*<img src={woman} style={{ height: '100%'}} alt="Woman" />*/}
              {/*</div>*/}
            </div>
          </div>
        </MediaQuery>
        <MediaQuery  query="(max-width: 800px)">
          <div style={{ backgroundColor: '#0074d9'}}>
            <div style={{ ...styles.section1Small}}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div style={{ ...styles.motto }}>Dialogue{"\n"}definite</div>
              </div>
              {/*<div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%'}}>*/}
                {/*<div style={{ height: '100%', width: sectionWidthHalf, display: 'flex', flexDirection: 'row'}}>*/}
                  {/*<img src={man} style={{ height: '100%', width: '100%'}} alt="Man" />*/}
                {/*</div>*/}
                {/*<div style={{height: '100%', width: sectionWidthHalf, display: 'flex', flexDirection: 'row'}}>*/}
                  {/*<img src={woman} style={{ height: '100%', width: '100%'}} alt="Woman" />*/}
                {/*</div>*/}
              {/*</div>*/}
            </div>
          </div>
        </MediaQuery>
        <div style={{ ...styles.section2, height: sectionHeightHalf }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%',
            width: sectionWidthThird, padding: '25px', boxSizing: 'border-box' }}
               className={`fade-in-circle-1 ${didMount && 'visible'}`}>
            <div style={{ height: '150px', width: '150px', display: 'block', margin: '0 auto',
              backgroundColor: '#ffffff', borderRadius: '150px', border: '1px solid #e6e6e6',
              boxShadow: 'rgba(150, 150, 150, 0.4) 0px 2px 6px 0px' }}>
              <img src={crown2} height="100px" widht="100px" style={{ display: 'block', margin: '25px auto' }} alt={'Crown'} />
            </div>
            <p style={{margin: '20px auto 0 auto', fontSize: '24px', color: '#222', fontWeight: '600'}}>Quality</p>
            <p style={{margin: '15px 40px', textAlign: 'center', fontSize: '18px', color: '#666', fontWeight: '400'}}>Your meaningful conversation is highest priority</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%',
            width: sectionWidthThird, padding: '25px', boxSizing: 'border-box' }}
          className={`fade-in-circle-1 ${didMount && 'visible'}`}>
            <div style={{ height: '150px', width: '150px', display: 'block', margin: '0 auto',
              backgroundColor: "#ffffff", borderRadius: '150px', border: '1px solid #e6e6e6', boxShadow: 'rgba(150, 150, 150, 0.4) 0px 2px 6px 0px' }}><img src={shield2} height="80px" widht="80px" style={{ display: 'block', margin: '35px auto 25px auto' }} alt={'Shield'} /></div>
            <p style={{margin: '20px auto 0 auto', fontSize: '24px', color: '#222', fontWeight: '600'}}>Safety</p>
            <p style={{margin: '15px 40px', textAlign: 'center', fontSize: '18px', color: '#666', fontWeight: '400'}}>Spam, harassment, bots and other inappropriate behavior are not tolerated</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%',
            width: sectionWidthThird, padding: '25px', boxSizing: 'border-box' }}
          className={`fade-in-circle-1 ${didMount && 'visible'}`}>
            <div style={{ height: '150px', width: '150px', display: 'block', margin: '0 auto',
              backgroundColor: "#ffffff", borderRadius: '150px', border: '1px solid #e6e6e6', boxShadow: 'rgba(150, 150, 150, 0.4) 0px 2px 6px 0px' }}><img src={people4} height="100px" widht="100px" style={{ display: 'block', margin: '25px auto 5px auto' }} alt={'People'} /></div>
            <p style={{margin: '20px auto 0 auto', fontSize: '24px', color: '#222', fontWeight: '600'}}>Community</p>
            <p style={{margin: '15px 40px', textAlign: 'center', fontSize: '18px', color: '#666', fontWeight: '400'}}>Smallest feedback you have is very critical in making us better</p>
          </div>
        </div>
        <div style={{ ...styles.footer }}>
          <span className={`footer-item`}><Link to="/about">About</Link></span><span className={`footer-item`}><Link to="/contact">Contact</Link></span>
        </div>
      </div>
    );
  }
}
