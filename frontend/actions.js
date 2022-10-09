import { Api } from "./api.js";

class Actions {
    static async loginForm(event) {
        event.preventDefault(); // Avoid the page reload
        // The username is inside a input with the name "username"
        let username = event.target.elements.username.value;
        // The password is inside a input with the name "password"
        let password = event.target.elements.password.value;

        //Remove values
        event.target.elements.username.value = "";
        event.target.elements.password.value = "";

        showLoader();
        let res = await Api.logIn(username, password);
        hiddeLoader();
        if (res) window.updatePath("/");
    }

    static async registerForm(event) {
        event.preventDefault(); // Avoid the page reload
        // The username is inside a input with the name "username"
        let username = event.target.elements.username.value;
        // Get the passwords
        let password1 = event.target.elements.password1.value;
        let password2 = event.target.elements.password2.value;

        // Remove values
        event.target.elements.username.value = "";
        event.target.elements.password1.value = "";
        event.target.elements.password2.value = "";

        if (password1 != password2) alert("Passwords must match");
        else {
            showLoader();
            await Api.register(username, password1);
            hiddeLoader();
        }
    }

    static async logoutButton() {
        try {
            showLoader();
            await Api.logOut();
            hiddeLoader();
            updatePath(location.pathname);
            return true;
        } catch {
            return false;
        }
    }

    static async newPostForm(event) {
        event.preventDefault(); // Avoid the page reload

        let title = event.target.elements.title.value;
        let message = event.target.elements.message.value;
        let isPrivate = event.target.elements.private.checked;

        // Remove values
        event.target.elements.title.value = "";
        event.target.elements.message.value = "";
        event.target.elements.private.checked = false;

        let res = await Api.newPost(title, message, isPrivate);
        if (res) updatePath('/');
    }

    static async newMessageForm(event) {
        event.preventDefault(); // Avoid the page reload

        let message = event.target.elements.message.value;
        let postId = window.location.pathname.split("/")[2]

        // Detele te values
        event.target.elements.message.value = "";

        let res = await Api.newMessage(message, postId);
        if (res) updatePath(window.location.pathname);
    }
}

window.Actions = Actions;