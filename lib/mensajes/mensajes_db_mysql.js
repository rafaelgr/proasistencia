// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var partesDb = require('../partes/partes_db_mysql');

//  leer la configurción de MySQL

var sql = "";

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
		host: process.env.BASE_MYSQL_HOST,
		user: process.env.BASE_MYSQL_USER,
		password: process.env.BASE_MYSQL_PASSWORD,
		database: process.env.BASE_MYSQL_DATABASE,
		port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
	connection.end(function (err) {
		if (err) {
			throw err;
		}
	});
}

function closeConnectionCallback(connection, callback) {
	connection.end(function (err) {
		if (err) callback(err);
	});
}

// getMensajes
module.exports.getMensajes = function (callback) {
	var connection = getConnection();
	var mensajes = null;
    var sql = "SELECT m.*, ad.nombre AS responsable, p.numParte, p.confirmado,";
    sql += " po.nombre as proveedorNombre, pu.nombre AS pushNombre";
    sql += " FROM mensajes AS m";
    sql += " LEFT JOIN usuarios AS ad ON ad.usuarioId = m.usuarioId";
    sql += " LEFT JOIN partes AS p ON p.parteId = m.parteId";
    sql += " LEFT JOIN proveedores as  po ON po.proveedorId = m.proveedorId";
    sql += " LEFT JOIN proveedor_usuariospush as pu ON pu.proveedorUsuarioPushId = m.proveedorUsuarioPushId";
    sql += " ORDER BY m.fecha DESC";
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
        }
		
        mensajes = result;
		callback(null, mensajes);
	});
}



// getMensajesUsuario
// lee los mensajes relacionados con un determinado usuario
module.exports.getMensajesUsuario = function(proveedorId, callback) {
    var connection = getConnection();
    var mensajes = null;
    sql = "SELECT m.mensajeId, m.asunto, m.texto, m.fecha, m.presupuesto, m.urgente, m.estado, m.fecha as fechalec";
    sql += " FROM mensajes AS m";
    sql += " WHERE m.proveedorId = ?";
    sql += " AND m.estado <> 'PENDIENTE'";
    sql += " ORDER by m.fecha DESC";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });
    
}

// getMensajesUsuario
// lee los mensajes relacionados con un determinado usuario
module.exports.getMensajesUsuarioPush = function(proveedorId,  proveedorUsuarioPushId, callback) {
    var connection = getConnection();
    var mensajes = null;
    sql = "SELECT m.mensajeId, m.asunto, m.texto, m.fecha, m.presupuesto, m.urgente, m.estado, m.fecha as fechalec";
    sql += " FROM mensajes AS m";
    sql += " WHERE m.proveedorId = ? AND m.proveedorUsuarioPushId = ?";
    sql += " AND m.estado <> 'PENDIENTE'";
    sql += " ORDER by m.fecha DESC";
    sql = mysql.format(sql, [proveedorId, proveedorUsuarioPushId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });
    
}

// getMensajesUsuario
// lee los mensajes relacionados con un determinado usuario
module.exports.getMensajeProveedorParte = function(parteId, proveedorId, callback) {
    var connection = getConnection();
    var mensajes = null;
    sql = "SELECT m.mensajeId, m.asunto, m.texto, m.fecha, m.presupuesto, m.urgente, m.estado, m.fecha as fechalec";
    sql += " FROM mensajes AS m";
    sql += " WHERE m.proveedorId = ?";
    sql += " AND m.parteId = ?";
    sql += " ORDER by m.fecha DESC";
    sql = mysql.format(sql, [proveedorId, parteId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });
}

// getMensaje
module.exports.getMensaje = function (mensajeId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT m.*, ad.nombre AS responsable, p.confirmado FROM mensajes AS m";
    sql += " LEFT JOIN usuarios AS ad ON ad.usuarioId = m.usuarioId";
    sql += " LEFT JOIN partes AS p ON p.parteId = m.parteId";
    sql += " WHERE m.mensajeId = ?";
    sql += " GROUP BY m.mensajeId"
    sql = mysql.format(sql, mensajeId);
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		mensaje = result;
		callback(null, mensaje[0]);
	});
}

