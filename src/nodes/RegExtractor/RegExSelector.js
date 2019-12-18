import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React from "react";
import type {RegExtractorStavanger} from "./index";

class LayoutSelector extends React.Component {
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
                    {this.props.selected.data ? this.props.selected.data.name : "No FileMatch Selected" }
                </DropdownToggle>
                <DropdownMenu>
                    {this.props.list.map(item => <DropdownItem onClick={() => this.props.select(item)}>{item.data.name}</DropdownItem>)}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}



const mapStavangerToProps = (stavanger: RegExtractorStavanger) => ({
    list: stavanger.filematchstrings.selectors.getList,
    selected: stavanger.filematchstrings.selectors.getSelected
});

const mapStavangerToDispatch  = (stavanger: RegExtractorStavanger) =>  ({
    select: (item) => stavanger.filematchstrings.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LayoutSelector);