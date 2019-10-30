import React, {Component} from "react";
import {ButtonGroup, Row} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import * as _ from "lodash";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class BioSeriesForBioImages extends Component {

    render() {
        const {bioseries, flows} = this.props;
        const {bioimage} = this.props.ownProps;
        if (bioimage.data) {
            return (
                <React.Fragment>
                    {bioseries.data.filter(item => item.data.bioimage == bioimage.data.id).map( (bioseries, key) =>
                        <Row className="mt-2"  key={key}>
                            <ButtonGroup>
                                <ButtonToNavigate key={_.uniqueId()} to={"/bioseries/"+bioseries.data.id}> Open {bioseries.data.name} </ButtonToNavigate>
                                { flows.data.map( (flow,key) =>
                                    <ButtonToNavigate key={key} size="sm" outline  to={"/bioseriesflow/"+flow.data.id+ "/bioseries/" + bioseries.data.id}>
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

const mapStavangerToProps = (stavanger: LockerStavanger) => ({
    bioseries: stavanger.bioseries.selectors.getModel,
    flows: stavanger.bioseriesflows.selectors.getModel,
    ownProps: stavanger.bioseries.selectors.getProps
});

const mapStavangerToDispatch  = (stavanger: LockerStavanger) =>  ({
    initPage: (flowid,displayid) => stavanger.page.model.initPage.request({flow: flowid, display: displayid}),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioSeriesForBioImages);
