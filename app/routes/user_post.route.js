module.exports = app => {
    const UserPost = require("../controllers/user_post.controller");
    // Create a new user
    app.post("/userpost", UserPost.createPost);
    app.get('/userpost', UserPost.getAllPost);
    app.get('/userpost/:userId', UserPost.findOnePost);
    app.put('/userpost/:postId', UserPost.updatePost);
    app.delete('/userpost/:postId', UserPost.deletePost);

    app.post('/userpost/search', UserPost.search);
    app.post('/userpost/searchbyjobtitle', UserPost.searchWithJobTitle);
  };
  