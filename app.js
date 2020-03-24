const express = require("express");
const app = express();
// we need multer for images
const multer  = require('multer');
const Post = require('./api/models/posts');
const postsData = new Post();

// storage is about the destination of the storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`)
    }
});

// which type the photo is
const getExt = (mimetype) => {
    switch(mimetype){
        case "image/png":
            return '.png';
        case "image/jpeg":
            return '.jpg';
    }
}

// we use upload in app.post
var upload = multer({ storage: storage });


// give us the ability to use json in localhost 3000
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());
// for the photos
app.use('/uploads', express.static('uploads'));

// index page
app.get("/api/posts", (req, res)=>{
    res.status(200).send(postsData.get());
})

// show page
app.get("/api/posts/:postId", (req, res)=>{
    const postId = req.params.postId;
    const posts = postsData.get();
    const foundPost = posts.find((post) => post.id == postId);
    if(foundPost){
        res.status(200).send(foundPost);
    } else {
        res.status(404).send("Not Found")
    }
})

// create a new post
app.post("/api/posts", upload.single("post-image") ,(req, res)=>{
    
    const newPost = {
        "id": `${Date.now()}`,
        "title": req.body.title,
        "content": req.body.content,
        "post_image": req.file.path,
        "added_date": `${Date.now()}`
    }
    postsData.add(newPost);
    res.status(201).send(newPost);
})

app.listen(3000, ()=>console.log("Listening on http://localhost:3000/"));