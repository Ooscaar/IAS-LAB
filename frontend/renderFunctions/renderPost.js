import { Api } from "../api.js";
import { dateAndOwnerInfo } from "../utils/dateAndOwnerInfo.js";
import { updateUserState } from "../utils/updateUserState.js";

export async function renderPost() {
    let page = document.getElementById('/posts');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    let postId = window.location.pathname.split('/')[2];
    let post = await Api.getPost(postId);
    let messages = await Api.getPostMessages(postId);

    let postContainer = document.getElementById('post-container');
    // Remove all data
    postContainer.innerHTML = ""

    let interfaceTitle = document.createElement('h1');
    interfaceTitle.innerHTML = post.title;
    postContainer.appendChild(interfaceTitle);

    Array.from(messages).forEach(message => {
        let interfaceMessage = document.createElement("div");
        interfaceMessage.classList.add("post-message");

        let interfaceMessageInfo = document.createElement("p");
        let date = new Date(message.lastModificationDate);
        interfaceMessageInfo.innerHTML = dateAndOwnerInfo(date, message.owner);

        let interfaceMessageText = document.createElement("p");
        interfaceMessageText.innerHTML = message.content;

        interfaceMessage.appendChild(interfaceMessageInfo);
        interfaceMessage.appendChild(interfaceMessageText);

        postContainer.appendChild(interfaceMessage);
    })

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}