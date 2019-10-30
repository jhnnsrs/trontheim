import React, {Component} from "react";
import type {LockerStavanger, SampleStavanger} from "../stavanger";
import {
    Button, ButtonGroup,
    Card,
    CardBody,
    CardImg,
    CardImgOverlay,
    CardSubtitle,
    CardText,
    CardTitle,
    Container
} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import Octicon, {Plus} from "@githubprimer/octicons-react";
import * as _ from "lodash"
import BioSeriesForBioImages from "./BioSeriesForBioImages";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Bioimages extends Component {

    render() {
        const {bioimages, flows} = this.props;
        if (bioimages.data) {
            return (
                <React.Fragment>
                {bioimages.data.map((bioimage, index) =>
                        <Card className="mt-2 overflow-auto" key={bioimage.data.id} onClick={() => this.props.selectRepresentation(bioimage)}>
                            <CardBody>
                                <CardTitle>{bioimage.data.name}</CardTitle>
                                <CardSubtitle>Bioimage {bioimage.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <ButtonToNavigate size="sm" to={"/bioimage/" + bioimage.data.id}>Open</ButtonToNavigate>
                                    { flows.data.map( (flow,key) =>
                                        <ButtonToNavigate key={_.uniqueId()} size="sm" outline  to={"/bioimageflow/"+flow.data.id+ "/bioimage/" + bioimage.data.id}>
                                            {flow.data.name}
                                        </ButtonToNavigate>
                                    )}
                                    <Button size="sm" outline color="danger" onClick={() => this.props.deleteBioimage(bioimage)}>Delete</Button>

                                </ButtonGroup>
                                <p>BioSeries</p>
                                <Container>
                                    <BioSeriesForBioImages bioimage={bioimage}/>
                                </Container>
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

const mapStavangerToProps = (stavanger: LockerStavanger) => ({
    bioimages: stavanger.bioimages.selectors.getModel,
    flows: stavanger.bioimageflows.selectors.getModel
});

const mapStavangerToDispatch  = (stavanger: LockerStavanger) =>  ({
    selectRepresentation: (sample) => stavanger.bioimages.model.selectItem.request(sample),
    selectRoi: (roi) => stavanger.rois.model.selectItem.request(roi),
    deleteBioimage: (bioimage) => stavanger.bioimages.model.deleteItem.request(bioimage),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Bioimages);
