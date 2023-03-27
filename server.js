const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const ModelVideo = require("./models/video");
const Comment = require("./models/comment");
dotenv.config();

// Import the express module and create an app instance
const express = require("express");
const app = express();

// Set the HTTP port to the value of the PORT environment variable, or 8080 if
// it's not set
const HTTP_PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// Set up the Handlebars view engine with a custom helper function
const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    helpers: {
      json: (context) => {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", ".hbs");

// Set up body-parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Set up MongoDB connection

console.log(process.env.MONGO_DB);
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("I am conneted to DataBase");
  })
  .catch((err) => {
    console.log(err);
    console.log("I am not connected to database");
  });


// app.get("/video", async (req, res) => {
//   try {
//     const videoall = await ModelVideo.find();

//     if (!videoall.length) {
//       return res.status(404).send("no video");
//     }
//     return res.status(200).send(videoall);
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// });
app.get('/video', (req, res) => {
  res.render('video');
});

// get single video
app.get("/video/:id", async (req, res) => {
  try {
    const videolist = await ModelVideo.find({
      videoId: req.params.id,
    });
   
    if (!videolist.length) {
      return res.status(404).send("Sorry page is broken ");
    }
    return res.status(200).send(videolist);
  } catch (err) {
    console.log(err);
  }
});

app.post("/video", async (req, res) => {
  try {
    const dataSave = new ModelVideo(req.body);
    await dataSave.save();
    return res.status(201).send("I am uploaded");
  } catch (err) {
    console.log(err);
    return res.status(404).send("Data is not successfully updated");
  }
});




// getcomment

app.get("/videos/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      videoId: req.params.id,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
app.get("/video/:id", async (req, res) => {
  try {
    const video = await ModelVideo.findOne({
      videoId: req.params.id,
    });

    if (!video) {
      return res.status(404).send("Video not found");
    }

    res.render("video", {
      layout: false,
      video: video,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});


// postComment
app.post("/videos/:id/comments", async (req, res) => {
  try {
    const comments = new Comment({
      videoId: req.params.id,
      ...req.body,
    });
    await comments.save();
    console.log(comments);

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});


app.get('/', (req, res) => {
  const searchKeyword = req.query.q;

  // Fetch all videos from the database
  ModelVideo.find({})
    .then(videos => {
      let filteredVideos = videos;

      // If a search keyword is provided, filter the videos based on the keyword
      if (searchKeyword) {
        filteredVideos = videos.filter(video => video.title.toLowerCase().includes(searchKeyword.toLowerCase()));
      }

      res.render('home', { videos: filteredVideos, searchKeyword });
    })
    .catch(err => console.log(err));
});

app.get("/admin", (req, res) => {
  res.render("admin", {
    layout: false,
  });
});

// app.get("/video", (req, res) => {
//     res.render("video", {layout:false})
// })



// Function to print server start message
const onHttpStart = () => {
  console.log("Server is starting");
  console.log(`Listening to port ${HTTP_PORT}`);
  console.log("Press control + C to stop");
}

// Start the server
app.listen(HTTP_PORT, onHttpStart);
