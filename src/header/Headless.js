import {Container, Navbar, NavbarBrand, NavbarToggler} from "reactstrap";
import {NavigationBar} from "./components/NavigationBar";
import React from "react";
import {connectOpera} from "../alta/react";
import {rootStavanger} from "../rootStavanger";
import {headerStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";

class Headless extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render () {
        return (
            <header>
                <Container>
                </Container>
            </header>
        )
    }
}

export default connectOpera(headerStavanger)(orchestraterEpic)(Headless)("headless",rootStavanger);
