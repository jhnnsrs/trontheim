
// Helps Make the Requested Room Readable by OSLO BACKEND
export function objToString (obj) {
    let str = '';
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        str += key.toString() + '_' + value + "_";
    }
    return str.slice(0, -1);
}