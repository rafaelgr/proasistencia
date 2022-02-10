// reparaciones_db_mysql
// Manejo de la tabla reparaciones en la base de datos
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


// getReparaciones
// lee todos los registros de la tabla reparaciones y
// los devuelve como una lista de objetos
module.exports.getReparaciones = function(callback){
	var connection = getConnection();
	var reparaciones = null;
	sql = "SELECT re.*, CONCAT(ar.nombre, '(',ar.codigoReparacion,')') as articulo, tc.nombre as tarifaCliNombre, tic.nombre as tipoIvaClienteNombre,";
	sql += "  tp.nombre as tarifaProNombre, tip.nombre as tipoIvaProveedorNombre"
    sql += "  FROM reparaciones AS re";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = re.articuloId";
	sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = re.tarifaClienteId";
	sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = re.tarifaProveedorId"
    sql += " LEFT JOIN tipos_iva AS tic ON tic.tipoIvaId = re.tipoIvaCliente";
    sql += " LEFT JOIN tipos_iva AS tip ON tip.tipoIvaId = re.tipoIvaProveedor";
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err, null);
			return;
		}
		reparaciones = result;
		callback(null, reparaciones);
		
	});	
	
}




// getReparacion
// busca  la reparacion con id pasado
module.exports.getReparacion = function(id, callback){
	var connection = getConnection();
    var reparaciones = null;
	sql = "SELECT re.*, CONCAT(ar.nombre, '(',COALESCE(ar.codigoReparacion, ''),')') as articulo, tc.nombre as tarifaCliNombre, tic.nombre as tipoIvaClienteNombre,";
	sql += "  tp.nombre as tarifaProNombre, tip.nombre as tipoIvaProveedorNombre"
    sql += "  FROM reparaciones AS re";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = re.articuloId";
	sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = re.tarifaClienteId";
	sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = re.tarifaProveedorId"
    sql += " LEFT JOIN tipos_iva AS tic ON tic.tipoIvaId = re.tipoIvaCliente";
    sql += " LEFT JOIN tipos_iva AS tip ON tip.tipoIvaId = re.tipoIvaProveedor";
	sql += " WHERE reparacionId = ?";
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


// getReparacion
// busca  el reparacion con id pasado
module.exports.getReparacionesActuacion = function(id, callback){
	var connection = getConnection();
    var reparaciones = null;
    sql = "SELECT re.*, CONCAT(ar.nombre, '(',COALESCE(ar.codigoReparacion, ''),')') as articulo, tc.nombre as tarifaCliNombre, tic.nombre as tipoIvaClienteNombre,";
	sql += "  tp.nombre as tarifaProNombre, tip.nombre as tipoIvaProveedorNombre"
    sql += "  FROM reparaciones AS re";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = re.articuloId";
	sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = re.tarifaClienteId";
	sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = re.tarifaProveedorId"
    sql += " LEFT JOIN tipos_iva AS tic ON tic.tipoIvaId = re.tipoIvaCliente";
    sql += " LEFT JOIN tipos_iva AS tip ON tip.tipoIvaId = re.tipoIvaProveedor";
	sql += " WHERE actuacionId = ?";
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


// postReparacion
// crear en la base de datos el reparacion pasado
module.exports.postReparacion = function (reparacion, callback){
	var connection = getConnection();
	reparacion.reparacionId = 0; // fuerza el uso de autoincremento
	sql = "INSERT INTO reparaciones SET ?";
	sql = mysql.format(sql, reparacion);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		reparacion.reparacionId = result.insertId;
		callback(null, reparacion);
	});
	closeConnectionCallback(connection, callback);
}

// putReparacion
// Modifica el reparacion según los datos del objeto pasao
module.exports.putReparacion = function(id, reparacion, callback){
    if (id != reparacion.reparacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE reparaciones SET ? WHERE reparacionId = ?";
	sql = mysql.format(sql, [reparacion, reparacion.reparacionId]);
	connection.query(sql, function(err, result){
		closeConnectionCallback(connection, callback);
		if (err){
			callback(err);
			return;
		}
		callback(null, reparacion);
	});
}

// deleteReparacion
// Elimina el reparacion con el id pasado
module.exports.deleteReparacion = function(id, reparacion, callback){
	var connection = getConnection();
	sql = "DELETE from reparaciones WHERE reparacionId = ?";
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