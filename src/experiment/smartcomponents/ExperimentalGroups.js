import React, {Component} from "react";
import type {ExperimentStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardText, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Samples extends Component {

    render() {
        const {expgroups} = this.props;
        if (expgroups.data) {
            return (
                <React.Fragment>
                {expgroups.data.map((group, index) =>
                        <Card className="mt-2" key={group.data.id} onClick={() => this.props.selectGroup(group)}>
                            <CardBody>
                                <CardTitle>{group.data.name}</CardTitle>
                                <CardSubtitle>Group {group.data.id} {group.data.iscontrol && "As Control"}</CardSubtitle>
                                <CardText>
                                    {group.data.description}

                                </CardText>
                                <ButtonGroup>
                                    <ButtonToNavigate outline size="sm" color={"primary"} to={"/experimentalgroup/"+group.data.id}>Open</ButtonToNavigate>
                                    <Button outline size="sm" color={"danger"} onClick={() => this.props.deleteGroup(group)}> Delete </Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: ExperimentStavanger) => ({
    expgroups: stavanger.expgroups.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ExperimentStavanger) =>  ({
    selectGroup: (group) => stavanger.expgroups.model.selectItem.request(group),
    deleteGroup: (group) => stavanger.expgroups.model.deleteItem.request(group)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Samples);
