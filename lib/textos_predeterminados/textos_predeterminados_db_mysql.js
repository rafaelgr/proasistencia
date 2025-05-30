// textosPredeterminados_db_mysql
// Manejo de la tabla textosPredeterminados en la base de datos
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

// comprobarTextoPredeterminado
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTextoPredeterminado(textoPredeterminado){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof textoPredeterminado;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && textoPredeterminado.hasOwnProperty("textoPredeterminadoId"));
	comprobado = (comprobado && textoPredeterminado.hasOwnProperty("texto"));
	comprobado = (comprobado && textoPredeterminado.hasOwnProperty("abrev"));
	return comprobado;
}


// getTextosPredeterminados
// lee todos los registros de la tabla textosPredeterminados y
// los devuelve como una lista de objetos
module.exports.getTextosPredeterminados = function(callback){
	var connection = getConnection();
	var textosPredeterminados = null;
	sql = "SELECT * FROM textos_predeterminados";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		textosPredeterminados = result;
		callback(null, textosPredeterminados);
	});	
}

// getTextosPredeterminados
// lee todos los registros de la tabla textosPredeterminados y
// los devuelve como una lista de objetos
module.exports.getTextosPredeterminadosConceptosExcluidos = function(empresaId, departamentoId, tipoTextoId, callback){
	var connection = getConnection();
	var textosPredeterminados = null;
	sql = "SELECT * FROM textos_predeterminados WHERE tipoTextoId = ?";
	sql += " AND empresaId = ? AND departamentoId = ?";
	sql = mysql.format(sql, [tipoTextoId, empresaId, departamentoId])
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		textosPredeterminados = result;
		callback(null, textosPredeterminados);
	});	
}


// getTextosPredeterminadosBuscar
// lee todos los registros de la tabla textosPredeterminados cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTextosPredeterminadosBuscar = function (texto, callback) {
    var connection = getConnection();
    var textosPredeterminados = null;
    var sql = "SELECT * FROM textos_predeterminados";
    if (texto !== "*") {
        sql = "SELECT * FROM textos_predeterminados WHERE texto LIKE ?";
        sql = mysql.format(sql, '%' + texto + '%');
    }
    connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
        if (err) {
            callback(err, null);
            return;
        }
        textosPredeterminados = result;
        callback(null, textosPredeterminados);
    });
}

// getTextoPredeterminado
// busca  el textoPredeterminado con id pasado
module.exports.getTextoPredeterminado = function(id, callback){
	var connection = getConnection();
	var textosPredeterminados = null;
	sql = "SELECT * FROM textos_predeterminados WHERE textoPredeterminadoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
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
}


// postTextoPredeterminado
// crear en la base de datos el textoPredeterminado pasado
module.exports.postTextoPredeterminado = function (textoPredeterminado, callback){
	if (!comprobarTextoPredeterminado(textoPredeterminado)){
		var err = new Error("El texto predeterminado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	textoPredeterminado.textoPredeterminadoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO textos_predeterminados SET ?";
	sql = mysql.format(sql, textoPredeterminado);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
		}
		textoPredeterminado.textoPredeterminadoId = result.insertId;
		callback(null, textoPredeterminado);
	});
}

// putTextoPredeterminado
// Modifica el textoPredeterminado según los datos del objeto pasao
module.exports.putTextoPredeterminado = function(id, textoPredeterminado, callback){
	if (!comprobarTextoPredeterminado(textoPredeterminado)){
		var err = new Error("El texto predeterminado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != textoPredeterminado.textoPredeterminadoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE textos_predeterminados SET ? WHERE textoPredeterminadoId = ?";
	sql = mysql.format(sql, [textoPredeterminado, textoPredeterminado.textoPredeterminadoId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
		}
		callback(null, textoPredeterminado);
	});
}

// deleteTextoPredeterminado
// Elimina el textoPredeterminado con el id pasado
module.exports.deleteTextoPredeterminado = function(id, textoPredeterminado, callback){
	var connection = getConnection();
	sql = "DELETE from textos_predeterminados WHERE textoPredeterminadoId = ?";
	sql = mysql.format(sql, id);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null);
	});
}