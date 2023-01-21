const express = require("express"); //setup and imports for Express.js and all routes
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/sessionAdmin"));
app.use(require("./routes/sessionViewer"));
app.use(require("./routes/queueRoutes"));
const dbo = require("./db/conn");
 
app.listen(port, () => { //connect to database upon startup and call the routes as needed 
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});
