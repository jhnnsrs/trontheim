import React from "react";
import {Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
import ArnHeimHostSelector from "./ArnHeimHostSelector";
import VarietySelector from "./VarietySelector";
import EntitySelector from "./EntitySelector";
import EntityForm from "./EntityForm";


export default class NodeForm extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        return (
            <Card inverse className="mt-2 bg-dark">
                <CardBody>
                     <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Start
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                >
                                   Variety
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                >
                                    Entity
                                </NavLink>
                            </NavItem>
                         <NavItem>
                             <NavLink
                                 className={classnames({ active: this.state.activeTab === '4' })}
                             >
                                 Settings
                             </NavLink>
                         </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Card inverse className="mt-2 bg-dark">
                                    <CardBody>
                                        Please select your Arnheim Backend where the Node will live. Normally this is easily set to your current Oslo Backend where your data lives.
                                    </CardBody>
                                </Card>
                                <ArnHeimHostSelector toggle={this.toggle}/>
                            </TabPane>
                            <TabPane tabId="2">
                                <VarietySelector toggle={this.toggle}/>
                            </TabPane>
                            <TabPane tabId="3">
                                <EntitySelector toggle={this.toggle}/>
                            </TabPane>
                            <TabPane tabId="4">
                                <EntityForm toggle={this.toggle}/>
                            </TabPane>
                        </TabContent>
                </CardBody>
            </Card>
        );
    }
}

