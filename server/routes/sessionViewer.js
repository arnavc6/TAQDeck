const express = require("express");
 
//create router for all viewer related routes
const viewerRoutes = express.Router();

//connect to the database
const dbo = require("../db/conn");

//route to join a session
viewerRoutes.route("/join").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
      name: req.body.name,
      sessionID: req.body.sessionID,
      helped: false,
    };
    db_connect.collection(req.body.sessionName).insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
   });

//route to view whether it's the user's turn to be helped or not 
viewerRoutes.route("/view/:sessionName/:sessionID").get(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { sessionID: req.params.sessionID };
    db_connect.collection(req.params.sessionName).findOne(myquery, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
});

//route to leave a session by removing the user from it
viewerRoutes.route("/leave/:sessionName/:sessionID").delete(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { sessionID: req.body.sessionID };
  db_connect.collection(req.params.sessionName).deleteOne(myquery, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = viewerRoutes;