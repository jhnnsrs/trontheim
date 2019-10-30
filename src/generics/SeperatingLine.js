import React from "react"

export type LineProps = {
    name: string
}


const SeperatingLine = (props: LineProps) => (
    <div className="hr-sect">{props.name}</div>
);


export default SeperatingLine