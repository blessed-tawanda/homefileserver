var express = require("express");
var bodyParser = require("body-parser");
var expressFileUpload = require("express-fileupload");
var fs = require("fs");
var ejs = require("ejs");
var app = express();
const decimal = require('decimal.js')
app.set("view engine", "ejs");

const listOfFiles = {
  video: [],
  audio: [],
  misc: [],
  image: []
};

function calculateFileSize(sizeInByte) {
  if(sizeInByte < 1024) {
    var sizeInKb = new decimal(sizeInByte / 1024)
    return `${sizeInMb.toFixed(2)}kb`
  } else if(sizeInByte >= 1024 && sizeInByte < 1073741824) {
    var sizeInMb = new decimal(sizeInByte / 1048576)
    return `${sizeInMb.toFixed(2)}mb`
  } else if(sizeInByte > 1073741824) {
    var sizeInGb = new decimal((sizeInByte / (1024*1024*1024*1024)))
    return `${sizeInGb.toFixed(2)}gb`
  }
}

// using Regular Expressions to upload files according to thier file type genre
const supportedFileTypes = [
  { fileType: "video", fileTypeRegex: /video/ },
  { fileType: "audio", fileTypeRegex: /audio/ },
  { fileType: "misc", fileTypeRegex: /application/ },
  { fileType: "image", fileTypeRegex: /image/ }
];

supportedFileTypes.forEach(file => {
  if (!fs.existsSync(__dirname + `/Uploaded/`)) {
    fs.mkdirSync(__dirname + `/Uploaded/`);
  }
  if (!fs.existsSync(__dirname + `/Uploaded/${file.fileType}`)) {
    console.log(`---${file.fileType} folder does not exist. Creating it.`);
    fs.mkdirSync(__dirname + `/Uploaded/${file.fileType}`);
  } else {
    console.log(`---${file.fileType} folder exists`);
  }
});

function getFileList(file) {
  // function used to get the list of files on server
  listOfFiles[file.fileType] = fs.readdirSync(
    __dirname + `/Uploaded/${file.fileType}`
  );
}

// get all the files when the app loads
supportedFileTypes.forEach(getFileList);

app.use("/", express.static(__dirname + "/public"));
var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

app.use(expressFileUpload());

app.get("/", function(req, res) {
  //entrace point "home page"
  res.sendFile(__dirname + "/index.html");
  // res.render('index');
});

app.get("/upload", function(req, res) {
  //res.sendFile(__dirname+'/upload.html');
  res.render("upload");
});

app.get("/download", function(req, res) {
  // get all the files when the app loads
  supportedFileTypes.forEach(getFileList);
  res.render("download", {listOfFiles});
});
// image download page render
app.get("/image", function(req, res) {
  supportedFileTypes.forEach(getFileList);
  res.render("images", listOfFiles);
});
// misc download page render
app.get("/misc", function(req, res) {
  supportedFileTypes.forEach(getFileList);
  res.render("misc", listOfFiles);
});

app.get("/audio", function(req, res) {
  supportedFileTypes.forEach(getFileList);
  res.render("audio", listOfFiles);
});

// register routes file downloading the different types of files
supportedFileTypes.forEach(file => {
  //download video files
  app.get(`/download/${file.fileType}/:filename`, function(req, res) {
    // console.log("downloading: " + req.params.filename)
    res.download(
      __dirname + `/Uploaded/${file.fileType}/` + req.params.filename
    );
  });
});

app.post("/upload", function(req, res) {
  console.log("upload process fired");
  var nameOfFile = req.files.file.name;
  var fileType = req.files.file.mimetype;

  console.log(`Adding ${nameOfFile} ${calculateFileSize(req.files.file.data.length)}`)
  // using Regular Expressions to upload files according to thier file type genre
  supportedFileTypes.forEach(file => {
    if (file.fileTypeRegex.test(fileType)) {
      console.log(`its a ${file.fileType}`);
      req.files.file.mv(`./Uploaded/${file.fileType}/` + nameOfFile, function(
        err
      ) {
        if (err) {
          console.log(err);
          res.send("An error occured");
        } else {
          res.send("Upload Complete");
        }
      });
    }
  });
});
