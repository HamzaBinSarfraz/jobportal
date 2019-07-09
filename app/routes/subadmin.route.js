module.exports = app => {
  const subadmin = require("../controllers/subadmin.controller");

  // Create Subadmins
  app.post('/subadmin', subadmin.createSubadmin);

  // find all subadmins
  app.get('/subadmin', subadmin.findSubadmin);

  // update subadmin by subadmin id
  app.put('/subadmin/:id', subadmin.updateSubadmin);

  // delete subadmin by subadmin id
  app.get('/deletesubadmin/:id', subadmin.deleteSubadmin);

  // Login Subadmin 
  app.post('/subadmin/login', subadmin.subadminLogin);


  //  app.delete('/all',subadmin.delete)
};