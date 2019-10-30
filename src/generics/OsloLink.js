import {Link} from 'react-router-dom'
import {NavLink} from "reactstrap";
import React from "react"
import {connectInstrument} from "../alta/react";
import rootStavanger from "../rootStavanger";


const NavigationLink = (props) => {
    if (props.base) {
        let rooturl = props.api.rooturl.split("/api")[0]
        return (<NavLink>{props.api && <a href={rooturl + props.to} target="_blank" >{props.children}</a>}</NavLink>)
    }
    return (<NavLink>{props.api && <a href={props.api.rooturl + props.to} target="_blank">{props.children}</a>}</NavLink>
    )
};


const mapStavangerToProps = (stavanger) => ({
    api: rootStavanger.api.selectors.getCurrentAuth,
});

const mapStavangerToDispatch  = (stavanger) =>  ({}
);

export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(NavigationLink);

