//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////// Requests Targeting All Articles ///////////////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
        console.log(foundArticles);
        res.send(foundArticles);
        } else {
            res.send(err);
        };
    });
})

.post(function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Sucessfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

//////////////////////// Requests Targetting A Specific Article //////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.")
        }
    });

})

.put(function(req, res) {
    Article.findOne({ 
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) { //if the article with that name was found
        Article.replaceOne( //perform the action
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
          function(err){
            if(!err){
              res.send("Done, updated for you!")
            } else {
              res.send("oh oh something went wrong!");
              console.log(err);
            }
          }
      );
      } else {
        res.send("404: No article found matching the title");
        console.log(err);
      }
    });
})

.patch(function(req, res){
    Article.findOne({ 
        title: req.params.articleTitle
      }, function(err, foundArticle) {
        if (foundArticle) { //if the article with that name was found
          Article.updateOne( //perform the action
          {title: req.params.articleTitle},
          {$set: req.body},
            function(err){
              if(!err){
                res.send("Done, updated for you!")
              } else {
                res.send("oh oh something went wrong!");
                console.log(err);
              }
            }
        );
        } else {
          res.send("404: No article found matching the title");
          console.log(err);
        }
      });
  })

  .delete(function(req,res) {
    Article.findOneAndDelete(
        {title: req.params.articleTitle},
        function(err, article) {
            if (!err) {
                if (article) {
                    res.send("Successfully deleted the article");
                } else {
                    res.send("no article found");
                }
            } else {
                res.send(err);
            }
        }
    )
});
 


app.listen(3001, function() {
  console.log("Server started on port 3001");
});