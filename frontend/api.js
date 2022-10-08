export class Api {
  static async logIn(username, password) {
    let res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (res.status === 200) return true;
    else if (res.status === 401) alert('Invalid credential');
    else alert(`Error ${res.status}`);
    return false;
  }

  static async register(username, password) {
    let res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password })
    });

    if (res.status === 201) this.logIn(username, password1);
    else if (res.status === 409) alert('Error: Username already used');
    else alert(`Error ${res.status}`);
  }

  static async logged() {
    let res = await fetch("/api/users/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (res.status === 200) return (await res.json()).user;
    else return false;
  }

  static async logOut() {
    let res = await fetch("/api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    if (res.status === 200) return true;
    else return false;
  }

  static async newPost(title, message) {
    let res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, message: message })
    });

    if (res.status === 200) return true;
    else return false;
  }

  static async getPost(postId) {
    let res = await fetch(`/api/posts/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (res.status === 200) return (await res.json()).post;
    else alert(res.status);
  }

  static async getPagePosts(page) {
    let res = await fetch(`/api/posts?page=${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 200) return await (res.json()).posts;
    else alert(res.status);
  }

  static async getPostMessages(postId) {
    let res = await fetch(`/api/messages/${postId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (res.status === 200) return (await res.json()).messages;
    else alert(res.status);
  }
}
