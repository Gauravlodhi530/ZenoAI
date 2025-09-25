require("dotenv").config();
const app = require("./src/app");
const connectedDB = require("./src/db/db");
const initSocketServer = require("./src/socket.io/socketio.services");
const httpServer = require("http").createServer(app);

connectedDB();
initSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
