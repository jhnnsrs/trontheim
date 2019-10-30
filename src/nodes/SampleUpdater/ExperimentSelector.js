import {Button, ButtonGroup, CardBody, CardText} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Mold from "../../alta/react/FinalMold";
import type {SampleUpdaterStavanger} from "./index";
import {Field} from "react-final-form";
import {renderMultiSelectBuilder} from "../../generics/Fields";

class ExperimentSelector extends Component<any,any> {
    render() {
        return (
            <React.Fragment>
                <Mold mold={"settings"} enableRe={false}>
                    {props => <React.Fragment>
                        <div>
                            {this.props.links &&
                            <Field
                                name="locked"
                                component={renderMultiSelectBuilder(this.props.links)}
                                label={"Lock"}
                                description={"These items will not be reset after an Update"}
                                type="text"
                                placeholder="Scale in Pixels"
                            />
                            }
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

const mapStavangerToProps = (stavanger: SampleUpdaterStavanger) => ({
    links: stavanger.page.selectors.getProp(state => state.links)
});

const mapStavangerToDispatch  = (stavanger: SampleUpdaterStavanger) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ExperimentSelector);