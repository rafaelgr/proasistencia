var express = require("express");
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var parametrosDb = require("../parametros/parametros_db_mysql");
var facturasProveedoresDb = require("../facturas_proveedores/facturasProveedores_db_mysql")
var AWS = require('aws-sdk');
var facturasproveedoresdB = require('../facturas_proveedores/facturasProveedores_db_mysql');
var documentosPagoDb = require('../documentos_pago/documentos_pago_db_mysql');
var facturasdB = require('../facturas/facturas_db_mysql');
var name = "";
var contador = 0;
var facturaProveedor = {};
var mysql2 = require('mysql2/promise');

const obtenerConfiguracion = function () {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}

router.post('/', function (req, res) {
    var filename = "";
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
        });
    });

    // log any errors that occur
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
        return res.status(500).send(err);

    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
        res.end(filename);
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    });
});

router.post('/s3/:name/:facproveId', function (req, res) {
    var filename = "";
    name = req.params.name;

    if (process.env.PRODUCCION == 'true') { //si es el servidor de producción mantenemos el nombre
        name = req.params.name;
    } else {
        name = req.params.name;
        name = process.env.API_PORT + "_" + name
    }
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
            parametrosDb.getParametros(function (err, parametros) {

                if (err) return res.status(500).send(err);
                var p = parametros[0];
                //AWS
                AWS.config.region = p.bucket_region_server;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: p.identity_pool_server,
                });
                var fileKey = "facturas_proveedores/" + name;
                const fileContent = fs.createReadStream(form.uploadDir + "\\" + file.name);
                //const data = fs.readFileSync(rutaDelArchivo, 'utf8');
                var params = {
                    Bucket: p.bucket_server,
                    Key: fileKey,
                    IdentityPoolId: p.identity_pool_server,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: 'application/pdf'
                }
                // Use S3 ManagedUpload class as it supports multipart uploads
                var upload = new AWS.S3.ManagedUpload({
                    params: params
                });
                var promise = upload.promise();
                promise
                    .then(
                        data => {
                            if (data) {
                                console.log('upload complete!');
                                try {
                                    fs.unlinkSync(form.uploadDir + "\\" + file.name)
                                    console.log('File removed');
                                    var facprove = {
                                        nombreFacprovePdf: name,
                                        facproveId: id
                                    }
                                    facturasproveedoresdB.putFacturaAntproveToNull(facprove, function (err, result) {
                                        if (err) throw err;
                                        if (result) res.end(name);
                                    });
                                } catch (err) {
                                    console.error('Something wrong happened removing the file', err);
                                    return res.status(500).send(err);
                                }

                            }

                        },
                        err => {
                            console.log('An error has occured: \n' + err);
                            try {
                                fs.unlinkSync(form.uploadDir + "\\" + file.name)
                                console.log('File removed');
                            } catch (err) {
                                console.error('Something wrong happened removing the file', err);
                                return res.status(500).send(err);
                            }
                        }
                    );

            });
        });
    });

    // log any errors that occur
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
        try {
            fs.unlinkSync(form.uploadDir + "\\" + file.name)
            console.log('File removed');
        } catch (err) {
            console.error('Something wrong happened removing the file', err);
            return res.status(500).send(err);
        }

    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
        //res.end(filename);
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    });
});



router.post('/docpago/:documentoPagoId', function (req, res) {
    var filename = "";
    var f = null;
    var id = req.params.documentoPagoId;
    var n = req.params.nombre;
    var fe = req.params.fecha
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
    form.on('end', () => {
        //
        parametrosDb.getParametros(function (err, parametros) {
            if (err) return res.status(500).send(err);
            var p = parametros[0];
            //AWS
            AWS.config.region = p.bucket_region_server;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: p.identity_pool_server,
            });
            var fileKey = "docpago/" + f.name;
            var src = process.env.DOC_PAGO_DIR + "\\" + f.name
            const fileContent = fs.readFileSync(src);
            var params = {
                Bucket: p.bucket_server,
                Key: fileKey,
                IdentityPoolId: p.identity_pool_server,
                Body: fileContent,
                ACL: "public-read",
                ContentType: 'application/pdf'
            }
            // Use S3 ManagedUpload class as it supports multipart uploads
            var upload = new AWS.S3.ManagedUpload({
                params: params
            });
            var promise = upload.promise();
            promise
                .then(
                    data => {
                        if (data) {
                            var documentoPago = {
                                documentoPagoId: id,
                                pdf: f.name,
                            }
                            try {
                                documentosPagoDb.putDocumentoPago(id, documentoPago)
                                    .then(result => {
                                        if (err) return res.status(500).send(err);
                                        fs.unlinkSync(src)
                                        console.log('File removed');
                                        res.end(filename);
                                    })
                                    .catch(err => { return res.status(500).send(err); });


                            } catch (err) {
                                console.error('Something wrong happened removing the file', err);
                                return res.status(500).send(err);
                            }

                        }

                    },
                    err => {
                        console.log('An error has occured: \n' + err);
                        return res.status(500).send(err);
                    }
                );

        });
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    });
});

