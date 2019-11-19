import {ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React from "react";
import type {NameExtractorStavanger} from "./index";

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
                    {this.props.list.map(item => <DropdownItem key={item.data.id} onClick={() => this.props.select(item)}>{item.data.name}</DropdownItem>)}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}



const mapStavangerToProps = (stavanger: NameExtractorStavanger) => ({
    list: stavanger.filematchstrings.selectors.getList,
    selected: stavanger.filematchstrings.selectors.getSelected
});

const mapStavangerToDispatch  = (stavanger: NameExtractorStavanger) =>  ({
    select: (item) => stavanger.filematchstrings.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LayoutSelector);