// getMensaje
module.exports.getMensajeParte = function (parteId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT m.*, ad.nombre AS responsable FROM mensajes AS m";
    sql += " LEFT JOIN usuarios AS ad ON ad.usuarioId = m.usuarioId";
    sql += " WHERE m.parteId = ?";
    sql = mysql.format(sql, parteId);
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		mensaje = result;
		callback(null, mensaje[0]);
	});
}

// getMensajeLineaProveedor
module.exports.getMensajeLineaProveedor = function (mensajeId, proveedorId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT * FROM mensajes_proveedorespush AS m";
    sql += " WHERE mensajeId = ? AND proveedorId = ?";
    sql = mysql.format(sql, [mensajeId, proveedorId]);
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		mensaje = result;
		callback(null, mensaje[0]);
	});
}

// getMensaje
module.exports.getProveedoresAsociados = function (mensajeId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT m.*, p.nombre AS proveedorNombre, m.proveedorId, m.proveedorUsuarioPushId,";
    sql += " pa.urgente, pa.presupuesto"
    sql += " FROM mensajes AS m";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = m.proveedorId";
    sql += " LEFT JOIN partes AS pa ON pa.parteId = m.parteId";
    sql += " WHERE m.mensajeId = ?";
    sql = mysql.format(sql, mensajeId);
	connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, result[0]);
	});
}





// postMensaje
// crear en la base de datos el mensaje pasado
module.exports.postMensaje = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIds(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        if (playList.length == 0){
            var err = new Error('No se ha escogido ningún destinatario');
            return callback(err);
        }
        fnStoreMensaje(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, res);
        })
    });
}

// da de alta y envía en mensaje
module.exports.postSendMensaje = function(mensaje, callback) {
    var num = 0;
    var mens;
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIds(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        // (2) crea un mensaje
        fnStoreMensaje(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            var mensajes = res;
            // (3) recupemaos los parámetros de envío del mensaje
            getParametro(function(err, res) {
                if (err) {
                    return callback(err);
                }
                var parametros = res;
                // (4) envíamos el mensaje
                fnSendMessage(mensajes, parametros, playList, function(err, mensajes) {
                    if (err)  {
                        return callback(err);
                    } else {
                        fnPutMensaje(mensajes, function(err, res) {
                            if (err) {
                                return callback(err);
                            }
                            if(mensajes.length > 0) {
                                async.eachSeries( mensajes, function(mensaje, done) {
                                    var datos = 
                                    {
                                        parteId: mensaje.parteId,
                                        confirmado: 0
                                    }
                                    if(!mensaje.err) {
                                        partesDb.putParte(mensaje.parteId, datos, function(err, result) {
                                            if(err) return callback(err);
                                            done()
                                        });
                                    } else {
                                        done()
                                    }
                                    
                                }, function (err) {
                                    if (err) return callback(err);
                                    mensajes.forEach(e => {
                                        if(e.err) {
                                            num = num +1;
                                        }
                                        if(num > 0) {
                                            var substr = " NOTIFICACION"
                                            if(num > 1) substr = " NOTIFICACIONES";
                                            mens ="[ HA FALLADO EL ENVÍO DE " + num + substr + ", SE PUEDE REENVIAR DESDE LA LISTA DE MENSAJES";
                                        }
                                    });
                                    if(num > 0) {
                                        var err2 = new Error("[MENSAJE NO ENVIADO] " + mens);
                                        return callback(err2);
                                    }
                                    callback(null, mensajes);
                                });
                            } else {
                                return callback(null, mensajes);
                            }
                        });
                    }
                        
                });
            });
        });
    });
}


