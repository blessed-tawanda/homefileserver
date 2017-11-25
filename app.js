var express = require('express');
var bodyParser = require('body-parser');
var expressFileUpload = require('express-fileupload');
//var fileDownloader = require('file-downloader');

var app = express();
app.use('/',express.static(__dirname+'/public'))
app.listen(3000)
//'127.34.12.3 tawanda
app.use(expressFileUpload());
console.log('Listening');

app.get('/', function(req,res) {
    res.sendFile(__dirname+"/index.html");
});

app.get('/download', function(req,res){
    res.sendFile(__dirname+"/setup.exe");
})

app.post('/upload',function(req,res){
    if(req.files){
        var file = req.files.filename;
        var filename = file.name;
        file.mv("./Uploaded/"+filename,function(err){
            if(err){
                console.log(err);
                res.send("An error occured")
            }
            else{
                res.send("Done Upload Complete")
            }
        })
    }
})