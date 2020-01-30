import React from "react";
import {Route,} from "react-router-dom";
import {connectInstrument} from "../alta/react";
import {hasUserPortal} from "../portals";
import type {RootStavanger} from "../rootStavanger";
import Landing from "../landing"

const PrivateRoute = ({ component: Component, hasUser,  ...rest }) => {

    // Add your own authentication on the below line.
    return (
        <Route
            {...rest}
            render={props =>
                hasUser ? (
                    <Component {...props} />
                ) : (
                    <Landing/>
                )
            }
        />
    )
}

const mapStavangerToProps = (stavanger: RootStavanger) => ({
    hasUser: hasUserPortal
});

const mapStavangerToDispatch  = (stavanger: RootStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(PrivateRoute);

