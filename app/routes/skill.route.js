module.exports = app => {
    const Skill = require("../controllers/skill.controller");
    // Create a new user
    app.post("/skill", Skill.createSkills);
    app.get("/skill", Skill.getAllSkill);
    app.get("/skill/:id", Skill.getOneSkill);
    app.put("/skill/:id", Skill.updateSkill);
    app.delete("/skill/:id", Skill.deleteSkill);
  };
  