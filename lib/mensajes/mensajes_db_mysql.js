// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
const moment = require("moment");

//  leer la configurción de MySQL

var sql = "";

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
    var sql = "SELECT mens.*, ad.nombre AS responsable";
    sql += " FROM mensajes AS mens";
    sql += " LEFT JOIN usuarios AS ad ON ad.usuarioId = mens.usuarioId";
    sql += " ORDER BY mens.fecha ASC";
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err, null);
			return;
        }
		
        mensajes = result;
		callback(null, mensajes);
	});
	closeConnectionCallback(connection, callback);
}


// getMensajesUsuario
// lee los mensajes relacionados con un determinado usuario
module.exports.getMensajesUsuario = function(proveedorId, callback) {
    var connection = getConnection();
    var mensajes = null;
    sql = "SELECT m.mensajeId, m.asunto, m.texto, m.fecha, mu.estado, mu.fecha as fechalec";
    sql += " FROM mensajes_proveedorespush AS mu";
    sql += " LEFT JOIN mensajes AS m ON m.mensajeId = mu.mensajeId";
    sql += " WHERE mu.proveedorId = ?";
    sql += " AND m.estado = 'ENVIADO'";
    sql += " ORDER by m.fecha DESC";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        mensajes = result;
        callback(null, mensajes);
    });
    closeConnectionCallback(connection, callback);
}

// getMensaje
module.exports.getMensaje = function (mensajeId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT mens.*, ad.nombre AS responsable FROM mensajes AS mens";
    sql += " LEFT JOIN usuarios AS ad ON ad.usuarioId = mens.usuarioId";
    sql += " WHERE mens.mensajeId = ?";
    sql = mysql.format(sql, mensajeId);
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		mensaje = result;
		callback(null, mensaje[0]);
	});
	closeConnectionCallback(connection, callback);
}

// getMensajeLineaProveedor
module.exports.getMensajeLineaProveedor = function (mensajeId, proveedorId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT * FROM mensajes_proveedorespush AS mens";
    sql += " WHERE mensajeId = ? AND proveedorId = ?";
    sql = mysql.format(sql, [mensajeId, proveedorId]);
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		mensaje = result;
		callback(null, mensaje[0]);
	});
	closeConnectionCallback(connection, callback);
}

// getMensaje
module.exports.getProveedoresAsociados = function (mensajeId, callback) {
	var connection = getConnection();
	var mensaje = null;
    var sql = "SELECT m.*, p.nombre AS proveedorNombre, p.proveedorId FROM mensajes_proveedorespush AS m";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = m.proveedorId";
    sql += " WHERE m.mensajeId = ?";
    sql = mysql.format(sql, mensajeId);
	connection.query(sql, function (err, result) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, result);
	});
	closeConnectionCallback(connection, callback);
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
        fnStoreMensaje2(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, res);
        })
    });
}

module.exports.postSendMensaje = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIds(mensaje, function(err, res) {
        if (err) {
            return callback(err);
        }
        var playList = res;
        fnStoreMensaje(mensaje, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            var mensaje2 = res;
            getParametro(function(err, res) {
                if (err) {
                    return callback(err);
                }
                var parametros = res;
                fnSendMessage(mensaje2, parametros, playList, function(err, res) {
                    if (!err) {
                        res2 = JSON.parse(res);
                        mensaje2.estado = "ENVIADO";
                        mensaje2.pushId = res2.id;
                        fnPutMensaje(mensaje2.mensajeId, mensaje2, function(err, res) {
                            if (err) {
                                return callback(err);
                            }
                            return callback(null, res);
                        });
                    } else {
                        err2 = new Error("[MENSAJE NO ENVIADO] " + err.message);
                        // borra el mensaje porque no vale
                        fnDeleteMensaje(mensaje2.mensajeId, mensaje2, function(err, res) {
                            return callback(err2);
                        });
                    }
                });
            });
        })
    })
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
        usuarioId: mensaje.usuarioId
    }
    var connection = getConnection();
    sql = "UPDATE mensajes SET ? WHERE mensajeId = ?";
    sql = mysql.format(sql, [mensaje2, mensaje.mensajeId]);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, mensaje2);
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
var fnPutMensaje = function(id, mensaje, callback) {
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


var fnStoreMensaje = function(mensaje, playList, callback) {
    var mensaje2 = {
        mensajeId: mensaje.mensajeId,
        asunto: mensaje.asunto,
        texto: mensaje.texto,
        estado: 'PENDIENTE',
        usuarioId: mensaje.usuarioId,
        fecha: new Date()
    }
    var connection = getConnection();
    mensaje.mensajeId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO mensajes SET ?";
    sql = mysql.format(sql, mensaje2);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        mensaje2.mensajeId = result.insertId;
        fnStoreMensajeUsuarios(mensaje2, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, mensaje2);
        })
    });
}



