const express = require("express");
 
//create router for all queue related routes
const queueRoutes = express.Router();
 
//connect to the database
const dbo = require("../db/conn");

//route to add the name of a queue to the list of queues
queueRoutes.route("/addqueue").post((req, response) => {
    let db_connect = dbo.getDb();
    let myobj = {
      name: req.body.name,
    };
    db_connect.collection("queues").insertOne(myobj, function (err, res) {
      if (err) throw err;
      response.json(res);
    });
   });
  
//method to get the list of queues 
queueRoutes.route("/queues").get(function (req, response) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("queues")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

//method to remove a queue from the list once a session ends
queueRoutes.route("/removequeue/:id").delete(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { name: req.params.id };
  db_connect.collection("queues").deleteOne(myquery, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = queueRoutes;