module.exports.postSendMensajeWebPush = function(datos, callback) {
    getParametro(function(err, res) {
        if (err) {
            return callback(err);
        }
        var parametros = res; 
        fnSendMessageWebPush(parametros, datos, function(err, res) {
            if (!err) {
                return callback(null, res);
            } else {
                var err2 = new Error("[MENSAJE DE CONFIRMACION NO ENVIADO] ");
                return callback(err2);
            }
        });
    });
}



module.exports.putMensaje = function(id, mensaje, callback) {
    if (id != mensaje.mensajeId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var mensaje2 = {
        mensajeId: mensaje.mensajeId,
        asunto: mensaje.asunto,
        texto: mensaje.texto,
        estado: 'PENDIENTE',
        fecha: new Date(),
        usuarioId: mensaje.usuarioId,
        parteId: mensaje.parteId,
        proveedorId: mensaje.proveedorId,
        playerId: mensaje.playerId,
        proveedorUsuarioPushId: mensaje.proveedorUsuarioPushId,
    }
    var connection = getConnection();
    var sql = "UPDATE mensajes SET ? WHERE mensajeId = ?";
    sql = mysql.format(sql, [mensaje2, mensaje.mensajeId]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, mensaje2);
    });
};

module.exports.putMensajePropiedad = function(id, mensaje, callback) {
    var connection = getConnection();
    sql = "UPDATE mensajes SET ? WHERE parteId = ?";
    sql = mysql.format(sql, [mensaje, id]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

module.exports.putMensajeProveedorLinea = function(mensajeId, proveedorId, mensaje, callback) {
    var connection = getConnection();
    sql = "UPDATE mensajes_proveedorespush SET ? WHERE mensajeId = ? AND proveedorId = ?";
    sql = mysql.format(sql, [mensaje, mensajeId, proveedorId]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, mensaje);
    });
};

module.exports.putMensajeProveedorPush = function(mensajeId, proveedorId, mensaje, callback) {
    var connection = getConnection();
    sql = "UPDATE mensajes SET ? WHERE mensajeId = ? AND proveedorId = ?";
    sql = mysql.format(sql, [mensaje, mensajeId, proveedorId]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, mensaje);
    });
};

// deleteMensaje
// Elimina el mensaje con el id pasado
module.exports.deleteMensaje = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from mensajes_proveedorespush WHERE mensajeId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        connection = getConnection();
        sql = "DELETE from mensajes WHERE mensajeId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function(err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
};

var fnPutMensaje = function(mensajes, callback) {
    async.eachSeries( mensajes, function(mensaje, done) {
        var connection = getConnection();
        if(!mensaje.err) {
            sql = "UPDATE mensajes SET ? WHERE mensajeId = ?";
            sql = mysql.format(sql, [mensaje, mensaje.mensajeId]);
            connection.query(sql, function(err, result) {
                connection.end();
                if (err) {
                    return callback(err);
                }
            done();
        });
        } else {
            connection.end();
            done();
        }
        

    }, function (err) {
        if (err) return callback(err);
        callback(null, mensajes);
    });
};


var fnStoreMensaje = function(mensaje, playList, callback) {
    if(!mensaje.presupuesto)  mensaje.presupuesto = 0;
    if(!mensaje.urgente)  mensaje.urgente = 0;
    var mensajes = [];
   
    async.eachSeries(playList, function (p, done) {
        var mensaje2 = {
            mensajeId: 0,
            asunto: mensaje.asunto,
            texto: mensaje.texto,
            estado: 'PENDIENTE',
            usuarioId: mensaje.usuarioId,
            presupuesto: mensaje.presupuesto,
            urgente: mensaje.urgente,
            parteId: mensaje.parteId,
            proveedorId: p.proveedorId,
            proveedorUsuarioPushId: p.proveedorUsuarioPushId,
            playerId: p.playerId,
            fecha: new Date()
        }
        var connection = getConnection();
        sql = "INSERT INTO mensajes SET ?";
        sql = mysql.format(sql, mensaje2);
        connection.query(sql, function(err, result) {
            connection.end();
            if (err)  return callback(err);
            mensaje2.mensajeId = result.insertId
            mensaje2.playerId = p.playerId;
            mensajes.push(mensaje2);
            done();
        });

    }, function (err) {
        if (err) return callback(err);
        callback(null, mensajes);
    });
    
}



