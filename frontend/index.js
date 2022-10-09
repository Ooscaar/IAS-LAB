import { renderIndex } from './renderFunctions/renderIndex.js';
import { renderLogin } from './renderFunctions/renderLogin.js';
import { renderNewPost } from './renderFunctions/renderNewPost.js';
import { renderNotFound } from './renderFunctions/renderNotFound.js';
import { renderPost } from './renderFunctions/renderPost.js';
import { renderRegister } from './renderFunctions/renderRegister.js';

// PAGE RENDER
function render(path) {
  hiddeAllPages();

  if (path === '/') renderIndex();
  else if (path === '/register') renderRegister();
  else if (path === '/login') renderLogin();
  else if (path === '/notfound') renderNotFound();
  else if (path === '/new-post') renderNewPost();
  else if (/^\/posts\/[0-9]+$/.test(path)) renderPost();
  else renderNotFound();
}

function hiddeAllPages() {
  let pages = document.getElementsByClassName('page');
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
}


// PATH ROUTER
window.onpopstate = (event) => {
  render(event.state);
}

function updatePath(newPath) {
  if (!newPath.startsWith('/')) newPath = '/' + newPath;

  history.pushState(newPath, null, newPath);
  let popStateEvent = new PopStateEvent('popstate', { state: newPath });
  dispatchEvent(popStateEvent);
}
window.updatePath = updatePath; // So you can use it in the html

function showLoader() {
  document.getElementById('loader').style.display = "inline-block";
}
window.showLoader = showLoader;

function hiddeLoader() {
  document.getElementById('loader').style.display = "none";
}
window.hiddeLoader = hiddeLoader;

// When the user opens the page render it
history.replaceState(location.pathname, null, location.pathname);
let popStateEvent = new PopStateEvent('popstate', { state: location.pathname });
dispatchEvent(popStateEvent);


/**
 * CHECK SESSION
 * 
 * 1. You enter to the application and it sends an Api.logged():
 *    1.1. If you are logged, state-logged = true
 *      1.1.1. If you do Actions.logoutButton() then state-logged = false
 *      1.1.2. If any action returns a 401 then state-logged = false
 *    1.2. If you are not logged, state-logged = false. The only way to change
 *          state to true is via Actions.loginForm()
 */