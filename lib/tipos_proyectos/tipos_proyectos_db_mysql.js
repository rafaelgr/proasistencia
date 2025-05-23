// tipos_proyectos_db_mysql
// Manejo de la tabla tipos proyecto en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
const mysql2 = require('mysql2/promise');

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
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN tipos_mantenimiento as tm ON tm.tipoMantenimientoId = tp.tipoMantenimientoId"
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		tipos_proyecto = result;
		callback(null, tipos_proyecto);
	});	
}


module.exports.getTiposProyectoDepartamento = function(usuarioId, departamentoId, callback){
	var connection = getConnection();
	var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
	if(departamentoId > 0) {
        sql += " WHERE departamentoId = " + departamentoId;
    } else {
        sql += " WHERE departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")  OR departamentoId IS NULL"
    }
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


module.exports.getTiposProyectoMovil = async (usuarioId, departamentoId, visible) => {
	let myBool = (visible.toLowerCase() === 'true');
	let con = null;
    return new Promise(async (resolve, reject) => {
        try {
			con = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
			sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
			if(departamentoId > 0) {
				sql += " WHERE departamentoId = " + departamentoId;
			} else {
				sql += " WHERE departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")  OR departamentoId IS NULL"
			}
			if(myBool) {
				sql += " AND visibleApp = 1";
			} else {
				sql += " AND visibleApp = 0";
			}
			sql += " AND tp.activo = 1";
			let [result] = await con.query(sql);
            await con.end();
            if(result.length == 0){
                return resolve(null);
            }
            return resolve(result);

		} catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
	});
}


module.exports.getTiposProyectoMovilProfesion = async (usuarioId, departamentoId, visible) => {
	let myBool = (visible.toLowerCase() === 'true');
	let con = null;
    return new Promise(async (resolve, reject) => {
        try {
			con = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT tp.*, tm.nombre as departamento";
			sql += " FROM tipos_proyecto as tp";
			sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
			sql += " LEFT JOIN tipoproyecto_profesiones as t on t.tipoProyectoId = tp.tipoProyectoId"
			sql += " WHERE true"
			if(departamentoId > 0) {
				sql += " AND departamentoId = " + departamentoId;
			} 
			sql += " AND t.tipoProfesionalId IN (SELECT DISTINCT tipoProfesionalId FROM proveedores WHERE proveedorId = " + usuarioId + ")"
			if(myBool) {
				sql += " AND visibleApp = 1";
			} else {
				sql += " AND visibleApp = 0";
			}
			sql += " AND tp.activo = 1";
			let [result] = await con.query(sql);
            await con.end();
            if(result.length == 0){
                return resolve(null);
            }
            return resolve(result);
		} catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
	});
}

module.exports.getTiposProyectoDepartamentoActivos = function(usuarioId, departamentoId, tipoProyectoId, callback){
	var connection = getConnection();
	var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
	sql += " WHERE tp.activo = 1"
	sql += " AND departamentoId = " + departamentoId;
	if(tipoProyectoId)   {
		sql += " OR tp.tipoProyectoId = " + tipoProyectoId
	}
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		tipos_proyecto = result;
		callback(null, tipos_proyecto);
	});	
}

// getProyectosDepartamento
// lee todos los registros de la tabla tipos_proyecto y
// los devuelve como una lista de objetos
module.exports.getProyectosDepartamento = function(tipoContratoId, callback){
	var connection = getConnection();
	var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN tipos_mantenimiento as tm ON tm.tipoMantenimientoId = tp.tipoMantenimientoId"
	sql += " WHERE tp.tipoMantenimientoId = ?";
	sql = mysql.format(sql, tipoContratoId);
	connection.query(sql, function(err, result){
		connection.end();
		if (err){
			callback(err, null);
			return;
		}
		tipos_proyecto = result;
		callback(null, tipos_proyecto);
	});	
}


// getTiposProyectoBuscar
// lee todos los registros de la tabla tipos_proyecto cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposProyectoBuscar = function (nombre, callback) {
    var connection = getConnection();
    var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN tipos_mantenimiento as tm ON tm.tipoMantenimientoId = tp.tipoMantenimientoId"
    if (nombre !== "*") {
        sql += " WHERE tp.nombre LIKE ?";
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


module.exports.getTiposProyectoBuscarDepartamento = function (nombre, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
	if(departamentoId > 0) {
        sql += " WHERE departamentoId = " + departamentoId;
    } else {
        sql += " WHERE (departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")  OR departamentoId IS NULL)"
    }
    if (nombre !== "*") {
        sql += " AND tp.nombre LIKE ?";
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
module.exports.getTiposProyectoBuscarDepartamentoTecnico = function (nombre, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var tipos_proyecto = null;
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId";
	sql += " WHERE tp.esTecnico = 1"
	if(departamentoId > 0) {
        sql += " AND departamentoId = " + departamentoId;
    } else {
        sql += " AND (departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")  OR departamentoId IS NULL)"
    }
    if (nombre !== "*" && nombre) {
        sql += " AND tp.nombre LIKE ?";
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
	var sql = "SELECT tp.*, tm.nombre as departamento, t.tipoProfesionalId FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId"
	sql += " LEFT JOIN tipoproyecto_profesiones AS t ON t.tipoProyectoId = tp.tipoProyectoId";
	sql += " WHERE tp.tipoProyectoId = ?";
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
		let tipoProyecto = creaProObj(result);
		callback(null, tipoProyecto);
	});
	closeConnectionCallback(connection, callback);
}