var fnStoreMensajeUsuarios = function(mensaje, playList, callback) {
    // write records for all users implied when a message is sent
    var records = [];
    var record = [];
    for (var i = 0; i < playList.length; i++) {
        record = [];
        record.push(mensaje.mensajeId);
        record.push(playList[i].proveedorId);
        record.push('ENVIADO');
        record.push(mensaje.fecha);
        records.push(record);
    }
    var conn = getConnection();
    sql = "INSERT INTO mensajes_proveedorespush (mensajeId, proveedorId, estado, fecha) VALUES  ?";
    sql = mysql.format(sql, [records]);
    conn.query(sql, function(err, result) {
        conn.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


/* var fnStoreMensajeUsuarios2 = function(mensaje, playList, callback) {
    // write records for all users implied when a message is sent
    var records = [];
    var record = [];
    for (var i = 0; i < playList.length; i++) {
        record = [];
        record.push(mensaje.mensajeId);
        record.push(playList[i].proveedorId);
        record.push('PENDIENTE');
        record.push(mensaje.fecha);
        records.push(record);
    }
    var conn = getConnection();
    sql = "INSERT INTO mensajes_proveedorespush (mensajeId, proveedorId, estado, fecha) VALUES  ?";
    sql = mysql.format(sql, [records]);
    conn.query(sql, function(err, result) {
        conn.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
 */
/* var fnPutMensaje = function(id, mensaje, callback) {
    if (!comprobarMensaje(mensaje)) {
        var err = new Error("El mensaje pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    if (id != mensaje.mensajeId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = "UPDATE mensajes SET ? WHERE mensajeId = ?";
    sql = mysql.format(sql, [mensaje, mensaje.mensajeId]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, mensaje);
    });
};
 */




//ENVÍO DE MENSAJES

//envio de mensajes ya creados
module.exports.sendPush = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios de un mensaje ya creado
    var m = [];
        getParametro(function(err, res) {
            if (err) {
                return callback(err);
            }
            var parametros = res;
            m.push(mensaje);
            // (3) envíamos el mensaje
            fnSendMessage(m, parametros, null, function(err, res) {
                if (err) {
					return callback(err);
                }
                //(4) actualizamos el mensaje
                if(!res[0].err) {
                    fnPutMensajeNew(mensaje.mensajeId, mensaje.usuarioId,function(err, res) {
                        if (err) {
                            return callback(err);
                        }
                        if(mensaje.parteId) {
                            var datos = 
                            {
                                parteId: mensaje.parteId,
                                confirmado: 0
                            }
                            // (5) actualizamos el parte asociado
                            partesDb.putParte(mensaje.parteId, datos, function(err, result) {
                                if(err) return callback(err);
                                return callback(null, 'OK');
                            });
                        } else {
                            return callback(null, 'OK');
                        }
                    });
                } else {   
                    var mens ="[ HA FALLADO EL ENVÍO DE LA NOTIFICACION.]";
                    var err2 = new Error("[MENSAJE NO ENVIADO] " + mens);
                    return callback(err2);
                }
            });
        });
}

module.exports.sendPushRecordatorio = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIdsFromMensaje(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        getParametro(function(err, res) {
            if (err) {
                return callback(err);
            }
            var parametros = res;
            fnSendMessage(mensaje, parametros, playList, function(err, res) {
                if (err) {
					return callback(err);
                }
                fnPutMensajeNew(mensaje.mensajeId, mensaje.usuarioId,function(err, res) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, 'OK');
                });
            });
        });

    })
}


