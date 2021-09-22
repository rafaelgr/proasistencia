// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

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

//ENVÍO DE MENSAJES

module.exports.sendPush = function(mensaje, callback) {
    // (1) Obtener la lista de destinatarios
    fnObtainPlayersIdsFromMensaje(mensaje.proveedorId, function(err, res) {
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
                if (!err) {
					return callback(err);
                }
				return callback(null, res);
            });
        });

    })
}


var fnObtainPlayersIdsFromMensaje = function(proveedorId, callback) {
    var playList = [];
    var sql = "";
    var conn = getConnection();
    // if there's an USER, we send to that USER no matter 
    // what global sending parameters we have.
    sql = "SELECT playerId";
    sql += " FROM proveedores";
    sql += " WHERE proveedorId = ?";
    sql = mysql.format(sql, proveedorId);
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
            servicioId: mensaje.servicioId
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

