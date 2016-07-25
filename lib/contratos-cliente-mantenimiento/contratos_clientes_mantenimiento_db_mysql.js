// contratosClientesMantenimiento_db_mysql
// Manejo de la tabla contratosClientesMantenimiento en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
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
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}

// comprobarContratoClienteMantenimiento
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarContratoClienteMantenimiento(contratoClienteMantenimiento) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoClienteMantenimiento;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("contratoClienteMantenimientoId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("empresaId"));
    comprobado = (comprobado && contratoClienteMantenimiento.hasOwnProperty("clienteId"));
    return comprobado;
}


// getContratosClienteMantenimiento
// lee todos los registros de la tabla contratosClientesMantenimiento y
// los devuelve como una lista de objetos
module.exports.getContratosClienteMantenimiento = function(callback) {
    var connection = getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, sc.nombre as subcliente";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS sc ON c.subClienteId = cc.clienteId";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        contratosClientesMantenimiento = result;
        callback(null, contratosClientesMantenimiento);
    });
}


// getContratoClienteMantenimiento
// busca  el contrato comercial con id pasado
module.exports.getContratoClienteMantenimiento = function(id, callback) {
    var connection = getConnection();
    var contratosClientesMantenimiento = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS cliente, sc.nombre AS subcliente";
    sql += " FROM contrato_cliente_mantenimiento AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN clientes AS sc ON sc.clienteId = cc.subClienteId";
    sql += " WHERE cc.contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postContratoClienteMantenimiento
// crear en la base de datos el contrato comercial pasado
module.exports.postContratoClienteMantenimiento = function(contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contrato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    contratoClienteMantenimiento.contratoClienteMantenimientoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_cliente_mantenimiento SET ?";
    sql = mysql.format(sql, contratoClienteMantenimiento);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        contratoClienteMantenimiento.contratoClienteMantenimientoId = result.insertId;
        callback(null, contratoClienteMantenimiento);
    });
}

// putContratoClienteMantenimiento
// Modifica el contrato comercial según los datos del objeto pasao
module.exports.putContratoClienteMantenimiento = function(id, contratoClienteMantenimiento, callback) {
    if (!comprobarContratoClienteMantenimiento(contratoClienteMantenimiento)) {
        var err = new Error("El contato pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoClienteMantenimiento.contratoClienteMantenimientoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE contrato_cliente_mantenimiento SET ? WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, [contratoClienteMantenimiento, contratoClienteMantenimiento.contratoClienteMantenimientoId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, contratoClienteMantenimiento);
    });
}

// deleteContratoClienteMantenimiento
// Elimina el contrato comercial con el id pasado
module.exports.deleteMantenedor = function(id, contratoClienteMantenimiento, callback) {
    var connection = getConnection();
    sql = "DELETE from contrato_cliente_mantenimiento WHERE contratoClienteMantenimientoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
