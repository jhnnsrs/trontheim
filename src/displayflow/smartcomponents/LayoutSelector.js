import {Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import React from "react";

export default class LayoutSelector extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle outline size="sm" caret>
                    {this.props.selected ? this.props.selected.name : "No Layout Selected" }
                </DropdownToggle>
                <DropdownMenu>
                    {this.props.list.map(item => <DropdownItem onClick={() => this.props.select(item)}>{item.data.name}</DropdownItem>)}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}