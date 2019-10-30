import {Container, Navbar, NavbarBrand, NavbarToggler} from "reactstrap";
import {NavigationBar} from "./components/NavigationBar";
import React from "react";
import {connectOpera} from "../alta/react";
import {rootStavanger} from "../rootStavanger";
import {headerStavanger} from "./stavanger";
import {orchestraterEpic} from "./orchestrator";

class Header extends React.Component {

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
                    <Navbar color="faded" light expand="md" className="align-items-center">
                        <NavbarBrand href="/" className={"ml-1"}><img src="/images/logo.jpg" height={41}/></NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <NavigationBar open={this.state.isOpen}/>
                    </Navbar>
                </Container>
            </header>
        )
    }
}

export default connectOpera(headerStavanger)(orchestraterEpic)(Header)("header",rootStavanger);
