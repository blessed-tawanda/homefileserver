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
var listOfFiles;
function getFileList(){ // function used to get the list of files on server
    fs.readdir(__dirname+'/Uploaded/',function(err,files){
        if(err)
            {console.log(err);}
        else
            {listOfFiles = files;
                // get the size of file ;) for later consumption :(
                // fs.stat(__dirname+'/Uploaded/'+listOfFiles[0],function(err,stats){
                //     console.log(stats.size)
                // })
            }
    })    
}
getFileList();
app.use('/',express.static(__dirname+'/public'))
app.listen(3000)
console.log('Listening');

app.use(expressFileUpload());


app.get('/', function(req,res) {
    //entrace point "home page"
    res.sendFile(__dirname+"/index.html");
    // res.render('index'); 
});

app.get('/upload', function(req,res){
    //res.sendFile(__dirname+'/upload.html');
    res.render('upload');
})

app.get('/download',function(req,res){
    //res.sendFile(__dirname+'/download.html')
    getFileList();
    var data = {filelist:listOfFiles};
    res.render('download', data)
})

app.get('/download/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/"+req.params.filename)
})

app.post('/upload',function(req,res){
    console.log("upload process fired")
    var nameOfFile;
    var file = req.files.file;
    nameOfFile = file.name;
    
    file.mv("./Uploaded/"+nameOfFile,function(err){
        if(err){
            console.log(err); 
            res.send("An error occured")
        }
        else{
            res.send("Upload Complete")  
        }
    })
})

