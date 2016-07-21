// Contiene librerias comunes que sirven de apoyo
// a otras librerías

//----------------------------
// MYSQL
// ----------------------------
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var config = require("../../configMySQL.json"); //  leer la configurción de MySQL
// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
module.exports.getConnection = function() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
module.exports.closeConnection = function(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}
// 
module.exports.closeConnectionCallback = function(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}

