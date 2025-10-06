// contactosExpediente_db_mysql
// Manejo de la tabla contactosExpediente en la base de datos
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

// comprobarContactoExpediente
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContactoExpediente(contactoExpediente){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof contactoExpediente;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && contactoExpediente.hasOwnProperty("contactoExpedienteId"));
	comprobado = (comprobado && contactoExpediente.hasOwnProperty("contactoNombre"));
	comprobado = (comprobado && contactoExpediente.hasOwnProperty("expedienteId"));
	return comprobado;
}


// getContactosExpedientes
// lee todos los registros de la tabla contactosExpedientes y
// los devuelve como una lista de objetos
module.exports.getContactosExpedientes = function(callback){
	var connection = getConnection();
	var contactosExpedientes = null;
	sql = "SELECT * FROM contactosExpediente";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		contactosExpedientes = result;
		callback(null, contactosExpedientes);
	});	
}



// getContactosExpedientesBuscar
// lee todos los registros de la tabla contactosExpedientes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getContactosExpedientesBuscar = function (nombre, callback) {
    var connection = getConnection();
    var contactosExpedientes = null;
    var sql = "SELECT * FROM contactosExpediente";
    if (nombre !== "*") {
        sql = "SELECT * FROM contactosExpediente WHERE nombreContacto LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
        if (err) {
            callback(err, null);
            return;
        }
        contactosExpedientes = result;
        callback(null, contactosExpedientes);
    });
}

// getContactoExpediente
// busca  el contactoExpediente con id pasado
module.exports.getContacto = function(id, callback){
	var connection = getConnection();
	var contactosExpedientes = null;
	sql = "SELECT * FROM contactosExpediente WHERE contactoExpedienteId = ?";
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

// getContactoExpediente
// busca  el contactoExpediente con id pasado
module.exports.getContactosExpediente = function(id, callback){
	var connection = getConnection();
	var contactosExpedientes = null;
	sql = "SELECT * FROM contactosExpediente WHERE expedienteId = ?";
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

// postContactoExpediente
// crear en la base de datos el contactoExpediente pasado
module.exports.postContactoExpediente = function (contactoExpediente, callback){
	if (!comprobarContactoExpediente(contactoExpediente)){
		var err = new Error("El contacto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	contactoExpediente.contactoExpedienteId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO contactosExpediente SET ?";
	sql = mysql.format(sql, contactoExpediente);
	connection.query(sql, function(err, result){
		if (err){
            callback(err);
            return;
		}
		contactoExpediente.contactoExpedienteId = result.insertId;
		callback(null, contactoExpediente);
	});
	closeConnectionCallback(connection, callback);
}



// putContactoExpediente
// Modifica el contactoExpediente según los datos del objeto pasao
module.exports.putContactoExpediente = function(id, contactoExpediente, callback){
	if (!comprobarContactoExpediente(contactoExpediente)){
		var err = new Error("El contacto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != contactoExpediente.contactoExpedienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE contactosExpediente SET ? WHERE contactoExpedienteId = ?";
	sql = mysql.format(sql, [contactoExpediente, contactoExpediente.contactoExpedienteId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
            callback(err);
            return;
		}
		callback(null, contactoExpediente);
	});
}

// deleteContactoExpediente
// Elimina el contactoExpediente con el id pasado
module.exports.deleteContactoExpediente = function(id, contactoExpediente, callback){
	var connection = getConnection();
	sql = "DELETE from contactosExpediente WHERE contactoExpedienteId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null, 'OK');
		closeConnectionCallback(connection, callback);
	});
}

