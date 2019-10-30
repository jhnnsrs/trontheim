import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Mold from "../../alta/react/FinalMold";
import type {ExperimentAdderStavanger} from "./index";
import {Field} from "react-final-form";
import {filters} from "./availableFilters";

class FilterOptions extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Mold mold={"settings"} enableRe={true}>
                    {props => <React.Fragment>
                        <div>
                            <label>Filter</label>
                            <Field name="filter" component="select" type="select">
                                {Object.keys(filters).map( (key, index) => {
                                    if ( index == 0) return <option value={key} key={index} selected="selected">{filters[key].name}</option>
                                    else return <option value={key} key={index}>{filters[key].name}</option>
                                })}
                            </Field>
                        </div>
                        <div>
                            <label>String</label>
                            <Field name="stringfield" component="input" type="text" />
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
});

const mapStavangerToDispatch  = (stavanger: ExperimentAdderStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(FilterOptions);