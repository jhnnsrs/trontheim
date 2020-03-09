import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import {LARVIKDONE, LARVIKERROR, LAVRIKPROGRESS} from "../../constants/larvikstatus";
import type {BioImageStavanger, RepresentationStavanger} from "../stavanger";

class Analyzers extends Component {

    render() {
        const {metamorphers, metamorphings, representation, metamorphingsmeta} = this.props;
        if (metamorphers && representation) {
            return (
                <React.Fragment>
                {metamorphers.map(metamorpher =>
                        <Card className="mt-2" key={metamorpher.data.id}>
                            <CardBody>
                                <CardTitle>{metamorpher.data.name}</CardTitle>
                                <Button onClick={() => this.props.import({metamorpher: metamorpher, representation: representation})}>Metamorph {representation.name}  with {metamorpher.data.name}</Button>
                                {metamorphings.filter(item => item.data.analyzer == metamorpher.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.statuscode == LARVIKDONE) return <p>Done</p>
                                        if (item.data.statuscode == LAVRIKPROGRESS) return <p>{item.data.statusmessage} %</p>
                                        if (item.data.statuscode == LARVIKERROR) return <p>Error!! {item.data.statusmessage}</p>
                                        else return ""
                                    }
                                )}
                                { metamorphingsmeta.error && <div>{metamorphingsmeta.error}</div>}
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

const mapStavangerToProps = (stavanger: RepresentationStavanger) => ({
    representation: stavanger.representation.selectors.getData,
    metamorphers: stavanger.metamorphers.selectors.getList,
    metamorphings: stavanger.metamorphings.selectors.getList,
    metamorphingsmeta: stavanger.metamorphings.selectors.getMeta,
});

const mapStavangerToDispatch  = (stavanger: BioImageStavanger) =>  ({
    import: (item) => stavanger.page.model.dynamic("METAMORPH").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Analyzers);
