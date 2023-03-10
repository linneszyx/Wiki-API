const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true,
});
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("articles", articleSchema);
app
  .route("/articles")
  /* A get request that is looking for all the articles in the database. */
  .get(async (req, res) => {
    const foundArticles = await Article.find();
    if (foundArticles) {
      res.send(foundArticles);
    } else {
      res.send("No articles found");
    }
  })
 /* Creating a new article and saving it to the database. */
  .post(async (req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    await newArticle.save();
    res.send("Successfully added a new article");
  })
  /* Deleting all the articles in the database. */
  .delete(async (req, res) => {
    await Article.deleteMany();
    res.send("Successfully deleted all articles");
  });
app
  .route("/articles/:articleTtitle")
  /* This is a get request that is looking for a specific article in the database. */
  .get(async (req, res) => {
    const foundArticle = await Article.findOne({
      title: req.params.articleTitle,
    });
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found");
    }
  })
  /* Updating the article with the title that is passed in the url. */
  .put(async (req, res) => {
    const foundArticle = await Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    );
    if (foundArticle) {
      res.send("Successfully updated article");
    } else {
      res.send("No articles matching that title was found");
    }
  })
  /* Updating the article with the title that is passed in the url. */
  .patch(async (req, res) => {
    const foundArticle = await Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body } // $set is a mongoose method
    );
    if (foundArticle) {
      res.send("Successfully updated article");
    } else {
      res.send("No articles matching that title was found");
    }
  });
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
