var express = require('express');
var bodyParser = require('body-parser');
var expressFileUpload = require('express-fileupload');
var fs = require('fs');
var ejs = require('ejs');
var app = express();
//var fileDownloader = require('file-downloader');
app.set('view engine','ejs')
var listOfFiles;
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


app.use('/',express.static(__dirname+'/public'))
app.listen(3000)
//'127.34.12.3 tawanda
app.use(expressFileUpload());
console.log('Listening');

app.get('/', function(req,res) {
    //res.sendFile(__dirname+"/index.html");
    res.render('index'); 
});

app.get('/upload', function(req,res){
    //res.sendFile(__dirname+'/upload.html');
    res.render('upload');
})

app.get('/download',function(req,res){
    //res.sendFile(__dirname+'/download.html')
    var data = {filelist:listOfFiles};
    res.render('download', data)
})

app.get('/download/:filename',function(req,res){
    res.download(__dirname+"/Uploaded/"+req.params.filename)
})

app.post('/upload',function(req,res){
    console.log('Recieving files')
    if(req.files){
        var nameOfFile;
        var file = req.files.filename;
        if(file==undefined){
            res.redirect(req.get('referer'))
        }
        else if(file.length==undefined){
            nameOfFile = file.name;
            file.mv("./Uploaded/"+nameOfFile,function(err){
                 if(err){
                     console.log(err);
                     res.send("An error occured")
                 }
                 else{
                    res.json({progress: 'done'})  
                 }
             })
        }
        else {for(var i = 0; i< file.length; i++)
        {
           nameOfFile = file[i].name;
           file[i].mv("./Uploaded/"+nameOfFile,function(err){
                if(err){
                    console.log(err);
                    res.send("An error occured")
                }
            })
        }
        res.send("Done Upload Complete")
    }
    }
})

