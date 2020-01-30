import React, {Component} from "react";
import type {ImportsStavanger} from "../stavanger";
import {ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class Bioimages extends Component {

    render() {
        const {bioimages} = this.props;
        if (bioimages.data) {
            return (
                <React.Fragment>
                {bioimages.data.map((bioimage, index) =>
                        <Card className="mt-2 overflow-auto" key={bioimage.data.id} onClick={() => this.props.selectBioimage(bioimage)}>
                            <CardBody>
                                <CardTitle>{bioimage.data.name}</CardTitle>
                                <CardSubtitle>Bioimage {bioimage.data.id}</CardSubtitle>
                                <ButtonGroup>
                                    <ButtonToNavigate size="sm" to={"/bioimage/" + bioimage.data.id}>Open</ButtonToNavigate>
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

const mapStavangerToProps = (stavanger: ImportsStavanger) => ({
    bioimages: stavanger.bioimages.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    selectBioimage: (sample) => stavanger.bioimages.model.selectItem.request(sample),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Bioimages);
