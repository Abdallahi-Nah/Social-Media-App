// REGISTER
document.getElementById("btnInscrire").addEventListener("click", function() {
    let profil = document.getElementById("img").files[0];
    let username = document.getElementById("username").value; 
    let name = document.getElementById("name").value; 
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value

    let params = new FormData();
    params.append("username", username);
    params.append("name", name);
    params.append("image", profil);
    params.append("email", email);
    params.append("password", password);

    // let headers = {
    //     "Content-Type": "multipart/form-data"
    // };

    axios.post('https://tarmeezacademy.com/api/v1/register', params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then((response) => {
        let token = response.data.token;
        let user = response.data.user;
        console.log(token, user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "posts.html";
    }).catch((err) => {
        console.log(err.response);
    });

});