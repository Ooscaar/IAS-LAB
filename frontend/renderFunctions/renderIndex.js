import { Api } from "../api.js";
import { dateAndOwnerInfo } from "../utils/dateAndOwnerInfo.js";
import { updateUserState } from "../utils/updateUserState.js";

export async function renderIndex() {
    let page = document.getElementById('/');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    // First delete all the posts
    Array.from(document.getElementsByClassName("board-post")).forEach(post => {
        post.remove();
    })

    let posts = await Api.getPagePosts(1);
    posts.forEach(post => {
        let postHTML = document.createElement("div");
        postHTML.classList.add("board-post");

        let postTitleHTML = document.createElement("h1");
        if (post.isPrivate) {
            let postTitleLockHTML = document.createElement("img");
            postTitleLockHTML.setAttribute("src", "/icons/lock.svg");
            postTitleLockHTML.setAttribute("alt", "Private");
            postTitleHTML.appendChild(postTitleLockHTML);
        }
        postTitleHTML.innerHTML += post.title;

        let postInfoHTML = document.createElement("p");
        let date = new Date(post.lastModificationDate);
        postInfoHTML.innerHTML = dateAndOwnerInfo(date, post.owner);

        postHTML.appendChild(postTitleHTML);
        postHTML.appendChild(postInfoHTML);

        postHTML.setAttribute("onclick", `updatePath('/posts/${post.id}')`);

        document.getElementById('board').appendChild(postHTML);
    })

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}