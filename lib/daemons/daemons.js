const dotenv = require('dotenv');
var mensajesDb = require("../mensajes/mensajes_db_mysql");
var partesDb = require("../partes/partes_db_mysql");


let isRunning = false
let espera = null

const daemonApi = {
    run: () => {
        if (isRunning) return;
        (async () => {
            try {
                isRunning = true;
                var cierto = false;
                //seleccionamos los partes no aceptados
                partesDb.getPartesPendientes( function(err, partes) {
                    if (err) {
                        console.log("GETPARTES (ERR): ", err);
                    } else {
                       if(partes) {
                           if(partes.length > 0) {
                                async.forEachSeries(partes, function (p, done) {
                                    //de cada parte recuperamos su mensaje correspondiente
                                    mensajesDb.getMensajeParte(p.parteId, function(err, mensaje) {
                                        if(err) {
                                            console.log("GETMENSAJE (ERR): ", err);
                                            done(err);
                                        } else {
                                            if(mensaje) {
                                                var elapsedTime = getTime(mensaje.fecha);
                                                var horas = elapsedTime/3600
                                                if(mensaje.urgente) {
                                                    if(horas > 3) {
                                                        cierto = true;
                                                    } 
                                                } else if(mensaje.presupuesto) {
                                                    if(horas > 1) {
                                                        cierto = true;
                                                    } 
                                                }
                                                //Si hay un parte que ha sobrepasado el tiempo enciamos notificación push y lo actualizamos como rechazado
                                                if(cierto) {
                                                    var datos = {
                                                        parte: {
                                                            parteId: mensaje.parteId,
                                                            confirmado: 2

                                                        }
                                                    }
                                                    partesDb.putParte(mensaje.parteId, datos, function(err, resul) {
                                                        if(err) {
                                                            console.log("PUTPARTES (ERR): ", err);
                                                            done(err);
                                                        } else {
                                                            var datos2 = {
                                                                proveedorNombre: parte.nombreproveedor,
                                                                numParte: parte.numParte,
                                                                opcion: null
                                                            }
                                                            mensajesDb.postSendMensajeWebPush( datos2, function(err, res) {
                                                                if (err) {
                                                                    console.log("SEND (ERR): ", err);
                                                                    //res.status(500).send(err.message);
                                                                } 
                                                            });
                                                        }

                                                    });
                                                }
                                                
                                            } else {
                                                isRunning = false
                                            }
                                        }

                                    });

                                    
                                }, function (err) {
                                    throw err;
                                });
                           } else {
                            isRunning = false
                           }
                       } else {
                        isRunning = false
                       }
                
                    }
                });
                isRunning = false
            } catch (err) {
                isRunning = false
                console.log("DAEMON ERROR: " + err.message)
            }
        })()
    },

   
}

function getTime (specifiedTime)   {
    specifiedTime = new Date(specifiedTime);
    var specifiedTimeSeconds = specifiedTime.getSeconds(); 
    
    var currentTime = new Date();
    var currentTimeSeconds = currentTime.getSeconds(); 
    
    return specifiedTimeSeconds-currentTimeSeconds;
}

module.exports = daemonApi;

