const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Daily Journal, a platform for sharing my personal experiences and insights. This blog is a space for me to document my daily activities, express my opinions on current events, and offer advice on various topics. I believe that sharing my stories and perspectives can inspire, entertain, and inform others. Daily Journal is also a tool for my self-reflection and personal growth, allowing me to process my emotions and thoughts through writing. I am excited to share my journey with you and hope that my posts can resonate with you in some way. Stay tuned for new entries, as I'll be updating the blog regularly. Thank you for stopping by!";
const aboutContent = "Daily Journal is a personal blog that serves as a platform for me to share my experiences, insights, and perspectives. As an individual who enjoys writing, I believe that sharing my thoughts can inspire, entertain, and inform others. I created Daily Journal to document my journey of self-discovery and growth, and I hope that my posts can resonate with my readers in some way. This blog is a personal project that I am passionate about, and I am excited to continue sharing my stories with you.";
const contactContent = "Thank you for visiting Daily Journal! If you have any questions or feedback regarding my blog, please feel free to reach out to me through the contact form below. As the sole author of this blog, I am always open to suggestions for new topics, ideas for improvement, or just general inquiries. I will do my best to respond to your message as soon as possible. Thank you for your interest in Daily Journal, and I look forward to hearing from you!";


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogData", {useNewUrlParser : true})
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const postSchema = new mongoose.Schema({
  title : String,
  content : String
}, {
  collection: "blogPosts"
})

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({})
    .then(posts =>{
      res.render("home",{
        homeContent : homeStartingContent,
        posts: posts
      });
    })
    .catch(err =>{
      console.log(err);
    })
})

app.get("/about", function(req, res){
  res.render("about",{aboutContent : aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent : contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
    .then(()=>{
      res.redirect("/");
    })
    .catch(err=>{
      console.log(err);
    })
})

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId})
    .then(post=>{
      res.render("post",{postTitle : post.title,postContent : post.content});
    })
    .catch(err=>{
      console.log(err);
    })
})










app.listen(3000, function() {
  console.log("Server started on port 3000");
});