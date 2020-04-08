var express = require("express");
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

router.post('/', function (req, res) {
    var filename = "";
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../public/ficheros/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', (field, file) => {
        filename = file.name;
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
            if (err) throw err;
            console.log('Rename complete!');
        });
    });

    // log any errors that occur
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
        return res.status(500).send(err);
        
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end',  () => {
        res.end(filename);
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    } );
});

module.exports = router;