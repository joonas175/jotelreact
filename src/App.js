import React from 'react';
import './App.css';
import Home from './home/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  Navbar,
  Nav
} from 'react-bootstrap'

function App() {
  return (
    <div className="App">
      <Router>
          <Navbar bg='light' >
            <Nav>
              <Nav.Link>Home</Nav.Link>
            </Nav>
          </Navbar>

          <Switch>
            <Route path='/'>
              <Home/>
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
