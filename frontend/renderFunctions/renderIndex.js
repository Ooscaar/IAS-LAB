import { Api } from "../api.js";

export async function renderIndex() {

    let page = document.getElementById('/');
    page.style.display = 'block';

    // If the user is not logged in go to /login
    //let userInfo = await Api.logged();
    //if (userInfo === false) return window.updatePath('/login');

    let interfaceUsernames = document.getElementsByClassName('username');
    for (let i = 0; i < interfaceUsernames.length; i++) {
        interfaceUsernames[i].innerHTML = userInfo.username;
    }

    let posts = Api.getPagePosts(1);
}