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
	var sql = "SELECT tp.*, tm.nombre as departamento FROM tipos_proyecto as tp";
	sql += " LEFT JOIN departamentos as tm ON tm.departamentoId = tp.tipoMantenimientoId"
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
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
		}
		tipoProyecto.tipoProyectoId = result.insertId;
		callback(null, tipoProyecto);
	});
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
			return
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
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null);
	});
}