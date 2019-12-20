import React from "react";
import {connectOpera} from "../alta/react";
import {rootStavanger} from "../rootStavanger";
import {headerStavanger} from "../header/stavanger";
import {orchestraterEpic} from "../header/orchestrator";

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
            </header>
        )
    }
}

export default connectOpera(headerStavanger)(orchestraterEpic)(Header)("smallheader",rootStavanger);
