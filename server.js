
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv=require("dotenv");
const VideoModel=require("./models/video")
dotenv.config();

// Import the express module and create an app instance
const express = require('express');
const app = express();

// Set the HTTP port to the value of the PORT environment variable, or 8080 if
// it's not set
const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// Set up the Handlebars view engine with a custom helper function
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    helpers: {
        json: (context) => {
            return JSON.stringify(context);
        }
    }
}));
app.set('view engine', '.hbs');

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up MongoDB connection


mongoose.connect(process.env.MONGODB_URL).then(()=>{
console.log("I am connecting to database")

}).catch((err)=>{
  console.log(err);

});

// Use routes


app.post("/video",async(req,res)=>{
  try{
    const dataSave=new VideoModel(req.body);
    await dataSave.save();
    return res.status(201).send("I am uploaded")
  }catch(err){
    console.log(err)
    return res.status(404).send("Data is not successfully updated")
  }
 
})
app.get("/video/:id",async(req,res)=>{
  try{
    console.log(req.params);
    const videolist=await VideoModel.find( {videoId: req.params.id});
    console.log(videolist)
    if(!videolist){
     return res.send("I dont have a video");
    }
    return res.send(videolist)
  }catch(err){
 console.log(err)
  }

  
})


app.get("/video",async(req,res)=>{
  const videoall=await VideoModel.find();
  if(!videoall){
    return res.status(404).send("no video");

  }
  return res.status(200).send(videoall)
})
app.get("/", (req, res) => {
    res.render("home", {layout:false})    
})
app.get("/admin", (req, res) => {
    res.render("admin", {layout:false})    
})

// app.get("/video", (req, res) => {
//     res.render("video", {layout:false})    
// })

app.get("/search", (req, res) => {
    const searchTerm = req.query.search;
    Video.find({ title: { $regex: searchTerm, $options: "i" } }, (err, videos) => {
      if (err) {
        console.error(err);
        res.render("home", { videos: null });
      } else {
        res.render("home", { videos });
      }
    });
  });
  
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
