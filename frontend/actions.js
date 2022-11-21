import { Api } from "./api.js";

class Actions {
    static async changeColor() {
        let r = document.querySelector(':root');
        let icon = document.getElementById('style-img');

        if (r.style.getPropertyValue('--color-font') == 'black') {
            icon.src = "/icons/moon.svg";

            r.style.setProperty('--color1', 'rgb(29, 30, 32)');
            r.style.setProperty('--color2', 'rgb(50, 50, 50)');
            r.style.setProperty('--color3', 'rgb(180, 180, 181)');

            r.style.setProperty('--color-font', 'white');
            r.style.setProperty('--color-font2', 'black');
            r.style.setProperty('--color-font3', 'rgb(191, 191, 191)');

            r.style.setProperty('--filter', 'invert(90%)');
        } else {
            icon.src = "/icons/sun.svg";

            r.style.setProperty('--color1', 'rgb(246, 245, 243)');
            r.style.setProperty('--color2', 'rgb(205, 205, 205)');
            r.style.setProperty('--color3', 'rgb(75, 75, 74)');

            r.style.setProperty('--color-font', 'black');
            r.style.setProperty('--color-font2', 'white');
            r.style.setProperty('--color-font3', 'rgb(64, 64, 64)');

            r.style.setProperty('--filter', 'invert(0%)');
        }
    }

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
            let res = await Api.register(username, password1);
            hiddeLoader();
            if (res) {
                showLoader();
                let res2 = await Api.logIn(username, password1);
                hiddeLoader();
                if (res2) window.updatePath("/");
            }
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
        let postId = window.location.pathname.split("/")[2];

        // Detele te values
        event.target.elements.message.value = "";

        let res = await Api.newMessage(message, postId);
        if (res) updatePath(window.location.pathname);
    }

    static async editMessage(event, messageId) {
        event.preventDefault(); // Avoid the page reload

        let message = event.target.elements.message.value;

        let res = await Api.editMessage(message, messageId);
        if (res) updatePath(window.location.pathname);
    }

    static async deleteMessage(messageId) {
        let res = await Api.deleteMessage(messageId);
        if (res) updatePath(window.location.pathname);
    }
}

window.Actions = Actions;