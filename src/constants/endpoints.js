


export const THIS_ROOT_URL = window.location.hostname === 'localhost' ? "http://localhost:" + window.location.port : "http://" + window.location.hostname + ":" + window.location.port
export const redirectui =  window.location.hostname === 'localhost' ? "http://localhost:" + window.location.port +"/callback" : "http://" + window.location.hostname + ":" + window.location.port + "/callback";


export const osloEndpoints = [
    {
        name: "Localhost",
        image: "/images/oslologo.png",
        rooturl: 'http://localhost:80/api',
        url: "http://localhost:80/o/authorize",
        websocket: "ws://localhost:80/oslo?token=",
        client: "xMOFVsejWOSccNg7xYMJfOMXC78GRejjbQiQG8xl",
        secret: "gUfYlWp8gUDgY0P8OCB60H4AfwHvDr53yjFIrzIw04GohW5lYOUbq5JOZrf4Glwus0YWEwCrgEDXQvj1bVYjBW3UOFvfsGqDG8ia0wAE6Nls4I2iz4cIbtOn0fNhFcPr",
        redirect: redirectui,
        scope: "write read read_starred profile",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "Localhost Johannes",
        image: "/images/oslologo.png",
        rooturl: 'http://localhost:80/api',
        url: "http://localhost:80/o/authorize",
        websocket: "ws://localhost:80/oslo?token=",
        client: "QWDRidApthbv0T3fP8pi2k6ePBGxw0L3SwpuA3cQ",
        secret: "1ZLMiMjAF7mfa7xcWGcSmIX4QATyInqfXkl2ekCyN3CPAidM9qkWpnSmfIQ7iampgz40euvqlTgMXjiFogrkfl9gIhudzwCw7DssEJmnImxZOlCvrx89jiPViGdG3okO",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "Network",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'http://129.206.173.171:80/api',
        url: "http://129.206.173.171:80/o/authorize",
        websocket: "ws://129.206.173.171:80/oslo?token=",
        client: "8bwFvpziMTeKrnznoBnbwl0gHTIzKoRiY79bterv",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "Network Johannes",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'http://192.168.0.116:80/api',
        url: "http://192.168.0.116:80/o/authorize",
        websocket: "ws://192.168.0.116.171:80/oslo?token=",
        client: "xMOFVsejWOSccNg7xYMJfOMXC78GRejjbQiQG8xl",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "Uni Heidelberg",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'http://192.168.0.38:80/api',
        url: "http://192.168.0.38:80/o/authorize",
        websocket: "ws://192.168.0.38:80/oslo?token=",
        client: "CFMouZimB500wLY0XHywlRXGR4tjJFwEkOu8UNt8",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "SFN Ipad",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'http://192.168.137.1:80/api',
        url: "http://192.168.137.1:80/o/authorize",
        websocket: "ws://192.168.137.1:80/oslo?token=",
        client: "QWDRidApthbv0T3fP8pi2k6ePBGxw0L3SwpuA3cQ",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
    {
        name: "HeiCloud",
        image: "/images/jhnnsrslogo.png",
        rooturl: 'https://johannesroos.de/api',
        url: "http://johannesroos.de/o/authorize",
        websocket: "wss://johannesroos.de/oslo?token=",
        client: "aPopyevoYspf98H2v3jaVETdtMOYPWsVIyhg7uAa",
        redirect: redirectui,
        scope: "write",
        width: 400, // Width (in pixels) of login popup window. Optional, default: 400
        height: 400 // Height (in pixels) of login popup window. Optional, default: 400
    },
]