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

app.use(cors()); // to put on comment before upload to a real server
app.use(express.json());

//Serve Static files from react
app.use(express.static(path.join(__dirname, "../real-app/public")));

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/cards", cards);

//The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../real-app/public/index.html"));
});

const port = 8181;
http.listen(port, () => console.log(`Listening on port ${port}...`));