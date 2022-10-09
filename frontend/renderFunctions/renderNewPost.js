import { updateUserState } from "../utils/updateUserState.js";

export async function renderNewPost() {
    let page = document.getElementById('/new-post');

    // Show the loader
    window.showLoader();
    // Update user state
    let isLogged = await updateUserState();

    // If the user is not logged go to /login
    if (!isLogged) {
        updatePath('/login');
        return;
    }

    // Show the page
    window.hiddeLoader();
    page.style.display = 'block';
}