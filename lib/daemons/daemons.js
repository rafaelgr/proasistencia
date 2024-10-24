const dotenv = require('dotenv');
var mensajesDb = require("../mensajes/mensajes_db_mysql");
var partesDb = require("../partes/partes_db_mysql");
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require('moment');


let isRunning = false
let espera = null

const daemonApi = {
    run: () => {
        if (isRunning) return;
        (async () => {
            try {
                isRunning = true;
                //seleccionamos los partes no aceptados
            partesDb.getPartesPendientes( function(err, partes) {
                    if (err) {
                        console.log("GETPARTES (ERR): ", err);
                    } else {
                       if(partes) {
                           if(partes.length > 0) {
                                async.forEachSeries(partes, function (p, done) {
                                    var cierto = false;
                                    //de cada parte recuperamos su mensaje correspondiente
                                    var presupuesto = process.env.PRESUPUESTO
                                    var urgente = process.env.URGENTE
                                   
                                    //if(p.estado != 'RECHAZADO') {
                                        var elapsedTime = getTime(p.fecha);
                                        if(p.urgente) {
                                            if(elapsedTime > urgente) {
                                                cierto = true;
                                            } /* else {
                                                mensajesDb.sendPushRecordatorio(mensaje, function(err, res) {
                                                    if (err) {
                                                        console.log("SEND (ERR): ", err);
                                                        done(err);
                                                        //res.status(500).send(err.message);
                                                        done()
                                                    } 
                                                });
                                            } */
                                        } else  {
                                            if(elapsedTime > presupuesto) {
                                                cierto = true;
                                            }  /* else {
                                                mensajesDb.sendPushRecordatorio(mensaje, function(err, res) {
                                                    if (err) {
                                                        console.log("SEND (ERR): ", err);
                                                        done(err);
                                                        //res.status(500).send(err.message);
                                                        done()
                                                    } 
                                                });
                                            } */
                                        }
                                        //Si hay un parte que ha sobrepasado el tiempo enciamos notificación push y lo actualizamos como rechazado
                                        if(cierto) {
                                            var datos = {
                                                
                                                    parteId: p.parteId,
                                                    confirmado: 2

                                                
                                            }
                                            partesDb.putParte(p.parteId, datos, function(err, resul) {
                                                if(err) {
                                                    console.log("PUTPARTES (ERR): ", err);
                                                    done(err);
                                                } else {
                                                    var datos2 = {
                                                        parteId: p.parteId,
                                                        servicioId: p.servicioId,
                                                        proveedorId: p.proveedorId,
                                                        numParte: p.numParte,
                                                        opcion: null,
                                                        proveedorNombre: p.proveedorNombre,
                                                        direccionTrabajo: p.direccionTrabajo,
                                                        email: p.email
                                                    }
                                                    mensajesDb.postSendMensajeWebPush( datos2, function(err, res) {
                                                        if (err) {
                                                            console.log("SEND (ERR): ", err);
                                                            done(err);
                                                            //res.status(500).send(err.message);
                                                        } 
                                                        partesDb.crearCorreosAEnviar( datos2, (err, data) => {
                                                            if (err) {
                                                                console.log("SEND (ERR): ", err);
                                                                done(err);
                                                                //res.status(500).send(err.message);
                                                            } 
                                                            done()
                                                        })
                                                    });
                                                }

                                            });
                                        } else {
                                            done()
                                        }
                                        
                                   /* } else {
                                        done()
                                    } */
                                }, function (err) {
                                    if(err) {
                                        isRunning = false
                                        console.log("DAEMON ERROR: " + err.message)
                                    } else {
                                        isRunning = false
                                    }
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
   /*  var today = new Date();
    var mensFecha = specifiedTime;
    var diffMs = (mensFecha - today); // milliseconds between now & mensFecha
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes */
    //alert(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)")

    var now = moment(new Date()); //todays date
    var end = moment(specifiedTime); // another date
    var duration = moment.duration(now.diff(end));
    var minutes = duration.asMinutes();
    
    return minutes;
}

module.exports = daemonApi;

