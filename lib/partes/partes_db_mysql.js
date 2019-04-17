// actuaciones_db_mysql
// Manejo de la tabla partes en la base de datos
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


// getPartes
// lee todos los registros de la tabla partes y
// los devuelve como una lista de objetos
module.exports.getPartes = function(callback){
	var connection = getConnection();
	var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, estp.nombre AS estadoProfNombre,";
    sql += " emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    
	//sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN estados_partes_profesional AS estp on estp.estadoParteProfesionalId = ac.estadoParteProfesionalId"
	connection.query(sql, function(err, result){
		if (err){
			callback(err, null);
			return;
		}
		partes = result;
		callback(null, partes);
		
	});	
	closeConnectionCallback(connection, callback);
}




// getParte
// busca  la parte con id pasado
module.exports.getParte = function(id, callback){
	var connection = getConnection();
    var partes = null;
    sql = "SELECT ac.*, pro.nombre AS nombreproveedor";
    sql += " FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
    //sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " WHERE parteId = ?";
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


// getParte
// busca  el parte con id pasado
module.exports.getParteServicio = function(id, callback){
	var connection = getConnection();
    var partes = null;
    sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
    sql += " tp.nombre AS tipoProfesionalNombre, emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
    //sql += " LEFT JOIN estados_presupuesto AS ep ON ep.estadoPresupuestoId = ac.estadoPresupuestoId";
	//sql += " LEFT JOIN estados_partes AS ea ON ea.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	sql += " WHERE ser.servicioId = ?";
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

// getPartesEstado
// busca  los partes con la id del esatdo pasada
module.exports.getPartesEstado = function(id, callback){
	var connection = getConnection();
    var partes = null;
	sql = "SELECT ac.*,  pro.nombre AS proveedorNombre, us.nombre as operadonNombre, est.nombre AS nombreEstado, est.estadoParteId,";
	sql += " tp.nombre AS tipoProfesionalNombre, cli.nombre AS nombreCliente, cli.proId, co.nombre AS comercialNombre, ser.direccionTrabajo,";
    sql += " emp.nombre as empresa, ser.horaEntrada FROM partes AS ac";
    sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = ac.proveedorId";
	sql += " LEFT JOIN usuarios as us on us.usuarioId = ac.operadorId";
	sql += " LEFT JOIN servicios AS ser ON ser.servicioId = ac.servicioId";
	sql += " LEFT JOIN empresas as emp ON emp.empresaId = ser.empresaId";
	sql += " LEFT JOIN estados_partes as est ON est.estadoParteId = ac.estadoParteId";
	
	sql += " LEFT JOIN clientes AS cli ON cli.clienteId = ser.clienteId";
	sql += " LEFT JOIN comerciales AS co ON co.comercialId = ser.agenteId";
	sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ac.tipoProfesionalId";
	if (id != 100) {
		sql += " WHERE ac.estadoParteId = ?";
		sql = mysql.format(sql, id);
	}
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


module.exports.getSiguienteNumero = function (servicioId,  numServicio, done) {
	var nuevonum;
	var con = getConnection();
	var sql = "SELECT COALESCE(MAX(num) + 1, 1) as mnum FROM partes";
	sql += " WHERE servicioId = ?";
	sql = mysql.format(sql, servicioId);
			con.query(sql, function (err, reg) {
					con.end();
					if (err) return done(err);
				  nuevonum = formateaNumero(reg);
				  var numResult = numServicio + '.' + nuevonum
					done(null, numResult);
			});
}
// postParte
// crear en la base de datos el parte pasado
module.exports.postParte = function (parte, callback){
	var connection = getConnection();
	var array = [];
	parte.parteId = 0; // fuerza el uso de autoincremento
	array = parte.numParte.split(".");
	parte.num = parseInt(array[1])// contador del numero de parte
	sql = "INSERT INTO partes SET ?";
	sql = mysql.format(sql, parte);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		parte.parteId = result.insertId;
		callback(null, parte);
	});
	closeConnectionCallback(connection, callback);
}

// putParte
// Modifica el parte según los datos del objeto pasao
module.exports.putParte = function(id, parte, callback){
    if (id != parte.parteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
	var connection = getConnection();
	sql = "UPDATE partes SET ? WHERE parteId = ?";
	sql = mysql.format(sql, [parte, parte.parteId]);
	connection.query(sql, function(err, result){
		if (err){
			callback(err);
			return;
		}
		callback(null, parte);
	});
	closeConnectionCallback(connection, callback);
}

// deleteParte
// Elimina el parte con el id pasado
module.exports.deleteParte = function(id, parte, callback){
	var connection = getConnection();
	sql = "DELETE from partes WHERE parteId = ?";
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

var formateaNumero = function(reg) {
	var nuevonum = 0;
	if(reg) {
		var s = "000" + reg[0].mnum;
		var nuevonum = s.substr(s.length - 3);
		return nuevonum
	}
	return nuevonum;
}