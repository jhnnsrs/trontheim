import * as React from "react";
import {BaseWidget, DefaultNodeProps, DefaultNodeState, DefaultPortLabel} from "storm-react-diagrams";
import * as _ from "lodash";
import "uuid";
import {Nav, NavLink} from "reactstrap";



export class ROINodeWidget extends BaseWidget<DefaultNodeProps, DefaultNodeState> {
    constructor(props: DefaultNodeProps) {
        super("srd-default-node", props);
        this.state = {};
    }

    generatePort(port) {
        return <DefaultPortLabel model={port} key={port.id} />;
    }

    render() {
        return (
            <div {...this.getProps()} style={{ background: this.props.node.color }}>
                <div className={this.bem("__title")}>
                    <div className={this.bem("__name")}>{this.props.node.name}</div>
                    {this.props.node.link && <Nav>
                        <NavLink href={this.props.node.link}>Open</NavLink>
                    </Nav>
                    }
                </div>
                <div className={this.bem("__ports")}>
                    <div className={this.bem("__in")}>
                        {_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
                    </div>
                    <div className={this.bem("__out")}>
                        {_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
                    </div>
                </div>
            </div>
        );
    }
}
