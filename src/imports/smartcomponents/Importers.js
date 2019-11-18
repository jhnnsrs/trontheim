import React, {Component} from "react";
import {Button, Card, CardBody, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";

class Flows extends Component {

    render() {
        const {importers, importings, locker} = this.props;
        if (importers && locker) {
            return (
                <React.Fragment>
                {importers.map(importer =>
                        <Card className="mt-2" key={importer.data.id}>
                            <CardBody>
                                <CardTitle>{importer.data.name}</CardTitle>
                                <Button onClick={() => this.props.import({importer: importer, locker: locker})}>Import into {locker.name}  with {importer.data.name}</Button>
                                {importings.filter(item => item.data.visualizer == importer.data.id && item.data.status != "DONE").map(
                                    item => {
                                        if (item.data.status == "DONE") return <p>Done</p>
                                        if (item.data.status == "WORKING") return <p>Working</p>
                                        if (item.data.status == "ERROR") return <p>Error!!</p>
                                        else return  <p color="danger">Error: {item.data.status}</p>
                                    }
                                )}
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
});

const mapStavangerToDispatch  = (stavanger: ImportsStavanger) =>  ({
    import: (item) => stavanger.page.model.dynamic("IMPORT").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(Flows);
