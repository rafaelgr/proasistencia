// parametros_db_mysql
// Manejo de la tabla parametros en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise");
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

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
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}


var sql = "";

// comprobarParametro
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarParametro(parametro){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof parametro;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && parametro.hasOwnProperty("parametroId"));
	return comprobado;
}


// getParametros
// lee todos los registros de la tabla parametros y
// los devuelve como una lista de objetos
module.exports.getParametros = function(callback){
	var connection = getConnection();
	var parametros = null;
	sql = "SELECT * FROM parametros";
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		parametros = result;
		callback(null, parametros);
	});	
}


// getParametrosBuscar
// lee todos los registros de la tabla parametros cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getParametrosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var parametros = null;
    var sql = "SELECT * FROM parametros";
    if (nombre !== "*") {
        sql = "SELECT * FROM parametros WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
    	closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        parametros = result;
        callback(null, parametros);
    });
}

// getParametro
// busca  el parametro con id pasado
module.exports.getParametro = function(id, callback){
	var connection = getConnection();
	var parametros = null;
	sql = "SELECT * FROM parametros WHERE parametroId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
		}
		callback(null, result[0]);
	});
}

// getParametro
// busca  el parametro con id pasado
module.exports.getParametroNuevo = async(id) =>{
	var sql = "";
	let conn = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			sql = "SELECT * FROM parametros WHERE parametroId = ?";
			sql = mysql2.format(sql, id);
			const [result] = await conn.query(sql);
			resolve(result[0]);
		} catch(error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
}


module.exports.getParamGrup = function (callback){
	var connection = getConnection();
	var parametros = null;
	sql = "SELECT articuloMantenimientoParaGastos AS mantenimiento, grupoArticuloId AS grupo, ar.* FROM parametros";
	sql += " INNER JOIN articulos AS ar ON parametros.articuloMantenimientoParaGastos = ar.articuloId";
	sql += " WHERE ar.articuloId = parametros.articuloMantenimientoParaGastos";
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
		}
		callback(null, result[0]);
	});
} 


// postParametro
// crear en la base de datos el parametro pasado
module.exports.postParametro = function (parametro, callback){
	if (!comprobarParametro(parametro)){
		var err = new Error("El parametro pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	parametro.parametroId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO parametros SET ?";
	sql = mysql.format(sql, parametro);
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err);
		}
		parametro.parametroId = result.insertId;
		callback(null, parametro);
	});
}

// putParametro
// Modifica el parametro según los datos del objeto pasao
module.exports.putParametro = function(id, parametro, callback){
	if (!comprobarParametro(parametro)){
		var err = new Error("El parametro pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != parametro.parametroId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE parametros SET ? WHERE parametroId = ?";
	sql = mysql.format(sql, [parametro, parametro.parametroId]);
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null, parametro);
	});
}

// deleteParametro
// Elimina el parametro con el id pasado
module.exports.deleteParametro = function(id, parametro, callback){
	var connection = getConnection();
	sql = "DELETE from parametros WHERE parametroId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnection(connection);
		if (err){
			return callback(err);
		}
		callback(null);
	});
}