import {Button, ButtonGroup, Container} from "reactstrap"
import {connectInstrument} from "../../alta/react";
import React, {Component} from "react";
import Form from "../../alta/react/FinalMold";
import type {IntensityProfiler} from "./index";
import {Field} from "react-final-form";
import {renderMultiSelect} from "../../generics/Fields";

class LineRectComponent extends Component<any,any> {
    render() {

        const channels = this.props.channels

        return (
            <React.Fragment>
                {this.props.transformation && <Container>{this.props.transformation.name}</Container>}
                <Form mold={"settings"} enableRe={true}>
                    {props => <React.Fragment>
                    {this.props.channels &&
                        <Field
                            name="channels"
                            component={renderMultiSelect(this.props.channels.map)}
                            label={"Selected Channel"}
                            description={this.props.channels.info}
                            type="text"
                            placeholder="Scale in Pixels"
                        />
                    }
                    <ButtonGroup>
                        <Button type="submit" outline  size={"sm"}  className={"mx-auto"}>Save</Button>
                    </ButtonGroup>
                        </React.Fragment>}
                </Form>
            </React.Fragment>
        );
    }
}

const mapStavangerToProps = (stavanger: IntensityProfiler) => ({
    transformation: stavanger.transformation.selectors.getData,
    channels: stavanger.page.selectors.getProp(state => state.channels)
});

const mapStavangerToDispatch  = (stavanger: IntensityProfiler) =>  ({
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(LineRectComponent);