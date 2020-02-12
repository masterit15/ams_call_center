<template>
<!--Container-->
    <div class="container mt-3" id="app">


        <div :class="alertType" v-if="status">
            {{ message }}
        </div>


        <form @submit.prevent="addPost">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" class="form-control" placeholder="Title" name="title" id="title" v-model="post.title">
            </div>
            <div class="form-group">
                <label for="body">Body</label>
                <textarea name="body" id="body" placeholder="Body" class="form-control" v-model="post.body" cols="20"
                    rows="10"></textarea>
            </div>
            <div class="form-group">
                <label for="author">Author Name</label>
                <input type="text" class="form-control" placeholder="Author Name" name="author" id="author" v-model="post.author">
            </div>
            <input type="submit" v-if="!editMode" class="btn btn-md btn-primary ml-auto" value="Add Post">
            <input type="submit" v-else class="btn btn-md btn-primary ml-auto" value="Update Post">
        </form>

        <h3 class="text-center">Posts</h3>

        <!--Posts-->
        <div class="row mt-2">

            <template v-if="posts.length">
                <div class="col-md-6 col-sm-12 col-lg-6 mt-2 mb-2" v-for="(post, key) in posts" :key="key">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{post.title}}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">By: {{post.author}}</h6>
                            <p class="card-text">
                                {{post.body}}
                            </p>
                            <button class="btn btn-md btn-info btn-block" @click="editPost(post, key)">Update</button>
                            <button class="btn btn-md btn-danger btn-block" @click="deletePost(post._id, key)">Delete</button>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="col-12">
                    <h3>Currently there are no Posts in the App.</h3>
                </div>
            </template>

        </div>
        <!--Posts-->

    </div>
    <!--Container-->
</template>
<script>
export default {
  data() {
        return {
            posts: [],
            post: {
                title: "",
                body: "",
                author: ""
            },
            editMode: false,
            status: false,
            message: "",
            alertType: "",
            url: "../../../routes/api/posts/"
        };
    },
    methods: {
        // Add Or Edit Post
        addPost() {
            if (this.validate()) {
                if (!this.editMode) {
                    // Post the data to the server
                    fetch(`${this.url}/add`, {
                            method: "post",
                            body: JSON.stringify(this.post),
                            headers: {
                                "content-type": "application/json"
                            }
                        })
                        .then(res => res.json())
                        .then(data => {
                            // Success alert
                            if (data.success) {
                                this.post.title = "";
                                this.post.body = "";
                                this.post.author = "";
                                this.getAlerts(data.message, "success");
                                this.posts.push(data.post);
                            } else {
                                this.getAlerts(data.message, "danger");
                            }
                        })
                        .catch(err =>
                            this.getAlerts(
                                "Something went wrong. Please try again later.",
                                "danger"
                            )
                        );
                } else {
                    fetch(`${this.url}`, {
                            method: 'put',
                            body: JSON.stringify(this.post),
                            headers: {
                                'content-type': 'application/json'
                            }
                        }).then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                this.getAlerts(data.message, "success");
                                this.loadPosts()
                                this.post.title = ''
                                this.post.body = ''
                                this.post._id = ''
                                this.post.author = ''
                                this.editMode = false
                            } else {
                                this.getAlerts(data.message, "danger");
                            }
                        })
                        .catch(err => console.log(err))
                }
            } else {
                this.getAlerts('Please fill in all the fields.', "danger");
                return
            }
        },
        // Validation
        validate() {
            let {
                title,
                body,
                author
            } = this.post;
            if (title === "" || body === "" || author === "") {
                this.getAlerts("Please fllin all the details.", "danger");
                return false;
            }
            return true;
        },
        // Delete Post
        deletePost(id, index) {
            if (confirm("Are you sure to delete this Article?")) {
                fetch(`api/posts/${id}`, {
                        method: "delete"
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            this.getAlerts(data.message, "success");
                            this.posts.splice(index, 1);
                        } else {
                            this.getAlerts(data.message, "danger");
                        }
                    })
                    .catch(err => {
                        this.getAlerts(
                            "Something went wrong. Please try again later.",
                            "danger"
                        );
                    });
            }
        },
        // Edit Post
        editPost(post) {
            this.post = post;
            this.editMode = true;
        },
        // Get all the posts from the Database
        loadPosts() {
          
            fetch(`${this.url}`)
                .then(res => res.json())
                .then(res => {
                  console.log(res.posts)
                    this.posts = res.posts;
                })
                .catch(err => console.log(err));
        },
        // Alerts
        getAlerts(message, className) {
            this.status = true;
            this.alertType = `alert alert-${className}`;
            this.message = message;
            setTimeout(() => {
                this.status = false;
                this.alertType = "";
                this.message = "";
            }, 5000);
        }
    },
    created() {
        this.loadPosts();
    }
}
</script>