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
  },
  footer: {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px -4px 2px -2px',
    fontSize: '18px',
    height: '70px',
    textAlign: 'center',
    padding: '20px 50px 20px 50px',
  },
  motto: {
    color: '#222',
    display: 'inline-block',
    fontSize: '48px',
    margin: '0',
    textAlign: 'center',
    whiteSpace: 'pre-line',
    width: '100%',
  }
}

const man = require('../images/man.png');
const woman = require('../images/woman.png');
const blueCircle = require('../images/bluecircle.png');

export default class Home extends React.Component {
// If height is less than 750 only then do we not fit everything on the screen? Or should we scale it down?
  render() {
    const sectionHeightHalf = (this.props.height - 140) / 2
    const sectionHeightTwoThirds = (this.props.height - 140) * 0.6
    const sectionHeightOneThirds = (this.props.height - 140) * 0.4
    const sectionWidthThird = (this.props.width - 100) / 3;
    const sectionWidthHalf = (this.props.width - 100) / 2;

    return (
      <div>
        <MediaQuery  query="(min-width: 801px)">
          <div style={{ backgroundColor: '#fafafc'}}>
            <div style={{ ...styles.section1, height: sectionHeightHalf}}>
              <div style={{ height: '100%', width: sectionWidthThird }}>
                <img src={man} style={{ height: '100%'}} alt="Man" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: sectionWidthThird}}>
                <div style={{...styles.motto}}>Dialogue{"\n"}definite</div>
              </div>
              <div style={{height: '100%', width: sectionWidthThird}}>
                <img src={woman} style={{ height: '100%'}} alt="Woman" />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery  query="(max-width: 800px)">
          <div style={{ backgroundColor: '#f6f6f6'}}>
            <div style={{ ...styles.section1Small}}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div style={{...styles.motto, backgroundColor: '#f6f6f6'}}>Dialogue{"\n"}definite</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', width: '100%'}}>
                <div style={{ height: '100%', width: sectionWidthHalf, display: 'flex', flexDirection: 'row'}}>
                  <img src={man} style={{ height: '100%', width: '100%'}} alt="Man" />
                </div>
                <div style={{height: '100%', width: sectionWidthHalf, display: 'flex', flexDirection: 'row'}}>
                  <img src={woman} style={{ height: '100%', width: '100%'}} alt="Woman" />
                </div>
              </div>
            </div>
          </div>
        </MediaQuery>
        <div style={{ ...styles.section2, height: sectionHeightHalf}}>
          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%', width: sectionWidthThird}}>
            <img src={blueCircle} style={{ height: '160px', width: '160px', display: 'block', margin: '20px auto 0 auto'}} alt="Quality" />
            <p style={{margin: '10px auto 0 auto', fontSize: '24px'}}>Quality</p>
            <p style={{margin: '10px 50px', textAlign: 'center'}}>Your meaningful conversation is highest priority</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%', width: sectionWidthThird}}>
            <img src={blueCircle} style={{ height: '160px', width: '160px', display: 'block', margin: '20px auto 0 auto'}} alt="Safety" />
            <p style={{margin: '10px auto 0 auto', fontSize: '24px'}}>Safety</p>
            <p style={{margin: '10px 50px', textAlign: 'center'}}>Spam, harassment, bots and other innapropriate behavior will not be tolerated</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100%', width: sectionWidthThird}}>
            <img src={blueCircle} style={{ height: '160px', width: '160px', display: 'block', margin: '20px auto 0 auto'}} alt="Commnity" />
            <p style={{margin: '10px auto 0 auto', fontSize: '24px'}}>Community</p>
            <p style={{margin: '10px 50px', textAlign: 'center'}}>Smallest feedback you have is very critical in making us better</p>
          </div>
        </div>
        <div style={{ ...styles.footer }}><Link to="/about">About</Link></div>
      </div>
    );
  }
}
