import React, {Component} from "react";
// common dumbcomponents
import NodePop from "../nodepop";
import SmallHeader from "../smallheader";
import PrivateRoute from "../auth/PrivateRoute";

class Wrapped extends Component {

    render() {
        return (
            <React.Fragment>
                <SmallHeader/>
                <div className="wrap nana">
                <PrivateRoute path={`/nodepop/:nodeid/instance/:instanceid/channel/:channelid`} component={NodePop}/>
                </div>
            </React.Fragment>
        );
    }
}

export default Wrapped;