router.post('/docum/s3', function (req, res) {
    var file = req.body
    var blob = file.slice(0, file.size, file.type);
    var newFile = new File([blob], { type: file.type });

    var filename = "";

    filename = f.name;

    parametrosDb.getParametros(function (err, parametros) {

        if (err) return res.status(500).send(err);
        var p = parametros[0];
        //AWS
        AWS.config.region = p.bucket_region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: p.identity_pool,
        });
        var fileKey = f.name;
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
            .then(
                data => {
                    if (data) {
                        var re = /https/gi;
                        var str = data.Location;
                        data.Location = str.replace(re, "http");

                        res.end(data.Location);
                    }

                },
                err => {
                    console.log('An error has occured: \n' + err);
                    return res.status(500).send(err);
                }
            );

    });
});



router.post('/s3/externo/', function (req, res) {
    // Variables
    let jsonData;
    let name = null;
    let id = null;
    var facturaProveedor = null;


    

    // Crear un objeto IncomingForm de formidable
    const form = new formidable.IncomingForm();

    // Especificar que permitimos múltiples archivos en una sola solicitud
    form.multiples = true;

    // Almacenar todas las cargas en el directorio de uploads
    form.uploadDir = path.join(process.env.UPLOAD_DIR);

    // Procesamos los archivos y el JSON dentro de form.parse
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error al procesar el formulario:', err);
            return res.status(500).send('Error al procesar los datos');
        }

        // Verificar si se ha recibido el campo JSON
        if (!fields.json) {
            return res.status(400).send('JSON no encontrado en la solicitud');
        }

        // Intentar parsear el JSON
        try {
            jsonData = JSON.parse(fields["json"]);
            console.log('Datos JSON parseados:', jsonData);

            facturaProveedor = await facturasProveedoresDb.postFacturaExterna(jsonData, null);
            id = facturaProveedor.facproveId;
            if (process.env.PRODUCCION == 'true') {
                // Si es producción, mantenemos el nombre
                name = facturaProveedor.ref + ".pdf";
            } else {
                // Si no es producción, agregamos el puerto al nombre
                name = process.env.API_PORT + "_" + facturaProveedor.ref + ".pdf"
            }
        } catch (e) {
            console.error('Error al parsear el JSON:', e);
            return res.status(400).send(e);
            contador = 0;
        }

        const file = files["uploads[]"];  // Usa "uploads[]" ya que ese es el nombre del campo
        
        // Aquí solo procesamos el primer archivo, puedes ajustar según tus necesidades
        if (files && file) {
            // Renombrar el archivo y moverlo a la ubicación de destino
            fs.rename(file.path, path.join(form.uploadDir, name), (err) => {
                if (err) {
                    console.error('Error al renombrar el archivo:', err);
                    return res.status(500).send('Error al procesar el archivo');
                }

                // Configuración para subir el archivo a S3
                parametrosDb.getParametros(function (err, parametros) {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    var p = parametros[0];

                    // AWS S3 Configuración
                    AWS.config.region = p.bucket_region_server;
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: p.identity_pool_server,
                    });

                    const fileKey = "facturas_proveedores/" + name;
                    const fileContent = fs.createReadStream(path.join(form.uploadDir, name));

                    // Parámetros para S3
                    const params = {
                        Bucket: p.bucket_server,
                        Key: fileKey,
                        Body: fileContent,
                        ACL: "public-read",
                        ContentType: 'application/pdf'
                    };
                   
                    // Subir archivo a S3
                    const upload = new AWS.S3.ManagedUpload({ params });
                    const promise = upload.promise();

                    promise
                        .then(data => {
                            if (data) {
                                console.log('Subida completa a S3');
                                // Eliminar archivo temporal después de la subida
                                fs.unlinkSync(path.join(form.uploadDir, name));

                                // Llamar a la base de datos para actualizar la factura
                                const facprove = {
                                    nombreFacprovePdf: name,
                                    facproveId: id
                                };

                                facturasproveedoresdB.putFacturaAntproveToNull(facprove, function (err, result) {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }

                                    // Enviar el nombre del archivo como respuesta
                                    res.json(facprove);
                                    //res.end(facprove);
                                });
                            }
                        })
                        .catch(err => {
                            console.log('Error al subir el archivo:', err);
                            fs.unlinkSync(path.join(form.uploadDir, file.name));
                            return res.status(500).send(err);
                        });
                });
            });
        } else {
            return res.status(400).send('No se ha recibido ningún archivo.');
        }
    });
});

