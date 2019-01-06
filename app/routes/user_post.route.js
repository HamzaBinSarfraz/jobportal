module.exports = app => {
    const UserPost = require("../controllers/user_post.controller");
    // Create a new user
    app.post("/userpost", UserPost.createPost);
    app.get('/userpost', UserPost.getAllPost);
    app.get('/userpost/:postId', UserPost.findOnePost);
    app.put('/userpost/:postId', UserPost.updatePost);
  };
  