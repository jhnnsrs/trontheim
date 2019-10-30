import {Col} from "reactstrap";
import React from "react";

export const Sidebar = (props) =>
    <Col xs={12}  md={5} lg={3} xl={2}>
        {props.children}
    </Col>


export const MainContainer = (props) =>
    <Col xs={12}  md={7} lg={9} xl={10}>
        {props.children}
    </Col>
