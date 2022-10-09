import { updateUserState } from "../utils/updateUserState.js";

export function renderNotFound() {
    let page = document.getElementById('/notfound');

    // Show the loader
    window.showLoader();
    // Update user state
    updateUserState();

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}