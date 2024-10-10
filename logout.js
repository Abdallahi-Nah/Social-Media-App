function logout() {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = localStorage.getItem("token");

    console.log(user.username, user.password);

    axios.post('https://tarmeezacademy.com/api/v1/logout', 
                {
                    "username": user.username
                },
                {
                    headers : {
                        "Accept": "application/json",
                        "Authorization" : `Bearer ${token}`
                    }
                }
    ).then((response) => {
        console.log(response.data);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }).catch((err) => {
        console.log(err.response);
    })
}