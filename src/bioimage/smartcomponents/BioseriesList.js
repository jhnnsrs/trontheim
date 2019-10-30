import React, {Component} from "react";
import type {BioImageStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import SamplesForBioSeries from "./SamplesForBioSeries";
import ButtonToNavigate from "../../generics/ButtonToNavigate";

class BioseriesList extends Component {

    render() {
        const {bioseries} = this.props;
        if (bioseries.data) {
            return (
                <React.Fragment>
                {bioseries.data.map((bioseries, index) =>
                        <Card className="mt-2 overflow-auto" key={bioseries.data.id} onClick={() => this.props.selectItem(bioseries)}>
                            <CardBody>
                                <CardTitle>{bioseries.data.name}</CardTitle>
                                <CardSubtitle>BioSeriffes {bioseries.data.id}</CardSubtitle>
                                <Container>
                                    <ButtonGroup>
                                        <ButtonToNavigate className="mt-2" outline to={"/bioseries/"+bioseries.data.id}>Open</ButtonToNavigate>
                                        <Button className="mt-2" outline color="danger" onClick={() => this.props.deleteItem(bioseries)}>Delete</Button>
                                    </ButtonGroup>
                                    <SamplesForBioSeries bioseries={bioseries}/>
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

const mapStavangerToProps = (stavanger: BioImageStavanger) => ({
    bioseries: stavanger.bioseries.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: BioImageStavanger) =>  ({
    selectItem: (item) => stavanger.bioseries.model.selectItem.request(item),
    deleteItem: (item) => stavanger.bioseries.model.deleteItem.request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(BioseriesList);
