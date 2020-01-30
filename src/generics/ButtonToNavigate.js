import {withRouter} from 'react-router-dom'
import {Button} from "reactstrap";
import React from "react"

const ButtonToNavigate = (props) => {

    if (props.outside) return <Button outline={props.outline} className={props.className} size={props.size}
                                      color={props.color}
                                      onClick={() => {
                                          window.open(props.to, "_blank", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=700")
                                          return false
                                      }}>
        {props.children}
    </Button>

    else return <Button outline={props.outline} className={props.className} size={props.size} color={props.color}
                        onClick={() => {
                            props.history.push(props.to)
                        }}
    >
        {props.children}
    </Button>
};



export default withRouter(ButtonToNavigate);