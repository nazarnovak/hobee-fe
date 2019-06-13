import React from "react";

import Chat from "./chat";

// TODO:
// - Clean everything up as much as possible into old code vs new code and then git commit!
// - If error - show reconnect link
// - Would be cool if there is any error happening to send it back to the backend to see what possible
// problems user had on the FE
// - Maybe have a counter of fails to "Reconnect". If it's like 3-5-10 - show a "Contact support" link
// so the user doesn't torture themselves ;(
// - Set websocket field as a global state parameter! That way even if you change pages the websockets will still be alive
// ^_^
// - Maybe check status when connected to WS, that way we know if we're ready to chat or there's an existing
// chat going on right now so we can reconnect to it?
// - Probably overcomplicating the loading/connecting/matching page design? :(

export default class GOT extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return <Chat />
  }
}
