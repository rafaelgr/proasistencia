// departamentos_db_mysql
// Manejo de la tabla departamentos en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL



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

// comprobarDepartamento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarDepartamento(departamento){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof departamento;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && departamento.hasOwnProperty("departamentoId"));
	comprobado = (comprobado && departamento.hasOwnProperty("nombre"));
	return comprobado;
}


// getDepartamentos
// lee todos los registros de la tabla departamentos y
// los devuelve como una lista de objetos
module.exports.getDepartamentos = function(callback){
	var connection = getConnection();
	var departamentos = null;
	sql = "SELECT * FROM departamentos";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		departamentos = result;
		callback(null, departamentos);
	});	
}



// getDepartamentosBuscar
// lee todos los registros de la tabla departamentos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getDepartamentosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var departamentos = null;
    var sql = "SELECT * FROM departamentos";
    if (nombre !== "*") {
        sql = "SELECT * FROM departamentos WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        departamentos = result;
        callback(null, departamentos);
    });
    closeConnectionCallback(connection, callback);
}

// getDepartamento
// busca  el departamento con id pasado
module.exports.getDepartamento = function(id, callback){
	var connection = getConnection();
	var departamentos = null;
	sql = "SELECT * FROM departamentos WHERE departamentoId = ?";
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


// getDepartamentosUsuario
//devuelve todos los departamentos de un usurio concreto
module.exports.getDepartamentosUsuario = function(usuarioId, callback){
	var connection = getConnection();
	var departamentos = null;
	sql = "SELECT * FROM departamentos AS dep";
	sql += "  WHERE departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = ?)";
	sql = mysql.format(sql, usuarioId);
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		departamentos = result;
		callback(null, departamentos);
	});	
	closeConnectionCallback(connection, callback);
}


// getDepartamentoContrato
//devuelve el departamento asociado a un contrato
module.exports.getDepartamentoContrato = function(contratoId, callback){
	var connection = getConnection();
	var departamento = null;
	sql = "SELECT dep.* FROM departamentos AS dep";
	sql += " LEFT JOIN contratos AS con ON con.tipoContratoId = dep.departamentoId"
	sql += " WHERE con.contratoId = ?";
	sql = mysql.format(sql, contratoId);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		departamento = result;
		callback(null, departamento);
	});	
}

// postDepartamento
// crear en la base de datos el departamento pasado
module.exports.postDepartamento = function (departamento, callback){
	if (!comprobarDepartamento(departamento)){
		var err = new Error("El departamento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	departamento.departamentoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO departamentos SET ?";
	sql = mysql.format(sql, departamento);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		departamento.departamentoId = result.insertId;
		callback(null, departamento);
	});
	closeConnectionCallback(connection, callback);
}

// putDepartamento
// Modifica el departamento según los datos del objeto pasao
module.exports.putDepartamento = function(id, departamento, callback){
	if (!comprobarDepartamento(departamento)){
		var err = new Error("El departamento pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != departamento.departamentoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE departamentos SET ? WHERE departamentoId = ?";
	sql = mysql.format(sql, [departamento, departamento.departamentoId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
		}
		callback(null, departamento);
	});
}

// deleteDepartamento
// Elimina el departamento con el id pasado
module.exports.deleteDepartamento = function(id, departamento, callback){
	var connection = getConnection();
	sql = "DELETE from departamentos WHERE departamentoId = ?";
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