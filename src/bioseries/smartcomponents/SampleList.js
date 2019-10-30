import React, {Component} from "react";
import type {BioSeriesStavanger} from "../stavanger";
import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import RepresentationsForSample from "./RepresentationsForSample";
import ButtonToNavigate from "../../generics/ButtonToNavigate";
import List from "../../generics/List";

class SampleList extends Component {

    render() {
        return(
            <List list={this.props.samples}>
            { (sample) =>
                        <Card className="mt-2 overflow-auto" key={sample.data.id} onClick={() => this.props.selectItem(sample)}>
                            <CardBody>
                                <CardTitle>{sample.data.name}</CardTitle>
                                <CardSubtitle>Sample {sample.data.id}</CardSubtitle>
                                <Container>
                                    <ButtonGroup>
                                        <ButtonToNavigate className="mt-2" outline to={"/sample/"+sample.data.id}>Open</ButtonToNavigate>
                                        <Button className="mt-2" outline color="danger" onClick={() => this.props.deleteItem(sample)}>Delete</Button>
                                    </ButtonGroup>
                                    <RepresentationsForSample sample={sample}/>
                                </Container>
                            </CardBody>
                        </Card>}
                </List>
            );
    }
}

const mapStavangerToProps = (stavanger: BioSeriesStavanger) => ({
    samples: stavanger.samples.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: BioSeriesStavanger) =>  ({
    selectItem: (item) => stavanger.samples.model.selectItem.request(item),
    deleteItem: (item) => stavanger.samples.model.deleteItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SampleList);