module.exports.sendMessageWebPushNew = async(datos) => {
    let con = null;
    var params;
    return new Promise(async (resolve, reject) => {
		try {
            var included_segments = ['Web Users'];
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT * FROM parametros";
            let [parametros] = await con.query(sql);
            con.end();
            if(parametros.length > 0) {
                params = parametros[0];
                var data = {
                    app_id: params.appId,
                    included_segments: included_segments,
                    headings: {
                        en: datos.asunto
                    },
                    contents: {
                        en: datos.cuerpo
                    },
                    data: {
                        mensajeId: datos.id,
                    },
                    url: datos.url
                    //web_buttons: [{"id": "like-button", "text": "Ir al servicio", "icon": "http://i.imgur.com/N8SN8ZS.png", "url": "http://15.236.161.23:9001/#!/top/serviciosForm?servicioId=2724"}]

                };
                var request = require('request');
            
                var options = {
                    url: 'https://onesignal.com/api/v1/notifications',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' +  params.restApi,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
            
                request(options, function(error, response, body) {
                    var res = null;
                    if (body) {
                        res = JSON.parse(body);
                        console.log("RES ONESIGNAL: ", res);
                    }
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject (err);
                    }
                });
            } else {
                throw new Error("Los parametros del envío de mensajes no están configurados, consulte con administración");
            }
        }catch(err) {
            if(con) {
				if (!con.connection._closing) {
					await con.end();
				} 
			}
			reject (err);
        }
    });
};


var fnObtainPlayersIdsFromMensaje = function(mensaje, callback) {
    var playList = [];
    var sql = "";
    var conn = getConnection();
    var p = mensaje.proveedores;
    // if there's an USER, we send to that USER no matter 
    // what global sending parameters we have.
    sql = "SELECT DISTINCT m.proveedorId, m.proveedorUsuarioPushId, u.playerId";
    sql += " FROM mensajes AS m";
    sql += " WHERE m.mensajeId = ? AND m.proveedorId = ? AND m.proveedorUsuarioPushId = ?";
    sql = mysql.format(sql, [mensaje.mensajeId,  mensaje.proveedorId, mensaje.proveedorUsuarioPushId]);
    conn.query(sql, function(err, result) {
        closeConnectionCallback(conn, callback);
        if (err) {
            return callback(err, null);
        }
        mensaje.playerId = result[0].playerId;
        return callback(null, mensaje);
    });
}

// getParametro
// busca  el parametro con id pasado
var	getParametro = function(callback){
	var connection = getConnection();
	sql = "SELECT * FROM parametros";
	connection.query(sql, function(err, result){
        closeConnectionCallback(connection, callback);
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
		}
		callback(null, result[0]);
	});
}

