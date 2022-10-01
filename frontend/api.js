export class Api {
<<<<<<< HEAD
  static async logIn(username, password) {

    let res = await fetch("/api/users/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username: username, password: password }),
    });

    if (res.status === 200) window.updatePath("/");
    else alert(`Error ${res.status}`);
  }

  static async register(username, password) {
    let res = await fetch("/api/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username: username, password: password }),
    });

    if (res.status === 200) this.logIn(username, password1);
    else alert(`Error ${res.status}`);
  }

  static async logged() {
    let res = await fetch("/api/users/me", {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    })
    
    if (res.status === 200) return (await res.json()).data.user;
    else return false;
  }

  static async logOut() {
    let res = await fetch("/api/users/logout", {
      method: "POST",
      headers: {"Content-Type": "application/json"}
    });
    if (res.status === 200) return true;
    else return false;
  }
}
=======

    static logIn(username, password) {
        fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password})
        })
        .then(res => {
            if(res.status === 200) window.updatePath('/');
            else alert(`Error ${res.status}`);
        })
    }

    static register(username, password1, password2) {
        if(password1 !== password2) {
            alert('Passwords must match');
            return;
        }

        fetch('/api/users/register', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password1})
        }).then(res => {
            if(res.status === 200) this.logIn(username, password1);
            else alert(`Error ${res.status}`);
        });
    }

}
>>>>>>> b9bbd48dfcb0deda7598568781a5d14c3023320e
