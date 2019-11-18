import React, {Component} from "react";
import type {AnswerStavanger} from "../stavanger";
import {Card, CardBody, CardSubtitle, CardTitle} from "reactstrap";
import {connectInstrument} from "../../alta/react";
import OsloLink from "../../generics/OsloLink";

class ProfilesList extends Component {

    render() {
        const {excelexports} = this.props;
        if (excelexports) {
            return (
                <React.Fragment>
                {excelexports.map((excelexport, index) =>
                        <Card className="mt-2 overflow-auto" key={excelexport.data.id}>
                            <CardBody>
                                <CardTitle>{excelexport.data.name}</CardTitle>
                                <CardSubtitle>ExcelExport {excelexport.data.id}</CardSubtitle>
                                <OsloLink size="sm" to={"/excelexports/" + excelexport.data.id + "/excel"}>Open</OsloLink>
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

const mapStavangerToProps = (stavanger: AnswerStavanger) => ({
    excelexports: stavanger.excelexports.selectors.getList,
});

const mapStavangerToDispatch  = (stavanger: AnswerStavanger) =>  ({
    visualize: (item) => stavanger.page.model.dynamic("VISUALIZE").request(item),
});


export default connectInstrument(mapStavangerToProps, mapStavangerToDispatch)(ProfilesList);