var fnSendMessage = function(mensajes, parametros, playList, callback) {
    // obtain list of playersIds
    async.eachSeries(mensajes, function (mensaje, done) {
    var player = [];
    var contenido = "[" + parametros.tituloPush + "] " + mensaje.asunto;
    player.push(mensaje.playerId)
    var data = {
        app_id: parametros.appId,
        include_player_ids: player,
        headings: {
            en: parametros.tituloPush
        },
        data: {
            mensajeId: mensaje.mensajeId,
            parteId: mensaje.parteId,
            proveedorUsuarioPushId: mensaje.proveedorUsuarioPushId
        },
        contents: {
            en: contenido
        }
    };
    try {
        var request = require('request');
    } catch(e) {
        console.log(e);
    }
    

    var options = {
        url: 'https://onesignal.com/api/v1/notifications',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + parametros.restApi,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    request(options, function(error, response, body) {
        var res = null;
        var substr = " NOTIFICACIÓN";
        var err2 = '';

        res = JSON.parse(body);
        if (body) {
            if(res.errors) {
                mensaje.estado = "PENDIENTE";
                mensaje.err = 1;
                return done();
            }else {
                console.log("RES ONESIGNAL: ", res);
                mensaje.pushId = res.id;
                mensaje.estado = 'ENVIADO'
                return done()
            }
            
        }
        if (!error && response.statusCode == 200) {
            mensaje.estado = "ENVIADO";
            mensaje.pushId = res.id;
            return done();
        } else {
            mensaje.err = 1;
            return done();
        }
    });

    }, function (err) {
        if (err) return callback(err);
        callback(null, mensajes);
    });
};


var fnSendMessageWebPush = function(parametros, datos, callback) {
    // obtain list of playersIds
    var included_segments = ['Web Users'];
    var opcion = "  ha aceptado la solicitud del servicio numero "
    if(datos.opcion == false) opcion = " ha rechazado la solicitud del servicio numero "
    if(datos.opcion == null) opcion = " no ha aceptado dentro del tiempo requerido la solicitud del servicio numero "
    var contenido = "El proveedor " + datos.proveedorNombre + opcion +  datos.numParte;
    if(datos.opcion == 'CERRADO') {
        opcion = ' ha cerrado el parte numero '
        contenido = "El proveedor " + datos.proveedorNombre + opcion + datos.numParte;
    } 
    var data = {
        app_id: parametros.appId,
        included_segments: included_segments,
        headings: {
            en: parametros.tituloPush
        },
        data: {
            mensajeId: null,
        },
        contents: {
            en: contenido
        },
        url: process.env.REP_CLIEN + "#!/top/serviciosForm?servicioId=" + datos.servicioId + "&parteId=" + datos.parteId
    };
    var request = require('request');

    var options = {
        url: 'https://onesignal.com/api/v1/notifications',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' +  parametros.restApi,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    request(options, function(error, response, body) {
        var res = null;
        if (body) {
            res = JSON.parse(body);
            console.log("RES ONESIGNAL: ", res);
        }
        if (!error && response.statusCode == 200) {
            return callback(null, body);
        } else {
            return callback(error);
        }
    });
};


var fnPutMensajeNew = function(id, usuarioId, callback) {
    var connection = getConnection();
    var fecha = new Date();
    sql = "UPDATE mensajes AS m";
    sql += " SET m.estado = 'ENVIADO', m.usuarioId = ?, m.fecha = ? ";
    sql += " WHERE m.mensajeId = ?;"
    sql = mysql.format(sql, [usuarioId, fecha, id]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, null);
    });
};


// Returns an array with userPushIds and playersIds
// dependig on parameters

var fnObtainPlayersIds = function(mensaje, callback) {
    var playList = [];
    Arr = false;
    var sql = "";
    var conn = getConnection();

    if ((!mensaje.proveedorId)) {
        if(!mensaje.proveedores) {
            return callback(null, playList);
        } else {
            arr = true
        }
    } else {
        arr = false;
    }

        sql += " SELECT pu.proveedorId, pu.playerId, pu.proveedorUsuarioPushId";
        sql += " FROM proveedores AS u ";
        sql += " LEFT JOIN proveedor_usuariospush as pu on pu.proveedorId = u.proveedorId";
        if(arr) {
            sql += " WHERE u.proveedorId IN (?) ";
            sql = mysql.format(sql, [mensaje.proveedores]);

        }else {
            sql += " WHERE u.proveedorId = ? ";
            sql = mysql.format(sql, [mensaje.proveedorId]);
        }
        if(mensaje.proveedorUsuarioPushId) {
            sql += " AND pu.proveedorUsuarioPushId = ?";
            sql = mysql.format(sql, [mensaje.proveedorUsuarioPushId]);
        }
        sql += " AND NOT pu.playerId IS NULL";
        sql = sql.replace(/'/g, "");
        conn.query(sql, function(err, result) {
            closeConnectionCallback(conn, callback);
            if (err) {
                return callback(err, null);
            }
            playList = result;
            return callback(null, playList);
        });
}

