import { updateUserState } from "../utils/updateUserState.js";

export function renderRegister() {
    let page = document.getElementById('/register');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}