var creaProObj = function(data) {
    var tip = data[0];
    var tiposProfesionales = [];
    data.forEach( function(p) {
        tiposProfesionales.push(p.tipoProfesionalId);
    });
    //asignamos los valores resultantes
    tip.tiposProfesionales = tiposProfesionales;
    return tip;
}



// postTipoProyecto
// crear en la base de datos el tipo de proyecto pasado
module.exports.postTipoProyecto = function (tipoProyecto, callback){
	if (!comprobarTipoProyecto(tipoProyecto)){
		var err = new Error("El tipo de proyecto pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
		callback(err);
		return;
	}
	if(tipoProyecto.profesiones) {
		let profesiones = tipoProyecto.profesiones.profesiones;
		delete  tipoProyecto.profesiones;
		var connection = getConnection();
		tipoProyecto.tipoProyectoId = 0; // fuerza el uso de autoincremento
		sql = "INSERT INTO tipos_proyecto SET ?";
		sql = mysql.format(sql, tipoProyecto);
		connection.query(sql, function(err, result){
			if (err) return callback(err);
			updateProfesionesAsociadas(profesiones, result.insertId, function (err) {
				if (err) return callback(err);
				closeConnectionCallback(connection, callback);
				if (err){
					callback(err);
				}
				tipoProyecto.tipoProyectoId = result.insertId;
				callback(null, tipoProyecto);
			});
		});
	} else {
		var connection = getConnection();
		sql = "INSERT INTO tipos_proyecto SET ?";
		sql = mysql.format(sql, [tipoProyecto, tipoProyecto.tipoProyectoId]);
		connection.query(sql, function(err, result){
			if (err) return callback(err);
			closeConnectionCallback(connection, callback);
				if (err){
					callback(err);
				}
				tipoProyecto.tipoProyectoId = result.insertId;
				callback(null, tipoProyecto);
		});
	}
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
	if(tipoProyecto.profesiones) {
		let profesiones = tipoProyecto.profesiones.profesiones;
		delete  tipoProyecto.profesiones;
		var connection = getConnection();
		sql = "UPDATE tipos_proyecto SET ? WHERE tipoProyectoId = ?";
		sql = mysql.format(sql, [tipoProyecto, tipoProyecto.tipoProyectoId]);
		connection.query(sql, function(err, result){
			if (err) return callback(err);
			updateProfesionesAsociadas(profesiones, tipoProyecto.tipoProyectoId, function (err) {
				if(err) return callback(err);
				closeConnectionCallback(connection, callback);
				if(err) return callback(err);
				callback(null, tipoProyecto);
			});
			
			
		});
	} else {
		var connection = getConnection();
		sql = "UPDATE tipos_proyecto SET ? WHERE tipoProyectoId = ?";
		sql = mysql.format(sql, [tipoProyecto, tipoProyecto.tipoProyectoId]);
		connection.query(sql, function(err, result){
			if (err) return callback(err);
			callback(null, tipoProyecto);
		});
	}
}

// deleteTipoProyecto
// Elimina el tipo de proyecto con el id pasado
module.exports.deleteTipoProyecto = function(id, tipoProyecto, callback){
	var connection = getConnection();
	sql = "DELETE from tipos_proyecto WHERE tipoProyectoId = ?";
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

var updateProfesionesAsociadas = function (profesiones, tipoProyectoId, done) {
	//primero borramos todos las profesiones asociadas al proveedor
	var connection = getConnection();
   
	var sql = "DELETE FROM tipoProyecto_profesiones WHERE tipoProyectoId = ?";
	sql = mysql.format(sql, tipoProyectoId);
	connection.query(sql, function (err, result) {
		//asociamos ahora las profesiones al proveedor
		async.forEachSeries(profesiones, function (profesion, callback) {
			var proveedor_profesiones = {
				tipoProyectoProfesionId: 0,
				tipoProfesionalId: profesion,
				tipoProyectoId: tipoProyectoId
			}
			sql = "INSERT INTO tipoProyecto_profesiones SET ?";
			sql = mysql.format(sql,  proveedor_profesiones);
			connection.query(sql, function (err) {
				if (err) return callback(err);
				callback();
			})
		}, function (err) {
			if(connection) connection.end();
			if (err) return done(err);
			done();
		});
		
	});
	
}