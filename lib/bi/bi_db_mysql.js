// bi_db_mysql
// Manejo de la tabla bi en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

const Dotenv = require('dotenv');
Dotenv.config();

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
	connection.end(function (err) {
		if (err) {
			throw err;
		}
	});
}

function closeConnectionCallback(connection, callback) {
	connection.end(function (err) {
		if (err) callback(err);
	});
}

module.exports.getTabla = function (tabla, done) {
	var con = getConnection();
	sql = "SELECT * FROM " +  tabla;
	con.query(sql, function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}

module.exports.getClientesContrato = function (done) {
	var con = getConnection();
	sql = "SELECT * FROM clientes WHERE clienteId IN (SELECT clienteId FROM contratos)";
	con.query(sql, function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}

module.exports.getMantenedoresContrato = function (done) {
	var con = getConnection();
	sql = "SELECT * FROM clientes WHERE clienteId IN (SELECT mantenedorId FROM contratos)";
	con.query(sql, function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}

module.exports.getProveedoresFactura = function (done) {
	var con = getConnection();
	sql = "SELECT * FROM proveedores WHERE proveedorId IN (SELECT proveedorId FROM facprove)";
	con.query(sql, function (err, rows) {
		if (err) return done(err);
		done(null, rows);
	});
}