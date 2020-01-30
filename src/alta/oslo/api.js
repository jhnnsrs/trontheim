//@flow
import {ajax} from "rxjs/ajax";
import {getRootUrl} from "../helpers";
import type {OsloHeader} from "./index";

export const getHeader = (state: any): OsloHeader => ({ 'Authorization': "Bearer "+ state.auth.token});


export type Header = {
    [string]: string
}

export const createOsloApi = (state:State , url: string , method: string,data: any, _header: Header) => {

    let rooturl = getRootUrl(state)
    let header = _header ? {...getHeader(state),..._header} : getHeader(state)
    console.log(header)
    return ajax({
        body: data,
        method: method,
        crossDomain: true,
        url: `${rooturl}/${url}`,
        headers: header,
        data: data});
}
