function setCookie(cname: any, cvalue: any, exdays: any) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname: any) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const socket = new WebSocket("ws://localhost:" + (getCookie("port") ? getCookie("port") : "1000"));
console.warn("Connected to API server at " + socket.url)

socket.onerror = () => {
    console.error("SOCKET ERROR")
    location.reload()
}

socket.onclose = () => {
    console.error("SERVER API CLOSED")
    location.reload()
}

let ev = (msg: any) => {}

socket.onmessage = (d: any) => {
    const msg = JSON.parse(d.data)
    ev(msg)
}

function onMsg(cb: (msg: any) => any) {
    ev = cb
}

function send(msg: any) {
    socket.send(JSON.stringify(msg))
}