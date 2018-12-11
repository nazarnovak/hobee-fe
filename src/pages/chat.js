import React from "react";

const logo = require('../images/h.svg');

const styles = {
  logo: {
    position: 'absolute',
    height: '50px',
    top: '50%',
    left: '50%',
    margin: '-25px 0 0 -25px',
  }
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: true,
      loaderTop: 0,
    };
  }

  componentDidMount() {
    let loadTime = 3000;

    const logoEl = this.refs.logo;

    this.setState( { loaderTop: this.getOffset(logoEl).top });

    let that = this;

    setTimeout(function() {
      that.waitRemainder(loadTime);
    }, loadTime);
  }

  moveLogoUp() {
    const logoEl = this.refs.logo;
    // 10 is the top for the logo

    const distance = this.getOffset(logoEl).top - 10;

    var i;
    for (i = distance; i > 0; i = i - 0.1) {
      this.doSetTimeout(i);
    }
  }

  doSetTimeout(i) {
    const that = this;

    setTimeout(function() {
        that.setState({ loaderTop: i });
      }, 1000);
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  waitRemainder(loadTime) {
    let that = this;

    // Full animation time is 2s, so we need to make it finish the animation before proceeding
    setTimeout(function() {
      that.setState({ animate: false });

      that.moveLogoUp();
    }, loadTime % 2000);
  }

  render() {
    const { animate, loaderTop } = this.state;
console.log(loaderTop);
    return (
        <img src={logo} style={{ ...styles.logo, top: loaderTop ? loaderTop : '50%' }} alt="Logo" className={animate ? `loader-animate` : ``} ref={`logo`} />
    );
  }
}
