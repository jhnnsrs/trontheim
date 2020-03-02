import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import {LARVIKDONE, LARVIKERROR, LAVRIKPROGRESS} from "../../constants/larvikstatus";
import type {BioImageStavanger, BioSeriesStavanger} from "../stavanger";

class Converters extends Component {

    render() {
        const {converters, conversings, bioseries,  conversingmeta} = this.props;
        if (converters && bioseries) {
            return (
                <React.Fragment>
                {converters.map(converter =>
                        <Card className="mt-2" key={converter.data.id}>
                            <CardBody>
                                <CardTitle>{converter.data.name}</CardTitle>
                                <Button onClick={() => this.props.import({converter: converter, bioseries: bioseries})}>Convert {bioseries.name}  with {converter.data.name}</Button>
                                {conversings.filter(item => item.data.converter == converter.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.statuscode == LARVIKDONE) return <p>Done</p>
                                        if (item.data.statuscode == LAVRIKPROGRESS) return <p>{item.data.statusmessage} %</p>
                                        if (item.data.statuscode == LARVIKERROR) return <p>Error!! {item.data.statusmessage}</p>
                                        else return ""
                                    }
                                )}
                                { conversingmeta.error && <div>{conversingmeta.error}</div>}
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

const mapStavangerToProps = (stavanger: BioSeriesStavanger) => ({
    bioseries: stavanger.bioseries.selectors.getData,
    converters: stavanger.converters.selectors.getList,
    conversings: stavanger.conversings.selectors.getList,
    conversingmeta: stavanger.conversings.selectors.getMeta,
});

const mapStavangerToDispatch  = (stavanger: BioSeriesStavanger) =>  ({
    import: (item) => stavanger.page.model.dynamic("CONVERT").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Converters);
