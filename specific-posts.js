// GET PROFIL INFOS
function getProfilInfos() {
    let user = JSON.parse(localStorage.getItem("user"));

    axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}/posts`)
    .then((response) => {
        let numberOfComments = 0;
        let posts = response.data.data;
        console.log(response.data.data);

        for (const post of posts) {
            numberOfComments = numberOfComments + Number(post.comments_count);
        }

        document.getElementById("profInfos").innerHTML = "";

        let content = `
        <div class="img my-auto col col-4">
            <img
                style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-left: 50px;
                "
                src="${(typeof user.profile_image) === "object" ? "pic.jpg" : user.profile_image}"
                alt="img"
                srcset=""
            />
        </div>
        <div class="infos col col-8">
        <div class="d-flex align-items-center justify-content-center">
            <div class="row">
            <div
                class="infos-personnel col border border-top-0 border-start-0 border-bottom-0"
            >
                <h3 style="margin-top: 30px" class="ms-4">${user.name}</h3>
                <p>
                <strong class="ms-4">${user.email}</strong>
                </p>
            </div>
            <div class="global-info col text-center">
                <div class="w-100 h-100 p-0 d-flex align-items-center justify-content-end">
                    <p class="posts me-2">
                        <span class="fs-2" id="numberOfPosts">${posts.length}</span>
                        <span>Posts</span>
                    </p>
                    <p class="comments">
                        <span class="fs-2" id="numberOfComments">${numberOfComments}</span>
                        <span>Comments</span>
                    </p>
                </div>
            </div>
            </div>
        </div>
        </div>
        `;
        
        document.getElementById("profInfos").innerHTML += content;
    }).catch((err) => {
        console.log(err);
    });
}

let currentPageSecond = 1;
// GET ALL POSTS OF USER
function getAllPosts(currentPage = 1) {
    let user = JSON.parse(localStorage.getItem("user"));

    console.log(user.id, user);

    axios.get(`https://tarmeezacademy.com/api/v1/users/${user.id}/posts?limit=4&page=${currentPage}`)
    .then((response) => {
        let posts = response.data.data;
        console.log(response.data.data);
        document.getElementById("userPosts").innerHTML = "";
        for (const post of posts) {

            let content = `
                        <div
            class="p-4 mt-3 mb-3 mt-2 bg-white rounded-3"
            style="box-shadow: 1px 7px 5px rgba(70, 70, 70, 0.5)"
          >
            <!-- POST -->
            <div
              class="post mt-2 d-flex align-content-center flex-column gap-2"
            >
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

              <hr />
              <!-- FOOTER -->
              <div
                class="footer d-flex justify-content-around align-content-center mb-4"
              >
                <div class="number-of-comments my-auto me-1">
                  <i class="fa-solid fa-comments"></i>
                  ${post.comments_count}
                </div>
                <div class="add-comment me-1">
                  <a
                    onclick="getCommentsForPost(${post.id})"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    href="#comments"
                  >
                    <i class="fa-solid fa-comments"></i>
                  </a>
                </div>
                <div class="update-comment me-1">
                  <a
                    onclick="getPostInfos(${post.id})"
                    href="#updatePost"
                    data-bs-toggle="modal"
                    class="btn btn-success"                    
                  >
                    <i class="fa-solid fa-pen"></i>
                  </a>
                </div>
                <div class="delete-comment">
                  <button
                    onclick="deletePost(${post.id})"
                    class="btn btn-danger"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <!--// FOOTER //-->
            </div>
            <!--// POST //-->
          </div>
        `;
            
            document.getElementById("userPosts").innerHTML += content;
        }
    }).catch((err) => {
        console.log(err);
    });
}

window.addEventListener('scroll', function() {
    if((window.pageYOffset + window.innerHeight) >= document.body.offsetHeight) {
        currentPageSecond = currentPageSecond + 1;
        getAllPosts(currentPageSecond);
    }
});

// UPDATE POST
function getPostInfos(id) {
    console.log(`the post id is : ${id}`);
    localStorage.setItem("idP", id);
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
        console.log(response.data.data);
        document.getElementById("contentPU").value = response.data.data.body;
    }).catch((err) => {
        console.log(err);
    });
}

document.getElementById("updateSPost").addEventListener("click", function() {
    let id = localStorage.getItem("idP");
    let token = localStorage.getItem("token");
    let body = document.getElementById("contentPU").value;
    let img = document.getElementById("imgPostU").files[0];

    let params = new FormData();
    params.append("body", body);
    params.append("image", img);
    params.append("_method", "put");

    // let params = {
    //     "body": body
    // };


    console.log(id, token);
    console.log(img.name);

    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}`,
              params,
              {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
              }
    ).then((response) => {
        console.log(response);
        document.getElementById("contentPU").value = "";
        getAllPosts();
    }).catch((err) => {
        console.log(err);
    });

});

// DELETE POST
function deletePost(id) {
    let rep = confirm(`Etes-vous sur de vouloir supprimer ce post ?`);
    let token = localStorage.getItem("token");

    if(rep) {
        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((response) => {
            getProfilInfos();
            getAllPosts();
            setTimeout(() => {
                document.getElementById("delMes").innerHTML += `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <p class="text-danger fs-3 fst-italic">post deleted successfully</p>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `;
            }, 2000);
        }).catch((err) => {
            console.log(err);
        });
    }
}

// GET ALL COMMENTS FOR POST
function getCommentsForPost(id) {
    localStorage.setItem("postToComment", id);
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
        let comments = response.data.data.comments;
        document.getElementById("comments2x").innerHTML = "";
        for (const comment of comments) {
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
        getAllPosts();
        getProfilInfos();
    }).catch((err) => {
        console.log(err);
    });
}

getProfilInfos();
getAllPosts(); 