router.post('/s3/externo/transaccion/asincrono', function (req, res) {
    // Variables
    let jsonData;
    let name = null;
    let id = null;
    let facturaProveedor = null;
    let cabecera = null;
    let lineas = null;
    let serviciadas = null;
    let conn = undefined


    // Crear un objeto IncomingForm de formidable
    const form = new formidable.IncomingForm();

    // Especificar que permitimos múltiples archivos en una sola solicitud
    form.multiples = true;

    // Almacenar todas las cargas en el directorio de uploads
    form.uploadDir = path.join(process.env.UPLOAD_DIR);

    // Procesamos los archivos y el JSON dentro de form.parse
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error al procesar el formulario:', err);
            return res.status(500).send(err.message);
        }

        // Verificar si se ha recibido el campo JSON
        if (!fields.cabecera) {
            console.log('JSON no encontrado en la solicitud')
            return res.status(400).send('JSON no encontrado en la solicitud');
        }

        // Intentar parsear el JSON
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            await conn.beginTransaction();
            cabecera = JSON.parse(fields["cabecera"]);
            console.log('Datos JSON parseados:', cabecera);

            let result = await facturasProveedoresDb.postFacturaExterna(cabecera, conn);
            if (result.message) {
                throw new Error(result.message);
            };

            id = result.facproveId;
            lineas = JSON.parse(fields["lineas"]);
            for (let i = 0; i < lineas.lineas.length; i++) {
                lineas.lineas[i].facproveId = id;
            };

            let result2 = await facturasProveedoresDb.postFacturaLineaNuevoExterno(lineas.lineas, conn);

             if (result2.message) {
                throw new Error(result2.message);
            };
            serviciadas = JSON.parse(fields["serviciadas"]);
            for (let i = 0; i < serviciadas.serviciadas.length; i++) {
                serviciadas.serviciadas[i].facproveId = id;
            };

            let result3 = await facturasProveedoresDb.postServiciadaExterna(serviciadas.serviciadas, conn);

            if (result3.message) {
                throw new Error(result3.message);
            };

            if (process.env.PRODUCCION == 'true') {
                // Si es producción, mantenemos el nombre
                name = result.ref + ".pdf";
            } else {
                // Si no es producción, agregamos el puerto al nombre
                name = process.env.API_PORT + "_" + result.ref + ".pdf"
            }
        } catch (e) {
            if (conn) {
                await conn.rollback();
                await conn.end();

            }
            console.error('Error al parsear el JSON:', e);
            return res.status(400).send(e.message);
        }

        const file = files["uploads[]"];  // Usa "uploads[]" ya que ese es el nombre del campo

        // Aquí solo procesamos el primer archivo, puedes ajustar según tus necesidades
        if (files && file) {
            try {
                // Renombrar archivo local (temporal -> definitivo)
                const filePath = path.join(form.uploadDir, name);
                await fs.promises.rename(file.path, filePath);

                // Obtener parámetros AWS
                const parametros = await new Promise((resolve, reject) => {
                    parametrosDb.getParametros((err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });

                const p = parametros[0];

                // Configuración AWS
                AWS.config.update({
                    region: p.bucket_region_server,
                    credentials: new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: p.identity_pool_server,
                    }),
                });

                const fileKey = "facturas_proveedores/" + name;
                const fileContent = fs.createReadStream(filePath);

                // Subir archivo a S3
                const params = {
                    Bucket: p.bucket_server,
                    Key: fileKey,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: "application/pdf",
                };

                const upload = new AWS.S3.ManagedUpload({ params });
                await upload.promise();
                console.log("✅ Subida completa a S3");

                // Eliminar archivo local tras la subida exitosa
                fs.unlinkSync(filePath);

                // Actualizar en DB
                const facprove = {
                    nombreFacprovePdf: name,
                    facproveId: id,
                };


                let result4 = await facturasproveedoresdB.putFacprove(facprove, conn);

                if (result4.message) {
                    throw new Error(result4.message);
                };


                // 👉 Solo aquí confirmamos la transacción
                await conn.commit();
                await conn.end();

                return res.json(facprove);

            } catch (e) {
                // 🔴 Algo falló en el proceso → rollback
                if (conn) {
                    await conn.rollback();
                    await conn.end();
                }

                // Si el archivo ya fue renombrado pero no subido, lo eliminamos
                const tempFilePath = path.join(form.uploadDir, name);
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }

                console.error("Error en proceso:", e);
                return res.status(500).send("Error al guardar el PDF, el proceso se ha detenido.");
            }
        } else {
            return res.status(400).send("No se ha recibido ningún archivo.");
        }

    });
});

