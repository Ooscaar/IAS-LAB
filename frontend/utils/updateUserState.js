import { Api } from "../api.js";

export async function updateUserState() {
    let userInfo = await Api.logged();

    if (userInfo) {
        Array.from(document.getElementsByClassName('logged')).forEach(element => {
            element.style.display = "block";
        })
        Array.from(document.getElementsByClassName('not-logged')).forEach(element => {
            element.style.display = "none";
        })
        // Update the username in the interface
        let interfaceUsernames = document.getElementsByClassName('username');
        for (let i = 0; i < interfaceUsernames.length; i++) {
            interfaceUsernames[i].innerHTML = userInfo.username;
        }
        window.userInfo = userInfo;
        return true;
    } else {
        Array.from(document.getElementsByClassName('logged')).forEach(element => {
            element.style.display = "none";
        })
        Array.from(document.getElementsByClassName('not-logged')).forEach(element => {
            element.style.display = "block";
        })
        window.userInfo = null;
        return false;
    }
}