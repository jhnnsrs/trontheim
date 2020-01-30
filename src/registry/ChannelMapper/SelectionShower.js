import React from "react";
import {Button, ButtonGroup, Card, Container} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import type {ChannelMapper} from "./index";
import {Field} from "react-final-form";
import Form from "../../alta/react/FinalMold";
import {renderMultiSelect} from "../../generics/Fields";

const SelectionShower = (props) => <Container>
    Filtered By
    {props.representation && <Card>{props.representation.name}</Card>}
    <Form mold={"settings"} enableRe={true}>
        {props => <React.Fragment>
            <div>
                <label>Overwrite</label>
                <Field name="overwrite" component="input" type="checkbox" />
            </div>
            {this.props.channels &&
                <React.Fragment>
                    <Field
                        name="red"
                        component={renderMultiSelect(this.props.channels.map( channel => ({label: channel["Name"], value: channel["Index"]})))}
                        label={"Selected Red Channel"}
                        description={"Selected Red Channel"}
                        type="text"
                        placeholder="The Red Channels"
                    />
                    <Field
                        name="green"
                        component={renderMultiSelect(this.props.channels.map( channel => ({label: channel["Name"], value: channel["Index"]})))}
                        label={"Selected Green Channel"}
                        description={"Selected Green Channel"}
                        type="text"
                        placeholder="The Green Channels"
                    />
                    <Field
                        name="blue"
                        component={renderMultiSelect(this.props.channels.map( channel => ({label: channel["Name"], value: channel["Index"]})))}
                        label={"Selected Blue Channel"}
                        description={"Selected Blue Channel"}
                        type="text"
                        placeholder="The Blue Channels"
                    />
                </React.Fragment>
            }
            <ButtonGroup>
                <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
            </ButtonGroup>
        </React.Fragment>}
    </Form>

</Container>


const mapStavangerToProps = (stavanger: ChannelMapper) => ({
    representation: stavanger.representation.selectors.getData,
    channels: stavanger.channels.selectors.getData,
});


const mapStavangerToDispatch  = (stavanger: ChannelMapper) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(SelectionShower);
