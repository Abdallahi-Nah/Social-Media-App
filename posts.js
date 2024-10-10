// ADD INFOS ON POSTS PAGE
const defaultProfileImage = "pic.jpg";
function fullInfos() {
    let uNameElement = document.getElementById("uName");
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user.profile_image, user.username);

    if (uNameElement && user.name && user.profile_image) {
        uNameElement.innerHTML += `
            <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;" src="${user.profile_image}" alt="img" srcset="">
        `;
        uNameElement.innerHTML += user.name;
    } else {
        console.warn("Le nom d'utilisateur n'a pas été trouvé ou l'élément 'uName' est introuvable.");
    }

    // getAllPosts1();
};
let currentPage = 1;
// GET ALL POSTS
function getAllPosts1(currentPage = 1) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=4&page=${currentPage}`)
    .then((response) => {
        let posts = response.data.data;
        console.log(posts);
        document.getElementById("loading").style.visibility = "hidden";
        // document.getElementById("postsRow").innerHTML = "";
        for (const post of posts) {

            let content = `
            <div class="p-4 mt-3 mb-3 mt-2 bg-white rounded-3" style="box-shadow: 1px 7px 5px rgba(70, 70, 70, .5);">
    
                <!-- POST -->
                <div class="post mt-2 d-flex align-content-center flex-column gap-2">
    
                    <!-- HEADER -->
                    <div class="header d-flex justify-content-start align-content-center my-auto">
                        <img style="width: 70px; height: 70px; border-radius: 50%; margin-right: 15px;" src="${(typeof post.author.profile_image) === "object" ? "pic.jpg" : post.author.profile_image}" alt="fake" srcset=""> 
                        <div class="infos-date p-1">
                            <h4>${post.author.name}</h4>
                            <p>${post.created_at}</p>
                        </div>
                    </div>
                    <!--// HEADER //-->
    
    
                    <!-- BODY -->
                    <div class="body">
                        <div class="post-content">
                            <div class="post-text mb-2">
                                ${post.body} 
                            </div>
                            <div class="post-image">
                                <img style="width: 100%; height: 300px;" src="${(typeof post.image) === "string" ? post.image : "pic.jpg"}" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                    <!--// BODY //-->
    
    
                    <hr>
                    <!-- FOOTER -->
                    <div class="footer d-flex justify-content-around align-content-center mb-4">
                        <div class="number-of-comments my-auto me-1">
                            <i class="fa-solid fa-comments"></i>
                            ${post.comments_count}
                        </div>
                        <div class="add-comment me-1">
                            <a onclick="getCommentsForPost(${post.id})" class="btn btn-primary" data-bs-toggle="modal" href="#comments">
                                <i class="fa-solid fa-comments"></i>
                            </a>
                        </div>
                    </div>
                    <!--// FOOTER //-->
    
                </div>
                <!--// POST //-->

            </div>
            `;
            
            document.getElementById("postsRow").innerHTML += content;
        }
    }).catch((err) => {
        console.log(err);
    });
}



window.addEventListener('scroll', function() {
    if((window.pageYOffset + window.innerHeight) >= document.body.offsetHeight) {
        currentPage = currentPage + 1;
        getAllPosts1(currentPage);
    }
});

getAllPosts1();

// ADD POST
document.getElementById("addSPost").addEventListener("click", function() {
    let body = document.getElementById("content").value;
    let image = document.getElementById("imgPost").files[0];
    let token = localStorage.getItem("token");

    let params = new FormData();
    params.append("body", body);
    params.append("image", image);

    console.log(body, image, token);

    axios.post('https://tarmeezacademy.com/api/v1/posts', 
        params, 
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    ).then((response) => {
        console.log(response);
        document.getElementById("content").value ="";
        getAllPosts1();
        getProfilInfos();
        getAllPosts();
        console.log("done");
    }).catch((err) => {
        console.log(err);
    });
})

// GET ALL COMMENTS FOR POST
function getCommentsForPost(id) {
    localStorage.setItem("postToComment", id);
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
        let comments = response.data.data.comments;
        document.getElementById("comments2x").innerHTML = "";
        for (const comment of comments) {
            console.log(comment);
            console.log(comment.author.name, comment.author.profile_image, comment.body);
            
            let content = `
                <div class="row container mb-2">
                    <div class="col col-2 text-end">
                      <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;" src="${(typeof comment.author.profile_image) === "object" ? "pic.jpg" : comment.author.profile_image}" alt="fake" srcset=""> 
                    </div>
                    <div class="col col-10 my-auto rounded-3 p-2 ps-3" style="height: fit-content; background-color: rgba(221, 221, 221, .5);">
                      <p>
                        <b>${comment.author.name}</b>
                      </p>
                      <hr>
                      <p>${comment.body}</p>
                    </div>
                </div>
            `;
            document.getElementById("comments2x").innerHTML += content;
        }
    }).catch((err) => {
        console.log(err);
    })
}

// ADD A NEW COMMENT
function addComment() {
    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));
    let body = document.getElementById("commentContent").value;
    let idPost = localStorage.getItem("postToComment");

    console.log(token, user.id, body);
    let params = {
        "body": body
    }

    axios.post(`https://tarmeezacademy.com/api/v1/posts/${idPost}/comments`,
        params,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    )
    .then((response) => {
        console.log(response);
        document.getElementById("commentContent").value = "";
        getAllPosts1();
        getCommentsForPost(idPost);
    }).catch((err) => {
        console.log(err);
    });
}