// Create web server
// 1. Import express
const express = require("express");
const app = express();
// 2. Import body-parser
const bodyParser = require("body-parser");
// 3. Import mongoose
const mongoose = require("mongoose");
// 4. Import Comment model
const Comment = require("./models/Comment");
// 5. Import Post model
const Post = require("./models/Post");

// 6. Connect to database
mongoose.connect("mongodb://localhost/comments", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 7. Set body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// 8. Set view engine
app.set("view engine", "ejs");

// 9. Set public folder
app.use(express.static("public"));

// 10. Set routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/posts", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("posts", { posts: posts });
    }
  });
});

app.get("/posts/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("comments")
    .exec((err, post) => {
      if (err) {
        console.log(err);
      } else {
        res.render("post", { post: post });
      }
    });
});

app.post("/posts", (req, res) => {
  Post.create(req.body.post, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/posts");
    }
  });
});

app.post("/posts/:id/comments", (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          post.comments.push(comment);
          post.save();
          res.redirect(`/posts/${post._id}`);
        }
      });
    }
  });
});

// 11. Start server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});