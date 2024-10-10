// LOGIN
document.getElementById("btnConnecter").addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username === "" || password === "") {
        let content = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <p style="font-style: italic;">
                S'il vous plait entrer votre username et votre mot de passe
            </p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `;
        document.getElementById("loginInfos").innerHTML = content;
    }else {
        axios.post('https://tarmeezacademy.com/api/v1/login', {
            "username": username,
            "password": password
        }).then((response) => {
            try {
                let token = response.data.token;
                let key = response.data.user.username;
                let name = response.data.user.name;
        
                if (!token || !key || !name) {
                    throw new Error("Données invalides dans la réponse.");
                }
        
                localStorage.setItem("token", token);
                localStorage.removeItem('userName');
                localStorage.setItem('userName', name);
                localStorage.setItem("user", JSON.stringify(response.data.user));
        
                // Rediriger vers posts.html après une connexion réussie
                window.location.href = "posts.html";
            } catch (error) {
                console.error("Erreur dans le traitement de la réponse: ", error);
                document.getElementById("loginInfos").innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <p style="font-style: italic;">
                        Une erreur est survenue lors du traitement de la réponse.
                    </p>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `;
            }
        }).catch((err) => {
            document.getElementById("loginInfos").innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <p style="font-style: italic;">
                    password inférieur à 6 caractères ou (username ou password incorrect)
                </p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
        });  
    }

});