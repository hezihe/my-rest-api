const users = require("./routes/users");
const auth = require("./routes/auth");
const cards = require("./routes/cards");
const cors = require("cors"); // to put on comment before upload to a real server
const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const path = require("path");

mongoose
  .connect("mongodb://localhost/my_rest_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

// ** MIDDLEWARE ** //
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8181",
  "https://business-card-react-nodejs-app.herokuapp.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); // to put on comment before upload to a real server
app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/cards", cards);

if (process.env.NODE_ENV === "production") {
  //Serve Static files from react
  app.use(express.static(path.join(__dirname, "../real-app/build")));
  //The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../real-app/build", "index.html"));
  });
}

console.log(path.join(__dirname, "../real-app/build", "index.html"));

const port = process.env.PORT;
http.listen(port, () => console.log(`Listening on port ${port}...`));
