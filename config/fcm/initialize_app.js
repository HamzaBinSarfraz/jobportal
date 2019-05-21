
const admin = require("firebase-admin");
const serviceAccount = require("./service_account_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jobportal-2d5f7.firebaseio.com"
  });