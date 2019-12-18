import * as _ from "lodash";
import React from "react"

type ListProps = {
    list: [any],
    children: any,
}

class List extends React.Component<ListProps,any> {

    render() {
        const {list} = this.props;
        if (list.data) {
            return (
                <React.Fragment>
                    {list.data.map((item, index) => this.props.children(item, _.uniqueId()))}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

export default List