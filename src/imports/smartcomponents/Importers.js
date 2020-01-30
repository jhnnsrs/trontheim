import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import {LARVIKDONE, LARVIKERROR, LAVRIKPROGRESS} from "../../constants/larvikstatus";

class Flows extends Component {

    render() {
        const {importers, importings, locker, importingmeta} = this.props;
        if (importers && locker) {
            return (
                <React.Fragment>
                {importers.map(importer =>
                        <Card className="mt-2" key={importer.data.id}>
                            <CardBody>
                                <CardTitle>{importer.data.name}</CardTitle>
                                <Button onClick={() => this.props.import({importer: importer, locker: locker})}>Import into {locker.name}  with {importer.data.name}</Button>
                                {importings.filter(item => item.data.importer == importer.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.statuscode == LARVIKDONE) return <p>Done</p>
                                        if (item.data.statuscode == LAVRIKPROGRESS) return <p>{item.data.statusmessage} %</p>
                                        if (item.data.statuscode == LARVIKERROR) return <p>Error!! {item.data.statusmessage}</p>
                                        else return ""
                                    }
                                )}
                                { importingmeta.error && <div>{importingmeta.error}</div>}
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

const mapStavangerToProps = (stavanger: ImportsStavanger) => ({
    importers: stavanger.importers.selectors.getList,
    locker: stavanger.selectedLocker.selectors.getData,
    importings: stavanger.importings.selectors.getList,
    importingmeta: stavanger.importings.selectors.getMeta,
});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    import: (item) => stavanger.page.model.dynamic("IMPORT").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Flows);
