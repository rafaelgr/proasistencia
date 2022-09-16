// usuarios_db_mysql
// Manejo de la tabla usuarios en la base de datos
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

// comprobarUsuario
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarUsuario(usuario){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof usuario;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && usuario.hasOwnProperty("usuarioId"));
	comprobado = (comprobado && usuario.hasOwnProperty("nombre"));
	comprobado = (comprobado && usuario.hasOwnProperty("login"));
	comprobado = (comprobado && usuario.hasOwnProperty("password"));
	return comprobado;
}


// getUsuarios
// lee todos los registros de la tabla usuarios y
// los devuelve como una lista de objetos
module.exports.getUsuarios = function(callback){
	var connection = getConnection();
	var usuarios = null;
	sql = "SELECT * FROM usuarios";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		usuarios = result;
		callback(null, usuarios);
	});	
}

// loginUsuarios
// busca un usuario con el login y contraseña pasados
// si lo encuentra lo devuelve, si no devuelve nulo.
module.exports.loginUsuarios = function(usuario, callback){
	var connection = getConnection();
	if (usuario && usuario.login && usuario.password){
		var sql = "SELECT * FROM usuarios WHERE login = ? AND password = ?";
		sql = mysql.format(sql, [usuario.login, usuario.password]);
		connection.query(sql, function(err, result){
			connection.end();
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
		var err = new Error('API: No se ha proporcionado un objeto usuario con login y contraseña');
		callback(err, null);
		return;
	}
	return;
}

// getUsuariosBuscar
// lee todos los registros de la tabla usuarios cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getUsuariosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var usuarios = null;
    var sql = "SELECT * FROM usuarios";
    if (nombre !== "*") {
        sql = "SELECT * FROM usuarios WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
		closeConnectionCallback(connection, callback);
        if (err) {
            callback(err, null);
            return;
        }
        usuarios = result;
        callback(null, usuarios);
    });
}

// getUsuario
// busca  el usuario con id pasado
module.exports.getUsuario = function(id, callback){
	var connection = getConnection();
	var usuarios = null;
	sql = "SELECT * FROM usuarios WHERE usuarioId = ?";
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

// getUsuarioDepartamentioTrabajo
// busca  el usuario con id pasado
module.exports.getUsuarioDepartamentoTrabajo = function(departamentoTrabajo, callback){
	var connection = getConnection();
	var usuarios = null;
	var sql = "SELECT * FROM usuarios WHERE departamentoTrabajo = ?";
	sql = mysql.format(sql, departamentoTrabajo);
	connection.query(sql, function(err, result){
		connection.end();
		if (err){
			return callback(err, null);
		}
		if (result.length == 0){
			return callback(null, null);
			
		}
		return callback(null, result);
	});
}

// getUsuarioDepartamentos
// busca los departamentos asociados a un usuario
module.exports.getUsuarioDepartamentos = function(id, callback){
	var connection = getConnection();
	var usuarios = null;
	sql = "SELECT dep.nombre AS nombreDepartamento, ud.usuarioDepartamentoId, ud.departamentoId FROM  usuarios_departamentos AS ud";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ud.usuarioId";
	sql += " LEFT JOIN departamentos as dep on dep.departamentoId = ud.departamentoId";
	sql += " WHERE ud.usuarioId = ?"
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
		callback(null, result);
	});
}


// getUsuarioDepartamento
// busca un registro de la tabla usuarios_departamentos con su id pasada
module.exports.getUsuarioDepartamento = function(id, callback){
	var connection = getConnection();
	var usuarios = null;
	sql = "SELECT ud.* FROM  usuarios_departamentos AS ud";
	sql += " WHERE ud.usuarioDepartamentoId = ?"
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

// postUsuario
// crear en la base de datos el usuario pasado
module.exports.postUsuario = function (usuario, callback){
	if (!comprobarUsuario(usuario)){
		var err = new Error("El usuario pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	var connection = getConnection();
	usuario.usuarioId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO usuarios SET ?";
	sql = mysql.format(sql, usuario);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return
		}
		usuario.usuarioId = result.insertId;
		callback(null, usuario);
	});
	closeConnectionCallback(connection, callback);
}

// postUsuarioDepartamento
// crear en la base de datos el usuario pasado
module.exports.postUsuarioDepartamento = function (departamento, callback){
	var connection = getConnection();
	departamento.usuarioDepartamentoId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO usuarios_departamentos SET ?";
	sql = mysql.format(sql, departamento);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return
		}
		departamento.usuarioDepartamentoId = result.insertId;
		callback(null, departamento);
	});
}

// putUsuario
// Modifica el usuario según los datos del objeto pasao
module.exports.putUsuario = function(id, usuario, callback){
	if (!comprobarUsuario(usuario)){
		var err = new Error("El usuario pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
    }
    if (id != usuario.usuarioId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE usuarios SET ? WHERE usuarioId = ?";
	sql = mysql.format(sql, [usuario, usuario.usuarioId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return
		}
		callback(null, usuario);
	});
	closeConnectionCallback(connection, callback);
}

// putUsuarioDepartamento
// Modifica el depart6amento asociado a un usuario según los datos del objeto pasado
module.exports.putUsuarioDepartamento = function(id, departamento, callback){
	var connection = getConnection();
	sql = "UPDATE usuarios_departamentos SET ? WHERE usuarioDepartamentoId = ?";
	sql = mysql.format(sql, [departamento, id]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return
		}
		callback(null, departamento);
	});
}


// putUsuarioDepartamento
// Modifica el depart6amento asociado a un usuario según los datos del objeto pasado
module.exports.putUsuarioDepartamentoTrabajo = function(id, usuario, callback){
	var connection = getConnection();
	sql = "UPDATE usuarios SET ? WHERE usuarioId = ?";
	sql = mysql.format(sql, [usuario, id]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return
		}
		callback(null, usuario);
	});
}

// deleteUsuario
// Elimina el usuario con el id pasado
module.exports.deleteUsuario = function(id, usuario, callback){
	var connection = getConnection();
	sql = "DELETE from usuarios WHERE usuarioId = ?";
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

// deleteUsuarioDepartamento
// Elimina el usuario con el id pasado
module.exports.deleteUsuarioDepartamento = function(id, callback){
	var connection = getConnection();
	sql = "DELETE from usuarios_departamentos WHERE usuarioDepartamentoId = ?";
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