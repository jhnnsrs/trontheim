

export const isHashRouter = false
export const THIS_ROOT_URL = window.location.hostname === 'localhost' ? "http://localhost:" + window.location.port : "http://" + window.location.hostname + ":" + window.location.port
export const redirectui =  THIS_ROOT_URL
export const THIS_BASE_URL = isHashRouter ? THIS_ROOT_URL + "/#/": THIS_ROOT_URL +  "/"

console.log("The redirectui is " + redirectui)

export const osloEndpoints = [
    {
        name: "Localhost",
        image: "/images/oslologo.png",
        rooturl: 'http://localhost:80/api',
        url: "http://localhost:80/o/authorize",
        websocket: "ws://localhost:80/oslo?token=",
        client: "6fjbBosPdI7q9pDLcAFPhYdhmGWtukEEiALQbY3i",
        secret: "Hesgcg9BXHOv3iphEh9CtPKCdcpWIX2SFb2TzjcdzhXkiM5Pb5htBBp5QcQMJ1aEelVfa13CVBlpdH6wlfhedW4YbdB01U7eyPmDIuprN3sT0fV1KJ5TeWvnwPbcXG45",
        redirect: redirectui,
        scope: "write read read_starred profile",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "Arnheim Online",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'https://arnheim.online/api',
        url: "https://arnheim.online/o/authorize",
        websocket: "wss://arnheim.online/oslo?token=",
        client: "MhKo3IPJrY7XAWRCdv6FJKrYih9g28XAA8h6kGA9",
        redirect: redirectui,
        scope: "write read read_starred profile",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
]


export const OsloString = "noingfvoinüsubnrgpugisnpinipnp"