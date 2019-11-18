import React from "react"

type DictProps = {
    dict: [any],
    children: any,
}

class Dict extends React.Component<DictProps,any> {

    render() {
        const {dict} = this.props;
        if (dict) {
            return (
                <React.Fragment>
                    {Object.keys(dict).map((key, index) => this.props.children(dict[key], key))}
                </React.Fragment>
            );
        }
        else {
            return ""
        }
    }
}

export default Dict