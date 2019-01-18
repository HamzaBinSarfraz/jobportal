module.exports = app => {
    const Admin = require("../controllers/admin.controller");
    // Create a new user
    app.post("/admin", Admin.createUser);
    app.put('/admin/:id', Admin.updatePost);
    app.get('/admin', Admin.getAll);
  };
  