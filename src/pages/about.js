import React from "react";

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabWho: false,
    };

    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    if (this.props.location.hash === '#who') {
      this.setState({ activeTabWho: true });
      return;
    }
  }

  onTabClick(e) {
    let id = e.target.id;
    let anchor = '#' + id;

    switch(id) {
      case 'why':
        this.setState({ activeTabWho: false});
        anchor = '';
        break;
      case 'who':
        this.setState({ activeTabWho: true});
        break;
      default:
        // Unknown id
        return;
    }

    // If I push into history, the location.key changes, and that triggers the page to reload of course. Bug #3
    // this.props.history.push("/about" + anchor);

    // Another way to make it work
    // this.context.router.history.push("/about" + anchor);
  }

  render() {
    const { activeTabWho } = this.state;

    const whyContent = `It is my belief that you should be able to go online, connect to a person and have a great conversation.` +
        `It doesn't even have to be great, but it can be meaningful, interesting and engaging, and I couldn't find ` +
        `a platform like that myself. We don't choose the environments we grow up in, and we're sometimes stuck in a weird place in` +
        `life, but that doesn't mean that you have to be alone. I'm strongly convinced that everyone deserves to be heard and to ` +
        `have a way of communicating with others, without necessary knowing them in real life or even speaking to them ever again`;
    const whoContent = `<img> I'm a 27 year old self-taught programmer who lives and works in Malmö and who's deeply motivated to
         contribute into wellness of everyone, and I'm confident that if we'll work in the same direction we can achieve excellence`;

    return (
      <div className={`main-content`}>
        <h1 className={`header`}>About</h1>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          <span id={`why`} className={activeTabWho ? '' : 'active-tab'} onClick={this.onTabClick}>Why</span> |
          <span id={`who`} className={activeTabWho ? 'active-tab' : ''} onClick={this.onTabClick}>Who</span>
          <div className={activeTabWho ? 'inactive-content' : 'active-content'}>
            {whyContent}
          </div>
          <div className={activeTabWho ? 'active-content' : 'inactive-content'}>
            {whoContent}
          </div>
        </div>
      </div>
    );
  }
}
