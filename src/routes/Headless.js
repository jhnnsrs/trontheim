import React, {Component} from "react";
// common dumbcomponents
import NodePop from "../nodepop";
import SmallHeader from "../smallheader";
import PrivateRoute from "../auth/PrivateRoute";
import External from "../external";
import {Route} from "react-router-dom";
import Headless from "../header/Headless";

class Wrapped extends Component {

    render() {
        return (
            <React.Fragment>
                <Headless/>
                <div className="wrap nana">
                    <PrivateRoute path={`/external/:externalid`} component={External}/>
                </div>
            </React.Fragment>
        );
    }
}

export default Wrapped;
