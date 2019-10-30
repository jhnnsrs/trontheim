import React, {Component} from "react";
import {Collapse, Nav, NavItem} from "reactstrap";
import {Link} from "react-router-dom";
import LoginMenu from "./LoginMenu";

export class NavigationBar extends Component<{ open: boolean }> {
    render() {
        return <Collapse isOpen={this.props.open} navbar>
            <Nav className="ml-auto ralewayed" navbar>
                <NavItem>
                    <Link to="/" className="nav-link">Home</Link>
                </NavItem>
                <NavItem>
                    <Link to="/nodes" className="nav-link">Nodes</Link>
                </NavItem>
                <NavItem>
                    <Link to="/flows" className="nav-link">Flows</Link>
                </NavItem>
                <NavItem>
                    <Link to="/flowbuilder" className="nav-link">Creator</Link>
                </NavItem>
                <NavItem>
                    <LoginMenu/>
                </NavItem>
            </Nav>
        </Collapse>;
    }
}