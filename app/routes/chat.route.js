module.exports = app => {
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();
  const image= require('../middleware/upload.middleware')
    const Chat = require("../controllers/chat.controller");
        
// send text or file  chat messages
    app.post("/chat",image, Chat.sendChatMessages);
   
 // get chat by room Id   
 app.get("/chat/:room",Chat.getChatByRoom);

// for getting chat conversation list.
app.get("/conversation/:id",Chat.getConversation)

app.get("/getSpecificChat/:postid",Chat.getSpecificChat)
  
};
  