const express = require("express");
 
//create router for all admin related routes
const adminRoutes = express.Router();
 
//connect to the database
const dbo = require("../db/conn");

//route to create a session
adminRoutes.route("/create").post(function (req, response) {
  let db_connect = dbo.getDb();
  db_connect.createCollection(req.body.name);
  response.send("Done");
});

//route to get a list of everyone who's joined the session
adminRoutes.route("/manage/:id").get(function (req, response) {
  let db_connect = dbo.getDb();
  db_connect
   .collection(req.params.id)
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     response.json(result);
   });
});

//route to update the state of the first user in the list
adminRoutes.route("/help/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { sessionID: req.body.sessionID };
  let newvalues = {
    $set: {
      helped: true,
    },
  };
  db_connect
    .collection(req.params.id)
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
 });

//route to display the user currently being helped
adminRoutes.route("/current/:id").get(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { helped: true };
  db_connect
    .collection(req.params.id)
    .findOne(myquery, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});
 
//route to remove the first user from session once they've been helped
adminRoutes.route("/popsession/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { sessionID: req.body.sessionID };
 db_connect.collection(req.params.id).deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   response.json(obj);
 });
});

//route to end the session
adminRoutes.route("/endsession/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  db_connect.collection(req.params.id).drop();
  response.send("Done");
});
 
module.exports = adminRoutes;
