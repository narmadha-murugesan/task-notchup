import './App.css';
import React, {Component} from 'react';
import FormPage from './FormPage.js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'



function App() {
  return (
     <Router>
        <Route exact path="/" component={FormPage}/>
      </Router>
  );
}

export default App;
