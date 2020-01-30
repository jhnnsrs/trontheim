import React, {Component} from "react";
import {Provider} from 'react-redux'
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom'
import store from './store';
// Styles
import './App.scss';
// common dumbcomponents
import Wrapped from "./routes/Wrapped";
import Headless from "./routes/Headless";
import {isHashRouter} from "./constants/endpoints";
import QuickLinksCard from "./myhome/smartcomponents/QuickLinksCard";
import Neuroglancer from "@janelia-flyem/react-neuroglancer";
import {Sidebar} from "./common/components/HomeRow";
import {Card} from "reactstrap";

const Router = (props) => isHashRouter ? <HashRouter>{props.children}</HashRouter> : <BrowserRouter>{props.children}</BrowserRouter>



class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route path={`/external/`} component={Headless}/>
                            <Route path={"/"} component={Wrapped}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;