var fnStoreMensaje2 = function(mensaje, playList, callback) {
    var mensaje2 = {
        mensajeId: mensaje.mensajeId,
        asunto: mensaje.asunto,
        texto: mensaje.texto,
        estado: 'PENDIENTE',
        fecha: mensaje.fecha,
        usuarioId: mensaje.usuarioId
    }
    var connection = getConnection();
    mensaje.mensajeId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO mensajes SET ?";
    sql = mysql.format(sql, mensaje2);
    connection.query(sql, function(err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        mensaje2.mensajeId = result.insertId;
        fnStoreMensajeUsuarios2(mensaje2, playList, function(err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, mensaje2);
        })
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


var fnStoreMensajeUsuarios2 = function(mensaje, playList, callback) {
    // write records for all users implied when a message is sent
    var records = [];
    var record = [];
    for (var i = 0; i < playList.length; i++) {
        record = [];
        record.push(mensaje.mensajeId);
        record.push(playList[i].proveedorId);
        record.push('PENDIENTE');
        records.push(record);
    }
    var conn = getConnection();
    sql = "INSERT INTO mensajes_proveedorespush (mensajeId, proveedorId, estado) VALUES  ?";
    sql = mysql.format(sql, [records]);
    conn.query(sql, function(err, result) {
        conn.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

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

module.exports.sendPush = function(mensaje, callback) {
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


var fnObtainPlayersIdsFromMensaje = function(mensaje, callback) {
    var playList = [];
    var sql = "";
    var conn = getConnection();
    // if there's an USER, we send to that USER no matter 
    // what global sending parameters we have.
    sql = "SELECT u.proveedorId, u.playerId";
    sql += " FROM mensajes AS m";
    sql += " LEFT JOIN mensajes_proveedorespush AS mu ON mu.mensajeId = m.mensajeId";
    sql += " LEFT JOIN proveedores AS u ON u.proveedorId = mu.proveedorId";
    sql += " WHERE m.mensajeId = ?";
    sql = mysql.format(sql, [mensaje.mensajeId]);
    conn.query(sql, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        playList = result;
        return callback(null, playList);
    });
	closeConnectionCallback(conn, callback);
}

// getParametro
// busca  el parametro con id pasado
var	getParametro = function(callback){
	var connection = getConnection();
	sql = "SELECT * FROM parametros";
	connection.query(sql, function(err, result){
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
		}
		callback(null, result[0]);
	});
	closeConnectionCallback(connection, callback);
}

var fnSendMessage = function(mensaje, parametros, playList, callback) {
    // obtain list of playersIds
    var include_player_ids = [];
    var contenido = "[" + parametros.tituloPush + "] " + mensaje.asunto;
    for (var i = 0; i < playList.length; i++) {
        include_player_ids.push(playList[i].playerId);
    };
    var data = {
        app_id: parametros.appId,
        include_player_ids: include_player_ids,
        headings: {
            en: parametros.tituloPush
        },
        data: {
            mensajeId: mensaje.mensajeId
        },
        contents: {
            en: contenido
        }
    };
    var request = require('request');

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
        console.log("Estoy aquí");
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
    sql = "UPDATE mensajes AS m, mensajes_proveedorespush AS mu";
    sql += " SET m.estado = 'ENVIADO', mu.estado = 'ENVIADO', m.usuarioId = ?, mu.fecha = m.fecha";
    sql += " WHERE m.mensajeId = ? AND mu.mensajeId = ?;"
    sql = mysql.format(sql, [usuarioId, id, id]);
    connection.query(sql, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, null);
    });
    closeConnectionCallback(connection, callback);
};


// Returns an array with userPushIds and playersIds
// dependig on parameters

var fnObtainPlayersIds = function(mensaje, callback) {
    var playList = [];
    var sql = "";
    var conn = getConnection();

    // if there aren't any parameters, return empty array
    // no users to send for
    if ((!mensaje.proveedores || mensaje.proveedores.length == 0)) {
        return callback(null, playList);
    }
    if (mensaje.proveedores && mensaje.proveedores.length > 0) {
        sql = "SELECT u.proveedorId, u.playerId";
        sql += " FROM proveedores AS u";
        sql += " WHERE u.proveedorId IN (?)";
        sql += " AND NOT u.playerId IS NULL"
        sql = mysql.format(sql, [mensaje.proveedores]);
        sql = sql.replace(/'/g, "");
        conn.query(sql, function(err, result) {
            if (err) {
                return callback(err, null);
            }
            playList = result;
            return callback(null, playList);
        });
        closeConnectionCallback(conn, callback);
    } else {
        // It depends on wich flag is active we build a diferent sql
        sql = "SELECT proveedorId, playerId FROM proveedores WHERE NOT playerId IS NULL";
        conn.query(sql, function(err, result) {
            if (err) {
                return callback(err, null);
            }
            playList = result;
            return callback(null, playList);
        });
        closeConnectionCallback(conn, callback);
    }
}

