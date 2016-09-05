// unidades_db_mysql
// Manejo de la tabla unidades en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback){
	connection.end(function(err){
		if (err) callback(err);
	});
}

// comprobarUnidad
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarUnidad(unidad){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof unidad;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && unidad.hasOwnProperty("unidadId"));
	comprobado = (comprobado && unidad.hasOwnProperty("nombre"));
	comprobado = (comprobado && unidad.hasOwnProperty("abrev"));
	return comprobado;
}


// getUnidades
// lee todos los registros de la tabla unidades y
// los devuelve como una lista de objetos
module.exports.getUnidades = function(callback){
	var connection = getConnection();
	var unidades = null;
	sql = "SELECT * FROM unidades";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		unidades = result;
		callback(null, unidades);
	});	
	closeConnectionCallback(connection, callback);
}

// loginUnidades
// busca un unidad con el login y contraseña pasados
// si lo encuentra lo devuelve, si no devuelve nulo.
module.exports.loginUnidades = function(unidad, callback){
	var connection = getConnection();
	if (unidad && unidad.login && unidad.password){
		var sql = "SELECT * FROM unidades WHERE login = ? AND password = ?";
		sql = mysql.format(sql, [unidad.login, unidad.password]);
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
			return;
		});
	}else{
		var err = new Error('API: No se ha proporcionado un objeto unidad con login y contraseña');
		callback(err, null);
		return;
	}
	return;
}

// getUnidadesBuscar
// lee todos los registros de la tabla unidades cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getUnidadesBuscar = function (nombre, callback) {
    var connection = getConnection();
    var unidades = null;
    var sql = "SELECT * FROM unidades";
    if (nombre !== "*") {
        sql = "SELECT * FROM unidades WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        unidades = result;
        callback(null, unidades);
    });
    closeConnectionCallback(connection, callback);
}

// getUnidad
// busca  el unidad con id pasado
module.exports.getUnidad = function(id, callback){
	var connection = getConnection();
	var unidades = null;
	sql = "SELECT * FROM unidades WHERE unidadId = ?";
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


// postUnidad
// crear en la base de datos el unidad pasado
module.exports.postUnidad = function (unidad, callback){
	if (!comprobarUnidad(unidad)){
		var err = new Error("El unidad pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	unidad.unidadId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO unidades SET ?";
	sql = mysql.format(sql, unidad);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		unidad.unidadId = result.insertId;
		callback(null, unidad);
	});
	closeConnectionCallback(connection, callback);
}

// putUnidad
// Modifica el unidad según los datos del objeto pasao
module.exports.putUnidad = function(id, unidad, callback){
	if (!comprobarUnidad(unidad)){
		var err = new Error("El unidad pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != unidad.unidadId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE unidades SET ? WHERE unidadId = ?";
	sql = mysql.format(sql, [unidad, unidad.unidadId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, unidad);
	});
	closeConnectionCallback(connection, callback);
}

// deleteUnidad
// Elimina el unidad con el id pasado
module.exports.deleteUnidad = function(id, unidad, callback){
	var connection = getConnection();
	sql = "DELETE from unidades WHERE unidadId = ?";
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