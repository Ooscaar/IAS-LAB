import { Api } from "../api.js";

export async function renderPost() {
    let page = document.getElementById('/posts');
    page.style.display = 'block';

    let postId = window.location.pathname.split('/')[2];
    let post = await Api.getPost(postId);
    let messages = await Api.getPostMessages(postId);

    let postContainer = document.getElementById('post-container');

    let interfaceTitle = document.createElement('p');
    interfaceTitle.innerHTML = post.title;
    postContainer.appendChild(interfaceTitle);

    for (let i = 0; i < messages.length; i++) {
        let interfaceMessage = document.createElement("div");
        interfaceMessage.classList.add("post-message");

        let interfaceMessageOwner = document.createElement("div");
        interfaceMessageOwner.classList.add("post-message-owner");
        interfaceMessageOwner.innerHTML = messages[i].owner;
        let interfaceMessageText = document.createElement("div");
        interfaceMessageText.classList.add("post-message-text");
        interfaceMessageText.innerHTML = messages[i].content;

        interfaceMessage.appendChild(interfaceMessageOwner);
        interfaceMessage.appendChild(interfaceMessageText);

        postContainer.appendChild(interfaceMessage);
    }

}