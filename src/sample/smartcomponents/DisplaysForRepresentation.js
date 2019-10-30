import React, {Component} from "react";
import type {SampleStavanger} from "../stavanger";
import {ButtonGroup, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class DisplaysForRepresentation extends Component {

    render() {
        const {displays, flows} = this.props;
        const {representation} = this.props.ownProps;
        if (representation.data) {
            return (
                <React.Fragment>
                    {displays.data.filter(item => item.data.representation == representation.data.id).map( (display,key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate to={"/display/"+display.data.id}> 2D </ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={key} size="sm" outline  to={"/displayflow/"+flow.data.id+ "/display/" + display.data.id}>
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
    displays: stavanger.displays.selectors.getModel,
    flows: stavanger.displayflows.selectors.getModel,
    ownProps: stavanger.displays.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: SampleStavanger) =>  ({
    initPage: (flowid,displayid) => stavanger.page.model.initPage.request({flow: flowid, display: displayid}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(DisplaysForRepresentation);
