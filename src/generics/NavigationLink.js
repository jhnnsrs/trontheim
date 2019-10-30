import {Link, withRouter} from 'react-router-dom'
import {Button, NavLink} from "reactstrap";
import React from "react"

const NavigationLink = (props) => (
    <NavLink><Link to={props.to}>{props.children}</Link></NavLink>
);

export default NavigationLink