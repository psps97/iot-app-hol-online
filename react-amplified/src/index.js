import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import DetailPage from './DetailPage';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'


const routing = (
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/detailPage" component={DetailPage} />
                <Route component={App} />
            </Switch>
        </Router>
)
ReactDOM.render(routing, document.getElementById('root'));


serviceWorker.unregister();