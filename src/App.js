import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Chat} />
        <Route path="/login/:roomId"  component={Join} />
      </Switch>
    )
  }
}

export default App;
