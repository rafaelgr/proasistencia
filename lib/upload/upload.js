var express = require("express");
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var parametrosDb = require("../parametros/parametros_db_mysql");
var AWS = require('aws-sdk');

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

//DECODIFICAR FOTOS
router.post('/S3', function (req, res) {
    var filename = "";
    var f = null
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../../public/ficheros/uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', (field, file) => {
        f = file
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
		parametrosDb.getParametros(function(err, parametros) {
			if (err) return callback(err);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  f.name;
            //var blob = f.slice(0, f.size, f.type); 
            var newFile = new File([f.path], fileKey, {type: f.type});
		var params = {
			Bucket: p.bucket,
			Key: fileKey,
			IdentityPoolId: p.identity_pool,
			Body: newFile,
			ACL: "public-read"
		}
		// Use S3 ManagedUpload class as it supports multipart uploads
		var upload = new AWS.S3.ManagedUpload({
			params: params
		});
		var promise = upload.promise();
		promise
		.then (
			data => {
				if(data) {
					var re = /https/gi;
					var str = data.Location;
					data.Location = str.replace(re, "http");
					callback(err, data)
				}
				
			},
			err =>{
                console.log('An error has occured: \n' + err);
                return res.status(500).send(err);
			}
		);
		
		});
        res.end(filename);
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    } );
	//pasamos el objeto de base64 a blob
	try {
		
		
		} catch(err) {
            console.log('An error has occured: \n' + err);
            return res.status(500).send(err);
		}
});

module.exports = router;