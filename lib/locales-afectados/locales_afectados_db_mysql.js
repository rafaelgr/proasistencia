// locales_afectados_db_mysql
// Manejo de la tabla locales_afectados en la base de datos
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


function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}

// comprobarLocalAfectado
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarLocalAfectado(localAfectado){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof localAfectado;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && localAfectado.hasOwnProperty("servicioId"));
	comprobado = (comprobado && localAfectado.hasOwnProperty("local"));
	comprobado = (comprobado && localAfectado.hasOwnProperty("personaContacto"));
	return comprobado;
}


// getLocalesAfectados
// lee todos los registros de la tabla localesAfectados y
// los devuelve como una lista de objetos
module.exports.getLocalesAfectados = function(callback){
	var connection = getConnection();
	var localesAfectados = null;
	sql = "SELECT * FROM locales_afectados";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		localesAfectados = result;
		callback(null, localesAfectados);
	});	
	closeConnectionCallback(connection, callback);
}



// getLocalesAfectadosBuscar
// lee todos los registros de la tabla localesAfectados cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getLocalesAfectadosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var localesAfectados = null;
    var sql = "SELECT * FROM locales_afectados";
    if (nombre !== "*") {
        sql = "SELECT * FROM locales_afectados WHERE local LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        localesAfectados = result;
        callback(null, localesAfectados);
    });
    closeConnectionCallback(connection, callback);
}

// getLocalAfectado
// busca  el localAfectado con id pasado
module.exports.getLocalAfectado = function(id, callback){
	var connection = getConnection();
	var localesAfectados = null;
	sql = "SELECT * FROM locales_afectados WHERE localAfectadoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result[0]);
	});
	closeConnectionCallback(connection, callback);
}



module.exports.getLocalesAfectadosServicio = function(id, callback){
	var connection = getConnection();
	var localesAfectados = null;
	sql = "SELECT * FROM locales_afectados WHERE servicioId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		if (result.length == 0){
			callback(null, null);
			return;
		}
		callback(null, result);
	});
	closeConnectionCallback(connection, callback);
}


// postLocalAfectado
// crear en la base de datos el localAfectado pasado
module.exports.postLocalAfectado = function (localAfectado, callback){
	if (!comprobarLocalAfectado(localAfectado)){
		var err = new Error("El local pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	localAfectado.localAfectadoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO locales_afectados SET ?";
	sql = mysql.format(sql, localAfectado);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
		localAfectado.localAfectadoId = result.insertId;
		callback(null, localAfectado);
	});
	closeConnectionCallback(connection, callback);
}

// putLocalAfectado
// Modifica el localAfectado según los datos del objeto pasao
module.exports.putLocalAfectado = function(id, localAfectado, callback){
	if (!comprobarLocalAfectado(localAfectado)){
		var err = new Error("El local pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != localAfectado.localAfectadoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE locales_afectados SET ? WHERE localAfectadoId = ?";
	sql = mysql.format(sql, [localAfectado, localAfectado.localAfectadoId]);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
		callback(null, localAfectado);
	});
	closeConnectionCallback(connection, callback);
}

// deleteLocalAfectado
// Elimina el localAfectado con el id pasado
module.exports.deleteLocalAfectado = function(id, localAfectado, callback){
	var connection = getConnection();
	sql = "DELETE from locales_afectados WHERE localAfectadoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null);
		closeConnectionCallback(connection, callback);
	});
}