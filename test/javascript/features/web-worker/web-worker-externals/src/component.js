import React from 'react';

export default class WebWorker extends React.Component {
  state = { messageFromWorker: 'Waiting for message' };
  componentDidMount() {
    const myWorker = new Worker('web-worker.js');
    myWorker.onmessage = e => {
      this.setState({ messageFromWorker: e.data });
    };
  }

  render() {
    return <h1>{this.state.messageFromWorker}</h1>;
  }
}
