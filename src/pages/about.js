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

    return (
      <div className={`main-content`}>
        <h1 className={`header`}>About</h1>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          <span id={`why`} className={activeTabWho ? '' : 'active-tab'} onClick={this.onTabClick}>Why</span> |
          <span id={`who`} className={activeTabWho ? 'active-tab' : ''} onClick={this.onTabClick}>Who</span>
          <div className={activeTabWho ? 'inactive-content' : 'active-content'}>
            Why content
          </div>
          <div className={activeTabWho ? 'active-content' : 'inactive-content'}>
            Who content
          </div>
        </div>
      </div>
    );
  }
}
