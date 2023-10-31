var express = require("express");
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var parametrosDb = require("../parametros/parametros_db_mysql");
var AWS = require('aws-sdk');
var facturasproveesdB = require('../facturas_proveedores/facturasProveedores_db_mysql');

router.post('/s3/:name/:facproveId', function (req, res) {
    var filename = "";
    var name = req.params.name;
    var id = req.params.facproveId;
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(process.env.UPLOAD_DIR);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', (field, file) => {
        filename = file.name;
        fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
            if (err) throw err;
            console.log('Rename complete!');
            parametrosDb.getParametros(function(err, parametros) {

                if (err)  return res.status(500).send(err);
                var p = parametros[0];
                //AWS
                AWS.config.region = p.bucket_region_server;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                  IdentityPoolId:  p.identity_pool_server,
                });
                var fileKey =  "facturas_proveedores/" + name;
                const fileContent = fs.createReadStream(form.uploadDir + "\\" + file.name);
                //const data = fs.readFileSync(rutaDelArchivo, 'utf8');
            var params = {
                Bucket: p.bucket_server,
                Key: fileKey,
                Body: fileContent,
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
                        console.log('upload complete!');
                        var facprove = {
                            nombreFacprovePdf: name,
                            facproveId: id
                        }
                        facturasproveesdB.putFacturaAntproveToNull( facprove, function(err, result) {
                            if (err) throw err;
                            if(result)  console.log('update facprove complete!');
                        });
                    }
                    
                },
                err =>{
                    console.log('An error has occured: \n' + err);
                    return res.status(500).send(err);
                }
            );
            
            }); 
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

router.post('/docpago', function (req, res) {
    var filename = "";
    var f = null
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(process.env.DOC_PAGO_DIR);

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
        res.end(filename);
		/* parametrosDb.getParametros(function(err, parametros) {

			if (err)  return res.status(500).send(err);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  f.name;
			var src = process.env.DOC_PAGO_DIR + "\\" + fileKey
			const fileContent = fs.readFileSync(src);
		var params = {
			Bucket: p.bucket,
			Key: fileKey,
			IdentityPoolId: p.identity_pool,
			Body: fileContent,
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
                   
                    res.end(data.Location);
				}
				
			},
			err =>{
                console.log('An error has occured: \n' + err);
                return res.status(500).send(err);
			}
		);
		
		}); */
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    } );
});

router.post('/docum/s3', function (req, res) {
    var file  = req.body
    var blob = file.slice(0, file.size, file.type); 
    var newFile = new File([blob], {type: file.type});

    var filename = "";
   
        filename = f.name;
        
        parametrosDb.getParametros(function(err, parametros) {

			if (err)  return res.status(500).send(err);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  f.name;
			const fileContent = f;
		var params = {
			Bucket: p.bucket,
			Key: fileKey,
			IdentityPoolId: p.identity_pool,
			Body: fileContent,
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
                   
                    res.end(data.Location);
				}
				
			},
			err =>{
                console.log('An error has occured: \n' + err);
                return res.status(500).send(err);
			}
		);
		
		}); 
});

module.exports = router;