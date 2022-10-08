import { Api } from "./api.js";

class Actions {
    static openMenu() {
        document.getElementById('menu').style.left = '0vh';
    }

    static closeMenu() {
        document.getElementById('menu').style.left = '100vh';
    }

    static async loginForm(event) {
        event.preventDefault(); // Avoid the page reload
        // The username is inside a input with the name "username"
        let username = event.target.elements.username.value;
        // The password is inside a input with the name "password"
        let password = event.target.elements.password.value;

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
            return true;
        } catch {
            return false;
        }
    }

    static async newPostForm(event) {
        event.preventDefault(); // Avoid the page reload

        let title = event.target.elements.title.value;
        let message = event.target.elements.message.value;

        let res = await Api.newPost(title, message);
        if (res) updatePath('/');
    }
}

window.Actions = Actions;