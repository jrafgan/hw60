import React, { Component } from 'react';
import Form from "./components/Form/Form";
import ChatBox from "./components/ChatBox/ChatBox";

import './App.css';

class App extends Component {
    state = {
        messages: [],
        datetime: null
    };

    endpointURL = 'http://146.185.154.90:8000/messages';
    interval = null;

    getNewMessages(datetime = this.state.datetime) {
        let url = this.endpointURL;
        if (datetime !== null) {
            url = this.endpointURL + '?datetime=' + datetime;
        }

        fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed');
        }).then(result => {
            if (result.length !== 0) {
                let newData = [...result];
                newData = newData.reverse();
                const messages = newData.concat(this.state.messages);
                const datetime = result[result.length - 1].datetime;
                this.setState({messages, datetime});
            }
        });
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.getNewMessages()
        }, 3000);
    };

    componentWillUnmount() {
        clearInterval(this.interval)
    };

    publishMessage = (formData) => {
        const data = new URLSearchParams();
        data.set('message', formData.message);
        data.set('author', formData.author);
        fetch(this.endpointURL, {
           method: 'POST',
           body: data,
        }).then(response => {
            if (response.ok) {
                console.log('New message published');
            }
        });
    };

  render() {
    return (
      <div className="App">
        <Form publishMessage={this.publishMessage} />
          <ChatBox messages={this.state.messages}/>
      </div>
    );
  }
}

export default App;
