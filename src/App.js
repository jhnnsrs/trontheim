import React, {Component} from "react";
import {Provider} from 'react-redux'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import store from './store';
// Styles
import './App.scss';
// common dumbcomponents
import Wrapped from "./routes/Wrapped";
import Headless from "./routes/Headless";


class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <Switch>
                            <Route path={`/nodepop/:nodeid/instance/:instanceid/channel/:channelid`} component={Headless}/>
                            <Route path={"/"} component={Wrapped}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;

