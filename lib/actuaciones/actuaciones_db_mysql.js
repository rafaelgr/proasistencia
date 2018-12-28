// actuaciones_db_mysql
// Manejo de la tabla actuaciones en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL

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


// getActuaciones
// lee todos los registros de la tabla actuaciones y
// los devuelve como una lista de objetos
module.exports.getActuaciones = function(callback){
	var connection = getConnection();
	var actuaciones = null;
    sql = "SELECT ac.*, cli.nombre AS nombrecliente, pro.nombre AS nombreproveedor, ep.nombre AS nombreestpresupuesto,";
    sql += " ea.nombre AS nobreestactuacion FROM actuaciones AS ac";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ac.clienteId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    sql += " LEFT JOIN estados_actuacion AS ea ON ea.estadoActuacionId = ac.estadoActuacionId";
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		actuaciones = result;
		callback(null, actuaciones);
	});	
	closeConnectionCallback(connection, callback);
}




// getActuacion
// busca  el actuacion con id pasado
module.exports.getActuacion = function(id, callback){
	var connection = getConnection();
    var actuaciones = null;
    sql = "SELECT ac.*, cli.nombre AS nombrecliente, pro.nombre AS nombreproveedor, ep.nombre AS nombreestpresupuesto,";
    sql += " ea.nombre AS nobreestactuacion FROM actuaciones AS ac";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ac.clienteId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    sql += " LEFT JOIN estados_actuacion AS ea ON ea.estadoActuacionId = ac.estadoActuacionId";
	sql = " WHERE actuacionId = ?";
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


// getActuacion
// busca  el actuacion con id pasado
module.exports.getActuacionServicio = function(id, callback){
	var connection = getConnection();
    var actuaciones = null;
    sql = "SELECT ac.*, cli.nombre AS nombrecliente, pro.nombre AS nombreproveedor, ep.nombre AS nombreestpresupuesto,";
    sql += " ea.nombre AS nobreestactuacion FROM actuaciones AS ac";
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ac.clienteId";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    sql += " LEFT JOIN estados_actuacion AS ea ON ea.estadoActuacionId = ac.estadoActuacionId";
	sql += " WHERE servicioId = ?";
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


// postActuacion
// crear en la base de datos el actuacion pasado
module.exports.postActuacion = function (actuacion, callback){
	var connection = getConnection();
	actuacion.actuacionId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO actuaciones SET ?";
	sql = mysql.format(sql, actuacion);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		actuacion.actuacionId = result.insertId;
		callback(null, actuacion);
	});
	closeConnectionCallback(connection, callback);
}

// putActuacion
// Modifica el actuacion según los datos del objeto pasao
module.exports.putActuacion = function(id, actuacion, callback){
    if (id != actuacion.actuacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE actuaciones SET ? WHERE actuacionId = ?";
	sql = mysql.format(sql, [actuacion, actuacion.actuacionId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
		}
		callback(null, actuacion);
	});
	closeConnectionCallback(connection, callback);
}

// deleteActuacion
// Elimina el actuacion con el id pasado
module.exports.deleteActuacion = function(id, actuacion, callback){
	var connection = getConnection();
	sql = "DELETE from actuaciones WHERE actuacionId = ?";
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