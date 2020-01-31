

export const isHashRouter = false
export const THIS_ROOT_URL = window.location.hostname === 'localhost' ? "http://localhost:" + window.location.port : "http://" + window.location.hostname
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
        client: "NYGOhGOeIZLNd2zl8PK99voteHz7hI6ciuQSwOf3",
        secret: "heiQet4AcwCLZdwD0HUVDokSQiO9yroYeytnZ4OPwGpSk83V9DcZ6RfImfFKFiBuk182l4uunypI3RBZk7PRpGN9kT6TkYBRdaq3ydHqNcfutwhg3XHkPrA5jlRueq1X",
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
        client: "HW16mAzhx3xJNZvb8qnuCOVh4KcqOPADpkSvIuqq",
        redirect: redirectui,
        scope: "write read read_starred profile",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
]


export const OsloString = "noingfvoinüsubnrgpugisnpinipnp"