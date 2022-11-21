import { Api } from "../api.js";
import { dateAndOwnerInfo } from "../utils/dateAndOwnerInfo.js";
import { updateUserState } from "../utils/updateUserState.js";

export async function renderPost() {
    let page = document.getElementById('/posts');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    let postContainer = document.getElementById('post-container');
    // Remove all data
    postContainer.innerHTML = ""

    let postId = window.location.pathname.split('/')[2];
    let post = await Api.getPost(postId);
    let messages = await Api.getPostMessages(postId);

    let interfaceTitle = document.createElement('h1');
    interfaceTitle.innerHTML = post.title;
    postContainer.appendChild(interfaceTitle);

    if (!messages) {
        let errorHTML = document.createElement('p');
        errorHTML.innerHTML = "You do not have access to this post."
        postContainer.appendChild(errorHTML);
    } else {
        console.log(messages)
        Array.from(messages).forEach(message => {
            let interfaceMessage = document.createElement("div");
            interfaceMessage.classList.add("post-message");

            let interfaceMessageInfo = document.createElement("p");
            let date = new Date(message.lastModificationDate);
            interfaceMessageInfo.innerHTML = dateAndOwnerInfo(date, message.owner);

            let interfaceMessageText = document.createElement("p");
            if (message.isDeleted) {
                interfaceMessageText.innerHTML = "Deleted message";
                interfaceMessageText.style.color = "red";
            }
            else interfaceMessageText.innerHTML = message.content;

            interfaceMessage.appendChild(interfaceMessageInfo);
            interfaceMessage.appendChild(interfaceMessageText);
            // Only the message owner or and admin can delete the message
            if (window.userInfo && ((!message.isDeleted && message.owner === window.userInfo.username) || window.userInfo.isAdmin)) {
                let deleteButton = document.createElement("button");
                deleteButton.innerHTML = 'Delete';
                deleteButton.classList.add('delete-message');
                deleteButton.onclick = () => Actions.deleteMessage(message.id);

                interfaceMessage.appendChild(deleteButton);
            }

            // Only the message owner can edit the message
            if (window.userInfo && !message.isDeleted && message.owner === window.userInfo.username) {

                let editForm = document.createElement("form");
                editForm.classList.add('edit-form');
                editForm.onsubmit = (event) => Actions.editMessage(event, message.id);

                let editText = document.createElement("textarea");
                editText.classList.add('edit-text');
                editText.value = message.content;
                editText.name = 'message';

                let editSend = document.createElement("button");
                editSend.classList.add('edit-send');
                editSend.innerHTML = "Send";

                let editButton = document.createElement("button");
                editButton.classList.add('edit-button');
                editButton.innerHTML = "Edit";
                editButton.onclick = () => {
                    if (editForm.style.display == 'flex') editForm.style.display = 'none';
                    else editForm.style.display = 'flex';
                }

                editForm.appendChild(editText);
                editForm.appendChild(editSend);

                interfaceMessage.appendChild(editButton);
                interfaceMessage.appendChild(editForm);
            }

            postContainer.appendChild(interfaceMessage);
        })
    }

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}