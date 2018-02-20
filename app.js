var express = require('express');
var bodyParser = require('body-parser');
var expressFileUpload = require('express-fileupload');
var fs = require('fs');
var ejs = require('ejs');
var morgan = require('morgan');
var app = express();
//app.use(morgan('combined'))
//var fileDownloader = require('file-downloader');
app.set('view engine','ejs')

var listOfVideos;
var listOfAudio;
var listOfImages;
var listOfMisc;

function getVideoFileList(){ // function used to get the list of files on server
    fs.readdir(__dirname+'/Uploaded/Video',function(err,files){
        if(err)
            {console.log(err);}
        else
            {listOfVideos = files;}
    })    
}
function getImageFileList(){ // function used to get the list of files on server
    fs.readdir(__dirname+'/Uploaded/Images',function(err,files){
        if(err)
            {console.log(err);}
        else
            {listOfImages = files;}
    })    
}
function getMiscFileList(){ // function used to get the list of files on server
    fs.readdir(__dirname+'/Uploaded/Misc',function(err,files){
        if(err)
            {console.log(err);}
        else
            {listOfMisc = files;}
    })    
}
function getAudioFileList(){ // function used to get the list of files on server
    fs.readdir(__dirname+'/Uploaded/Audio',function(err,files){
        if(err)
            {console.log(err);}
        else
            {listOfAudio = files;}
    })    
}

getVideoFileList();
getAudioFileList();
getMiscFileList();
getImageFileList();

app.use('/',express.static(__dirname+'/public'))
app.listen(3000)
console.log('Listening');

app.use(expressFileUpload());


app.get('/', function(req,res) {
    //entrace point "home page"
    res.sendFile(__dirname+"/index.html");
});
//audio download page render
app.get('/audio', function(req,res){
    getVideoFileList();
    getAudioFileList();
    getMiscFileList();
    getImageFileList();
    var data =  { 
                   video:listOfVideos,
                   audio:listOfAudio,
                   image:listOfImages,
                   misc:listOfMisc
                };
    res.render('audio', data)
})
// video download page render
app.get('/download',function(req,res){
    getVideoFileList();
    getAudioFileList();
    getMiscFileList();
    getImageFileList();
    var data =  { 
                   video:listOfVideos,
                   audio:listOfAudio,
                   image:listOfImages,
                   misc:listOfMisc
                };
    res.render('download', data)
})
// image download page render
app.get('/image',function(req,res){
    getVideoFileList();
    getAudioFileList();
    getMiscFileList();
    getImageFileList();
    var data =  { 
                   video:listOfVideos,
                   audio:listOfAudio,
                   image:listOfImages,
                   misc:listOfMisc
                };
    res.render('images', data)
})
// misc download page render
app.get('/misc',function(req,res){
    getVideoFileList();
    getAudioFileList();
    getMiscFileList();
    getImageFileList();
    var data =  { 
                   video:listOfVideos,
                   audio:listOfAudio,
                   image:listOfImages,
                   misc:listOfMisc
                };
    res.render('misc', data)
})

//download video files
app.get('/download/video/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/Video/"+req.params.filename)
})
//download audio files
app.get('/download/audio/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/Audio/"+req.params.filename)
})
//download image files
app.get('/download/image/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/Images/"+req.params.filename)
})
//download misc files
app.get('/download/misc/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/Misc/"+req.params.filename)
})
app.post('/upload',function(req,res){
    console.log("upload process fired")
    var nameOfFile;
    var filetype;
    var file = req.files.file;
    nameOfFile = file.name;
    fileType = file.mimetype;
    // using Regular Expressions to upload files according to thier file type genre
    var reVideos = /video/;
    var reApp = /application/;
    var reAudio = /audio/;
    var reImage = /image/;
    if(reVideos.test(fileType)){
        console.log("its a video");
        file.mv("./Uploaded/Video/"+nameOfFile,function(err){
            if(err){
                console.log(err); 
                res.send("An error occured")
            }
            else{
                res.send("Upload Complete")  
            }
        })

    }
    if(reApp.test(fileType)){
        console.log("its misc");
        file.mv("./Uploaded/Misc/"+nameOfFile,function(err){
            if(err){
                console.log(err); 
                res.send("An error occured")
            }
            else{
                res.send("Upload Complete")  
            }
        })
    }
    if(reAudio.test(fileType)){
        console.log("its audio")
        file.mv("./Uploaded/Audio/"+nameOfFile,function(err){
            if(err){
                console.log(err); 
                res.send("An error occured")
            }
            else{
                res.send("Upload Complete")  
            }
        })
    }
    if(reImage.test(fileType)){
        console.log("its an image")
        file.mv("./Uploaded/Images/"+nameOfFile,function(err){
            if(err){
                console.log(err); 
                res.send("An error occured")
            }
            else{
                res.send("Upload Complete")  
            }
        })
    }

    // file.mv("./Uploaded/"+nameOfFile,function(err){
    //     if(err){
    //         console.log(err); 
    //         res.send("An error occured")
    //     }
    //     else{
    //         res.send("Upload Complete")  
    //     }
    // })
})

