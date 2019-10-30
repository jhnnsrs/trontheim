import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { Container } from 'reactstrap';



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
                        <NavbarBrand href="/#" className={"ml-1"}><img src="../images/jhnnsrs.png" height={41}/></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto ralewayed" navbar>
                                <NavItem>
                                    <NavLink href="" style={{color:"black"}}><b>Home</b></NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </Container>
            </header>
        )
    }
}

export default HeaderTrontheim;