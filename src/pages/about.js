import React from "react";

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '#why',
    };

    this.onTabClick = this.onTabClick.bind(this);
  }

  componentDidMount() {
    if (this.props.location.hash === '#who') {
      this.setState({ activeTab: this.props.location.hash });
    }
  }

  onTabClick(e) {
    let id = e.target.id;

    if (id !== 'why' && id !== 'who') {
      return;
    }

    // If I push into history, the location.key changes, and that triggers the page to reload of course. Bug #3
    // this.props.history.push("/about#" + id);

    // Another way to make it work
    // this.context.router.history.push("/about#" + id);
    this.setState({ activeTab: '#' +  id});
  }

  render() {
    const activeWhy = this.state.activeTab === "#why";
    const activeWho = this.state.activeTab === "#who";

    return (
      <div className={`main-content`}>
        <h1 className={`header`}>About</h1>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          <span id={`why`} className={activeWhy ? 'active-tab' : ''} onClick={this.onTabClick}>Why</span> |
          <span id={`who`} className={activeWho ? 'active-tab' : ''} onClick={this.onTabClick}>Who</span>
          <div className={activeWhy ? 'active-content' : 'inactive-content'}>
            Why content
          </div>
          <div className={activeWho ? 'active-content' : 'inactive-content'}>
            Who content
          </div>
        </div>
      </div>
    );
  }
}
