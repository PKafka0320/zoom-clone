import express from "express";

const app = express();

app.set("view engine", "pug"); // setting view engine
app.set("views", __dirname + "/views"); // setting directory of views

app.use("/public", express.static(__dirname + "/public")); // setting directory of files
// public files will be executed in frontend

// rendering for each address
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// opening port
const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
