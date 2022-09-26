export class Api {

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