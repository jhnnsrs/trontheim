import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import {LARVIKDONE, LARVIKERROR, LAVRIKPROGRESS} from "../../constants/larvikstatus";
import type {BioImageStavanger} from "../stavanger";

class Analyzers extends Component {

    render() {
        const {analyzers, analyzings, bioimage, analyzingsmeta} = this.props;
        if (analyzers && bioimage) {
            return (
                <React.Fragment>
                {analyzers.map(analyzer =>
                        <Card className="mt-2" key={analyzer.data.id}>
                            <CardBody>
                                <CardTitle>{analyzer.data.name}</CardTitle>
                                <Button onClick={() => this.props.import({analyzer: analyzer, bioimage: bioimage})}>Analyze {bioimage.name}  with {analyzer.data.name}</Button>
                                {analyzings.filter(item => item.data.analyzer == analyzer.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.statuscode == LARVIKDONE) return <p>Done</p>
                                        if (item.data.statuscode == LAVRIKPROGRESS) return <p>{item.data.statusmessage} %</p>
                                        if (item.data.statuscode == LARVIKERROR) return <p>Error!! {item.data.statusmessage}</p>
                                        else return ""
                                    }
                                )}
                                { analyzingsmeta.error && <div>{analyzingsmeta.error}</div>}
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

const mapStavangerToProps = (stavanger: BioImageStavanger) => ({
    bioimage: stavanger.bioimage.selectors.getData,
    analyzers: stavanger.analyzers.selectors.getList,
    analyzings: stavanger.analyzings.selectors.getList,
    analyzingsmeta: stavanger.analyzings.selectors.getMeta,
});

const mapStavangerToDispatch  = (stavanger: BioImageStavanger) =>  ({
    import: (item) => stavanger.page.model.dynamic("ANALYZE").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Analyzers);
