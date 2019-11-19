import {Button, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import type {RegExtractorStavanger} from "./index";
import List from "../../generics/List";
import SeperatingLine from "../../generics/SeperatingLine";

class LineRectComponent extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                {this.props.sample && <Container>Trying to Match {this.props.sample.name}</Container>}
                <SeperatingLine name={"Animals"}/>
                <List list={this.props.animals}>
                    {item => <Button key={item.data.id} onClick={() => this.props.selectAnimal(item)}>{item.data.name}</Button>}
                </List>
                <SeperatingLine name={"Experiments"}/>
                <List list={this.props.experiments}>
                    {item => <Button key={item.data.id} onClick={() => this.props.selectExperiment(item)}>{item.data.name}</Button>}
                </List>
                <SeperatingLine name={"Groups"}/>
                <List list={this.props.experimentalgroups}>
                    {item => <Button key={item.data.id} onClick={() => this.props.selectExperimentalGroup(item)}>{item.data.name}</Button>}
                </List>
             </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: RegExtractorStavanger) => ({
    sample: stavanger.sample.selectors.getData,
    animals: stavanger.animals.selectors.getModel,
    experiments: stavanger.experiments.selectors.getModel,
    experimentalgroups: stavanger.experimentalgroups.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: RegExtractorStavanger) =>  ({
    selectAnimal: (item) => stavanger.animals.model.selectItem.request(item),
    selectExperiment: (item) => stavanger.experiments.model.selectItem.request(item),
    selectExperimentalGroup: (item) => stavanger.experimentalgroups.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);