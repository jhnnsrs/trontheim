import React, {Component} from "react";
import type {SampleStavanger} from "../stavanger";
import {ButtonGroup, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import * as _ from "lodash";

class ExhibitsForRepresentation extends Component {

    render() {
        const {exhibits, flows} = this.props;
        const {representation} = this.props.ownProps;
        if (representation.data) {
            return (
                <React.Fragment>
                    {exhibits.data.filter(item => item.data.representation == representation.data.id).map( (exhibit, key) =>
                        <Row className="mt-2" key={key}>
                            <ButtonGroup >
                                <ButtonToNavigate size="sm" to={"/exhibit/" + exhibit.data.id}> 3D </ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={_.uniqueId()} size="sm" outline  to={"/exhibitflow/"+flow.data.id+ "/exhibit/" + exhibit.data.id}>
                                        {flow.data.name}
                                    </ButtonToNavigate>
                                )}
                            </ButtonGroup>
                        </Row>)
                    }
                </React.Fragment>);
        }
        else {
            return ""
        }
    }
}

const mapStavangerToProps = (stavanger: SampleStavanger) => ({
    exhibits: stavanger.exhibits.selectors.getModel,
    flows: stavanger.exhibitflows.selectors.getModel,
    ownProps: stavanger.exhibits.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
    initPage: (flowid,displayid) => stavanger.page.model.initPage.request({flow: flowid, display: displayid}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExhibitsForRepresentation);
