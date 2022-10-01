import { Api } from "./api.js";

class Actions {
    static async loginForm(event) {
        event.preventDefault(); // Avoid the page reload
        // The username is inside a input with the name "username"
        let username = event.target.elements.username.value;
        // The password is inside a input with the name "password"
        let password = event.target.elements.password.value;

        Api.logIn(username, password);
    }

    static async registerForm(event) {
        event.preventDefault(); // Avoid the page reload
        // The username is inside a input with the name "username"
        let username = event.target.elements.username.value;
        // Get the passwords
        let password1 = event.target.elements.password1.value;
        let password2 = event.target.elements.password2.value;

        if(password1 != password2) alert("Passwords must match");
        else Api.register(username, password1);
    }

    static async logoutButton() {
        let res = await Api.logOut();
        console.log(res);
        return res;
    }
}

window.Actions = Actions;