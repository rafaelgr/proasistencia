// tipos_proyectos_db_mysql
// Manejo de la tabla tipos proyecto en la base de datos
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

// comprobarTipoProyecto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoProyecto(tipoProyecto){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof tipoProyecto;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && tipoProyecto.hasOwnProperty("tipoProyectoId"));
	comprobado = (comprobado && tipoProyecto.hasOwnProperty("nombre"));
	comprobado = (comprobado && tipoProyecto.hasOwnProperty("abrev"));
	return comprobado;
}


// getTiposProyectos
// lee todos los registros de la tabla tipos_proyecto y
// los devuelve como una lista de objetos
module.exports.getTiposProyecto = function(callback){
	var connection = getConnection();
	var tipos_proyecto = null;
	sql = "SELECT * FROM tipos_proyecto";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		tipos_proyecto = result;
		callback(null, tipos_proyecto);
	});	
	closeConnectionCallback(connection, callback);
}


// getTiposProyectoBuscar
// lee todos los registros de la tabla tipos_proyecto cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposProyectoBuscar = function (nombre, callback) {
    var connection = getConnection();
    var tipos_proyecto = null;
    var sql = "SELECT * FROM tipos_proyecto";
    if (nombre !== "*") {
        sql = "SELECT * FROM tipos_proyecto WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        tipos_proyecto = result;
        callback(null, tipos_proyecto);
    });
    closeConnectionCallback(connection, callback);
}

// getTipoProyecto
// busca  el tipo de proyecto con id pasado
module.exports.getTipoProyecto = function(id, callback){
	var connection = getConnection();
	var tipos_proyecto = null;
	sql = "SELECT * FROM tipos_proyecto WHERE tipoProyectoId = ?";
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


// postTipoProyecto
// crear en la base de datos el tipo de proyecto pasado
module.exports.postTipoProyecto = function (tipoProyecto, callback){
	if (!comprobarTipoProyecto(tipoProyecto)){
		var err = new Error("El tipo de proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	tipoProyecto.tipoProyectoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO tipos_proyecto SET ?";
	sql = mysql.format(sql, tipoProyecto);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		tipoProyecto.tipoProyectoId = result.insertId;
		callback(null, tipoProyecto);
	});
	closeConnectionCallback(connection, callback);
}

// putTipoProyecto
// Modifica el tipo de proyecto según los datos del objeto pasao
module.exports.putTipoProyecto = function(id, tipoProyecto, callback){
	if (!comprobarTipoProyecto(tipoProyecto)){
		var err = new Error("El tipo de proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != tipoProyecto.tipoProyectoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE tipos_proyecto SET ? WHERE tipoProyectoId = ?";
	sql = mysql.format(sql, [tipoProyecto, tipoProyecto.tipoProyectoId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, tipoProyecto);
	});
	closeConnectionCallback(connection, callback);
}

// deleteTipoProyecto
// Elimina el tipo de proyecto con el id pasado
module.exports.deleteTipoProyecto = function(id, tipoProyecto, callback){
	var connection = getConnection();
	sql = "DELETE from tipos_proyecto WHERE tipoProyectoId = ?";
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