const { onRequest } =  require("firebase-functions/v2/https");
const app = require("./src/server.js");

exports.api = onRequest(app);
