var env = require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB;
if (process.env.MONGODB_URI) {
  MONGODB = process.env.MONGODB_URI;
} else {
  MONGODB = "mongodb://localhost/mongoHeadlines";
}
mongoose.connect(MONGODB, {useNewUrlParser: true});

// Scrape articles and save in database
app.get("/scrape", function(req, res) {
  axios.get("http://www.echojs.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    
    $("article h2").each(function(i, element) {
      var result = {
        title: $(this).children("a").text(),
        link: $(this).children("a").attr("href")
      };

      db.Article.findOne({link:result.link})
        .then(article => {
          if (!article) {
            db.Article.create(result)
              .then(dbArticle => console.log(dbArticle))
              .catch(err => console.log(err));
          }
        }
      );
    });
    res.send("Scrape Complete");
  });
});

app.get("/", function(req, res) {
  res.send("index.html")
})

// Return all articles from database
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Return an article + associated comments by ID
app.get("/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
    //.populate("comment")
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// save comment to database
app.post("/articles/:id", function(req, res) {
  var obj = {
    refID: req.body.refID,
    title: req.body.title,
    body: req.body.body
  }
  db.Comment.create(obj)
    .then(function(result) {
      console.log(result);
    });
});

// retrieve comments by article refID: req.params.id
app.get("/comments/:id", function(req, res) {

  db.Comment.find({refID: req.params.id})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

// Start the server
app.listen(PORT, function() {
  console.log("App is being served on port " + PORT);
});
