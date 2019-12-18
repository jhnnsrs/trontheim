import {Container, Navbar, NavbarBrand, NavbarToggler} from "reactstrap";
import React, {Component} from "react";
import {NavigationBar} from "./NavigationBar";
import {connectInstrument} from "../../alta/react";
import type {HeaderStavanger} from "../stavanger";


class HeaderTrontheim extends Component {

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

const mapStavangerToProps = (stavanger: HeaderStavanger) => ({
});

const mapStavangerToDispatch  = (stavanger: HeaderStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(HeaderTrontheim);