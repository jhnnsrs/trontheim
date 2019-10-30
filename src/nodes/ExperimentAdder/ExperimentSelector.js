import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Mold from "../../alta/react/FinalMold";
import type {ExperimentAdderStavanger} from "./index";
import {Field} from "react-final-form";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Mold mold={"settings"} enableRe={false}>
                    {props => <React.Fragment>
                        <div>
                            <label>Toppings</label>
                            <Field name="experiment" component="select" type="select">
                                <option value={0} key={0}>None</option>
                                {this.props.experiments.map( experiment => <option value={experiment.data.id} key={experiment.data.id}>{experiment.data.name}</option>)}
                            </Field>
                        </div>
                        <ButtonGroup>
                            <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                        </ButtonGroup>
                    </React.Fragment>
                    }
                </Mold>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: ExperimentAdderStavanger) => ({
    experiments: stavanger.experiments.selectors.getList
});

const mapStavangerToDispatch  = (stavanger: ExperimentAdderStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);