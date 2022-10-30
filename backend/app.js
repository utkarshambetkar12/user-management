const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

var mistakeCount = 0;
var active = 0;
var id = 0;

// making a MYSQL database connection
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "crudDB",
});

db.connect(function (error) {
  if (error) throw error;
  else console.log("Connected Successfully");
});

//If First User not made Already! This API will make it for you

app.post("/firstuser", (req, res) => {
  db.query(
    "INSERT INTO crudDB.users (email_id, password, user_name) VALUES (test@123.com, test123, TEST)",
    (err, result) => {
      if (err) res.send({ error: err });
      if (result) {
        res.send({
          userAdded:
            "Test User Added! email_id => test@123.com password => test123",
        });
      }
    }
  );
});

//This API is responsible for Logging In users

app.post("/login", async (req, res) => {
  const email_id = req.body.email_id; // stores email id
  const password = req.body.password; // stores password to check in database

  db.query(
    "SELECT mistake_count, active, id FROM crudDB.users WHERE email_id = ?", // selecting the mistake count first to avoid the user if blocked for 24 hrs
    [email_id],
    async (err, result) => {
      if (err) {
        res.send({ error: "User Not Found" });
      } else if (result.length <= 0) {
        res.send({ error: "User Not Found" }); // this makes sures that if email id is not available we send the error as "User not found"
        console.log(result);
      } else {
        mistakeCount = result[0].mistake_count; // stores the mistake count
        active = result[0].active; // stores the status of the user 0 => disabled for 24 hours, 1 => Active
        id = result[0].id;
        if (mistakeCount >= 5 && active === 0) {
          // if active is 0 and mistake count is equal to or greater than 5 then "User is blocked for 24 hours"
          res.send({ error: "User Blocked for 24 Hours" });
          return;
        } else if (mistakeCount === 5 && active === 1) {
          // This condition is set when user has entered the password wrong 5 times
          await db.query(
            "UPDATE crudDB.users SET active = 0 WHERE email_id = ?", // update the active status to 0
            [email_id],
            (err, result) => {
              if (err) {
                res.send({ error: err });
              } else {
                db.query(
                  "CREATE EVENT " +
                    "blocked" +
                    id +
                    " ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 24 HOUR DO UPDATE crudDB.users SET active = 1, mistake_count = 0 WHERE email_id = ?",
                  [email_id], // use EVENT and SCHEDULE to make sure the user is blocked for 24 hrs
                  (err, results) => {
                    if (err) {
                      res.send({ error: "User Blocked for 24 Hours" });
                      console.log(err);
                    } else {
                      res.send({ error: "User Blocked for 24 Hours" });
                    }
                  }
                );
              }
            }
          );
        } else if (mistakeCount < 5 && active === 1) {
          // This condition makes sure that only genuine users who are below 5 mistake count and active is set are logged in
          db.query(
            "SELECT * FROM crudDB.users WHERE email_id = ? AND password = ? ",
            [email_id, password],
            (err, result) => {
              if (err) {
                res.send({ error: err });
              }
              if (result.length > 0) {
                res.send({
                  message: "Loggedin Succesfully",
                  token: "test123",
                  auth: true,
                  email_id: email_id,
                });
                db.query(
                  "UPDATE crudDB.users SET mistake_count = 0 WHERE email_id = ?", // once logged in Mistake count should be set to zero for next time use
                  [email_id]
                );
              } else {
                res.send({ error: "Wrong username/password Combination" });
                db.query(
                  "UPDATE crudDB.users SET mistake_count = mistake_count + 1 WHERE email_id = ?", // updates the mistake count if user entered wrong password
                  [email_id]
                );
              }
            }
          );
        }
      }
    }
  );
});

//This API sends the data to frontend for table

app.post("/", (req, res) => {
  db.query("SELECT * FROM crudDB.users", (err, result) => {
    res.send({ result });
  });
});

//This API adds a new user into the database

app.post("/adduser", (req, res) => {
  const email_id = req.body.email_id; // stores the email id for new user
  const password = req.body.password; // stores the password for new user
  const user_name = req.body.user_name; // stores the user name for new user

  db.query(
    "SELECT * FROM crudDB.users WHERE email_id = ?",
    [email_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      } else if (result.length <= 0) {
        db.query(
          "INSERT INTO crudDB.users (email_id, password, user_name) VALUES (?, ?, ?)", // Inserts new user into database
          [email_id, password, user_name],
          (err, result) => {
            if (err) {
              console.log(err);
              res.send({ error: "Error adding new user into Database" });
            } else {
              res.send({ result, message: "New User Added" });
            }
          }
        );
      } else {
        res.send({ error: "User Already Exists" });
      }
    }
  );
});

// This API views the User Details

app.post("/viewuser", (req, res) => {
  const id = req.body.id;
  db.query("SELECT * FROM crudDB.users WHERE id = ?;", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send({ error: "Error adding new user into Database" });
    } else {
      res.send({ result, message: "User is currently being viewed" });
    }
  });
});

// This API is used to edit the user details

app.post("/edituser", (req, res) => {
  const id = req.body.id;
  const email_id = req.body.email_id;
  const password = req.body.password;
  const user_name = req.body.user_name;
  db.query(
    "UPDATE crudDB.users SET password = ?, user_name = ? WHERE email_id = ?",
    [password, user_name, email_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ error: "Error Editing user information into Database" });
      } else {
        res.send({ result, message: "User Edited" });
      }
    }
  );
});

// This API is used to Delete a particular user

app.post("/deleteuser", (req, res) => {
  const id = req.body.id;
  db.query("DELETE FROM crudDB.users WHERE id = ?;", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send({ error: "Error Deleting user from Database" });
    } else {
      res.send({ result, message: "User Deleted Successully" });
    }
  });
});

app.listen(3001, () => {
  console.log("Running on Port 3001");
});
