import React, { Component } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './styles/App.scss';

class App extends Component {
    render() {
        return (<Router>
            <div className="App">
                <h1>Chat app</h1>
            </div>
            </Router>

        );
    }
}
export default App;
