import { renderIndex } from './renderFunctions/renderIndex.js';
import { renderRegister } from './renderFunctions/renderRegister.js';
import { renderLogin } from './renderFunctions/renderLogin.js';
<<<<<<< HEAD
import { renderPost } from './renderFunctions/renderPost.js';
import { renderNotFound } from './renderFunctions/renderNotFound.js';

=======
import { renderNotFound } from './renderFunctions/renderNotFound.js';

import { Api } from './api.js';

>>>>>>> b9bbd48dfcb0deda7598568781a5d14c3023320e
// PAGE RENDER
function render(path) {
  hiddeAllPages();

  if(path === '/') renderIndex();
  else if(path === '/register') renderRegister();
  else if(path === '/login') renderLogin();
  else if(path === '/notfound') renderNotFound();
<<<<<<< HEAD
  else if(/^\/posts\/[0-9]+$/.test(path)) renderPost();
=======
>>>>>>> b9bbd48dfcb0deda7598568781a5d14c3023320e
  else renderNotFound();
}

function hiddeAllPages() {
  let pages = document.getElementsByClassName('page');
  for(let i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
}


// PATH ROUTER
window.onpopstate = (event) => {
  render(event.state);
}

function updatePath(newPath) {
  if(!newPath.startsWith('/')) newPath = '/' + newPath;

  history.pushState(newPath, null, newPath);
  let popStateEvent = new PopStateEvent('popstate', { state: newPath });
  dispatchEvent(popStateEvent);
}
window.updatePath = updatePath; // So you can use it in the html

// When the user opens the page render it
history.replaceState(location.pathname, null, location.pathname);
let popStateEvent = new PopStateEvent('popstate', { state: location.pathname });
<<<<<<< HEAD
dispatchEvent(popStateEvent);
=======
dispatchEvent(popStateEvent);



// ACTIONS
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let username = e.target.username.value;
  let password = e.target.password.value;
  Api.logIn(username, password);
})

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let username = e.target.username.value;
  let password1 = e.target.password1.value;
  let password2 = e.target.password2.value;
  Api.register(username, password1, password2);
})
>>>>>>> b9bbd48dfcb0deda7598568781a5d14c3023320e