router.post('/s3/factura/:name/:facturaId', function (req, res) {
    var filename = "";
    name = req.params.name;

    if (process.env.PRODUCCION == 'true') { //si es el servidor de producción mantenemos el nombre
        name = req.params.name;
    } else {
        name = req.params.name;
        name = process.env.API_PORT + "_" + name
    }
    var id = req.params.facturaId;
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
            parametrosDb.getParametros(function (err, parametros) {

                if (err) return res.status(500).send(err);
                var p = parametros[0];
                //AWS
                AWS.config.region = p.bucket_region_server;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: p.identity_pool_server,
                });
                var fileKey = "facturas/" + name;
                const fileContent = fs.createReadStream(form.uploadDir + "\\" + file.name);
                //const data = fs.readFileSync(rutaDelArchivo, 'utf8');
                var params = {
                    Bucket: p.bucket_server,
                    Key: fileKey,
                    IdentityPoolId: p.identity_pool_server,
                    Body: fileContent,
                    ACL: "public-read",
                    ContentType: 'application/pdf'
                }
                // Use S3 ManagedUpload class as it supports multipart uploads
                var upload = new AWS.S3.ManagedUpload({
                    params: params
                });
                var promise = upload.promise();
                promise
                    .then(
                        data => {
                            if (data) {
                                console.log('upload complete!');
                                try {
                                    fs.unlinkSync(form.uploadDir + "\\" + file.name)
                                    console.log('File removed');
                                    var factura = {
                                        nombreFacturaPdf: name,
                                        facturaId: id
                                    }

                                    facturasdB.putFactura2(factura, function (err, result) {
                                        if (err) throw err;
                                        if (result) res.end(name);
                                    });
                                } catch (err) {
                                    console.error('Something wrong happened removing the file', err);
                                    return res.status(500).send(err);
                                }

                            }

                        },
                        err => {
                            console.log('An error has occured: \n' + err);
                            try {
                                fs.unlinkSync(form.uploadDir + "\\" + file.name)
                                console.log('File removed');
                            } catch (err) {
                                console.error('Something wrong happened removing the file', err);
                                return res.status(500).send(err);
                            }
                        }
                    );

            });
        });
    });

    // log any errors that occur
    form.on('error', (err) => {
        console.log('An error has occured: \n' + err);
        try {
            fs.unlinkSync(form.uploadDir + "\\" + file.name)
            console.log('File removed');
        } catch (err) {
            console.error('Something wrong happened removing the file', err);
            return res.status(500).send(err);
        }

    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
        //res.end(filename);
    });

    // parse the incoming request containing the form data
    form.parse(req, (err, field, file) => {
        console.log('hecho');
    });
});

module.exports = router;