import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Room from './components/Room';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/create" component={CreateRoom} />
        <Route path="/join" component={JoinRoom} />
        <Route path="/room/:id" component={Room} />
      </Switch>
    </Router>
  );
}

export default App;
