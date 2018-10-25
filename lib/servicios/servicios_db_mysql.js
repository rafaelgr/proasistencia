// servicios_db_mysql
// Manejo de la tabla servicios en la base de datos
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

// comprobarServicio
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarServicio(servicio){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof servicio;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && servicio.hasOwnProperty("servicioId"));
	comprobado = (comprobado && servicio.hasOwnProperty("usuarioId"));
	comprobado = (comprobado && servicio.hasOwnProperty("clienteId"));
	comprobado = (comprobado && servicio.hasOwnProperty("agenteId"));
	comprobado = (comprobado && servicio.hasOwnProperty("tipoProfesionalId"));
	/*comprobado = (comprobado && servicio.hasOwnProperty("fechaCreacion"));
	comprobado = (comprobado && servicio.hasOwnProperty("calle"));
	comprobado = (comprobado && servicio.hasOwnProperty("numero"));
	comprobado = (comprobado && servicio.hasOwnProperty("poblacion"));
	comprobado = (comprobado && servicio.hasOwnProperty("provincia"));
	comprobado = (comprobado && servicio.hasOwnProperty("personaContacto"));*/
	return comprobado;
}


// getServicios
// lee todos los registros de la tabla servicios y
// los devuelve como una lista de objetos
module.exports.getServicios = function(callback){
	var connection = getConnection();
	var servicios = null;
	sql = "SELECT * FROM servicios";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		servicios = result;
		callback(null, servicios);
	});	
	closeConnectionCallback(connection, callback);
}



// getServicio
// busca  el servicio con id pasado
module.exports.getServicio = function(id, callback){
	var connection = getConnection();
	var servicios = null;
	sql = "SELECT * FROM servicios WHERE servicioId = ?";
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


// postServicio
// crear en la base de datos el servicio pasado
module.exports.postServicio = function (servicio, callback){
	if (!comprobarServicio(servicio)){
		var err = new Error("El servicio pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	servicio.servicioId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO servicios SET ?";
	sql = mysql.format(sql, servicio);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		servicio.servicioId = result.insertId;
		callback(null, servicio);
	});
	closeConnectionCallback(connection, callback);
}

// putServicio
// Modifica el servicio según los datos del objeto pasao
module.exports.putServicio = function(id, servicio, callback){
	if (!comprobarServicio(servicio)){
		var err = new Error("El servicio pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != servicio.servicioId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE servicios SET ? WHERE servicioId = ?";
	sql = mysql.format(sql, [servicio, servicio.servicioId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, servicio);
	});
	closeConnectionCallback(connection, callback);
}

// deleteServicio
// Elimina el servicio con el id pasado
module.exports.deleteServicio = function(id, servicio, callback){
	var connection = getConnection();
	sql = "DELETE from servicios WHERE servicioId = ?";
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