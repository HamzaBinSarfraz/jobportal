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

  app.post('/userpost/skills', UserPost.matchSkills);

  app.delete('/clearpost', UserPost.delete)

  // Creating SubAdminPost
  app.post("/adminpost", UserPost.createAdminPost);

  // Get  post created by login subadmin this is for Data Entry Role where user see only his post
  app.get('/userpostbyadmin/:adminid', UserPost.findpostbyAdmin);

 /* List of all newely created posts/job with post/job all details along with user details.
    this is for filter role where user see all the post created by subadmin
*/
  app.get('/newpostlist', UserPost.ListofNewPost)

  // update the status of subadmin post
  app.post('/poststatus/:id',UserPost.updatePostStatus)
};
