import {Button, ButtonGroup, Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import type {NodeBuilderStavanger} from "../stavanger";
import {connectInstrument} from "../../alta/react";
import React from "react";
import * as _ from "lodash";

class ArnHeimHostSelector extends React.Component {

    render() {
        const {arnheims} = this.props;
        if (arnheims.data[0]) {
            return (
                <React.Fragment>
                    {arnheims.data.map((arnheim, index) =>
                        <Card inverse className="mt-2 bg-dark" key={_.uniqueId()}>
                            <CardBody>
                                <CardTitle>{arnheim.data.name}</CardTitle>
                                <CardSubtitle>URI {arnheim.data.rooturl}</CardSubtitle>
                                <ButtonGroup>
                                    <Button className="mt-2" outline
                                            onClick={() => {this.props.selectItem(arnheim);this.props.toggle('2')}}>Select</Button>
                                </ButtonGroup>
                            </CardBody>

                        </Card>)}
                </React.Fragment>
            );
        } else {
            return (<Card className="mt-2 bg-dark" key={_.uniqueId()}>
                <CardBody>
                    <CardTitle>No Sample</CardTitle>
                    <CardSubtitle>There is No Arnheim Hosts Ailable for this</CardSubtitle>
                </CardBody>

            </Card>)

        }
    }
}

const mapStavangerToProps = (stavanger: NodeBuilderStavanger) => ({
    arnheims: stavanger.arnheimhosts.selectors.getModel,
});

const mapStavangerToDispatch  = (stavanger: NodeBuilderStavanger) =>  ({
    selectItem: (item) => stavanger.arnheimhosts.model.selectItem.request(item)
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ArnHeimHostSelector);