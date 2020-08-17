import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Users from './Pages/Users';
import Auth from './Pages/Auth';
import Dashboard from './Pages/Dashboard';
import './styles/App.scss';


class App extends Component {
    render() {
        return (
            <Router>
                <Switch>                
                <Route path="/auth" exact>
                    <Auth />
                </Route>
                    <Route path="/dashboard" exact>
                        <Dashboard />
                    </Route>
                    <Redirect from='/' to='/auth'/>
                </Switch>

            </Router>

        );
    }
}
export default App;
