import {Button, ButtonGroup, Card, InputGroup, InputGroupAddon} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import {Field} from "react-final-form";
import Form from "../../alta/react/FinalForm";
import type {NodeBuilderStavanger} from "../stavanger";
import * as _ from "lodash"

class EntityForm extends Component<any,any> {


    render() {
            return (
                <Card inverse className="mt-2 bg-dark" key={_.uniqueId()}>
                    <Form formHorten={"nodeform"} enableRe={true}>
                        {({ handleSubmit, pristine, reset, submitting, values }) =>
                            <React.Fragment>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
                                    <Field
                                        name="name"
                                        component="input"
                                        type="text"
                                        placeholder="Name"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon
                                    addonType = "prepend" > Path </InputGroupAddon>
                                    <Field
                                        name="path"
                                        component="input"
                                        type="text"
                                        placeholder="Path"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Channel</InputGroupAddon>
                                    <Field
                                        name="channel"
                                        component="input"
                                        type="text"
                                        placeholder="Channel"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType = "prepend" > Input </InputGroupAddon>
                                    <Field
                                        name="inputmodel"
                                        component="input"
                                        type="text"
                                        placeholder="Input"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Output</InputGroupAddon>
                                    <Field
                                        name="outputmodel"
                                        component="input"
                                        type="text"
                                        placeholder="Output"
                                    />
                                </InputGroup>


                                {this.props.entity.data && Object.keys(this.props.entity.data.defaultsettings).map(item =>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">{item}</InputGroupAddon>
                                            <Field
                                                name={"defaultsettings." + item}
                                                component="input"
                                                type="text"
                                                placeholder="Output"
                                            />
                                        </InputGroup>
                                    )
                                }
                                <ButtonGroup>
                                    <Button type="submit" outline size={"sm"} className={"mx-auto"}>Save</Button>
                                </ButtonGroup>
                            </React.Fragment>
                        }
                    </Form>
                </Card>);
        }

}

const mapStavangerToProps = (stavanger: NodeBuilderStavanger) => ({
    entity: stavanger.selectedEntity.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.entities.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(EntityForm);
