export class Api {
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
