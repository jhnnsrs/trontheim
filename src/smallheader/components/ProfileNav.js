import React, {Component} from 'react';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink} from "reactstrap";
import Avatar from "react-avatar";
import type {HeaderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import {userPortal} from "../../portals";

class ProfileNav extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        const {user, logout, oslo } = this.props;

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle tag="a" className="nav-link" caret>
                    {user ? user.username : ""}
                    {user ? <Avatar facebookId="1340768059" color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} name={user.username} size={25} round={true} /> : ""}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem header size={"sm"}>Experiments</DropdownItem>
                    <DropdownItem> My Experiments</DropdownItem>
                    <DropdownItem> My Samples </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem header size={"sm"}>{oslo.name}</DropdownItem>
                    <DropdownItem onClick={logout}>Logout {user ? user.username : "Loading"}</DropdownItem>

                </DropdownMenu>
            </Dropdown>
        );
    }
}


const mapStavangerToProps = (stavanger: HeaderStavanger) => ({
    user: userPortal,
    oslo: stavanger.oauth.selectors.getCurrentEndpoint
});

const mapStavangerToDispatch  = (stavanger: HeaderStavanger) =>  ({
    openModal: () => stavanger.page.model.setProp.request({prop: "modalOpen", value: true}),
    logout: () => stavanger.oauth.model.logout.request()
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ProfileNav);

