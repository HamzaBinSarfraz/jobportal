module.exports = app => {
    const Skill = require("../controllers/skill.controller");
    // Create a new user
    app.post("/skill", Skill.createSkills);
    app.get("/skill", Skill.getAllSkill);
    app.get("/skill/:id", Skill.getOneSkill);
    app.delete("/skill/:id", Skill.deleteSkill);
  };
  