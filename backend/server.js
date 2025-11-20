require("dotenv").config();
const app = require("./src/app");
const connectedDB = require("./src/db/db");
const initSocketServer = require("./src/socket.io/socketio.services");
const httpServer = require("http").createServer(app);

connectedDB();
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  
});
