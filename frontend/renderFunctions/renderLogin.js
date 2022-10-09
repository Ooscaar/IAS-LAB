import { updateUserState } from "../utils/updateUserState.js";

export function renderLogin() {
    let page = document.getElementById('/login');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}