// contratosMantenedores_db_mysql
// Manejo de la tabla contratosMantenedores en la base de datos
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

// comprobarMantenedor
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarMantenedor(contratoMantenedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoMantenedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoMantenedor.hasOwnProperty("contratoMantenedorId"));
    comprobado = (comprobado && contratoMantenedor.hasOwnProperty("empresaId"));
    comprobado = (comprobado && contratoMantenedor.hasOwnProperty("clienteId"));
    return comprobado;
}


// getContratosMantenedores
// lee todos los registros de la tabla contratosMantenedores y
// los devuelve como una lista de objetos
module.exports.getContratosMantenedores = function(callback) {
    var connection = getConnection();
    var contratosMantenedores = null;
    sql = "SELECT cc.*, e.nombre AS empresa, m.nombre AS mantenedor";
    sql += " FROM contrato_mantenedor AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.clienteId";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        contratosMantenedores = result;
        callback(null, contratosMantenedores);
    });
}


// getContratoMantenedor
// busca  el contrato comercial con id pasado
module.exports.getContratoMantenedor = function(id, callback) {
    var connection = getConnection();
    var contratosMantenedores = null;
    sql = "SELECT cc.*, e.nombre AS empresa, m.nombre AS mantenedor";
    sql += " FROM contrato_mantenedor AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.clienteId";
    sql += " WHERE cc.contratoMantenedorId = ?";
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

// getContratoMantenedorMantenedorEmpresa
// Devuelve el contrato vigente para un mantenedor en una empresa
module.exports.getContratoMantenedorEmpresa = function(id, empresaId, callback) {
    var connection = getConnection();
    var contratosMantenedores = null;
    sql = "SELECT cc.*, e.nombre AS empresa, m.nombre AS mantenedor";
    sql += " FROM contrato_mantenedor AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN clientes AS m ON m.clienteId = cc.clienteId";
    sql += " WHERE cc.clienteId = ? AND cc.empresaId = ?";
    sql += " ORDER BY cc.fechaInicio DESC"
    sql = mysql.format(sql, [id, empresaId]);
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


// postContratoMantenedor
// crear en la base de datos el contrato comercial pasado
module.exports.postContratoMantenedor = function(contratoMantenedor, callback) {
    if (!comprobarMantenedor(contratoMantenedor)) {
        var err = new Error("El contrato comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    contratoMantenedor.contratoMantenedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_mantenedor SET ?";
    sql = mysql.format(sql, contratoMantenedor);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        contratoMantenedor.contratoMantenedorId = result.insertId;
        callback(null, contratoMantenedor);
    });
}

// putContratoMantenedor
// Modifica el contrato comercial según los datos del objeto pasao
module.exports.putContratoMantenedor = function(id, contratoMantenedor, callback) {
    if (!comprobarMantenedor(contratoMantenedor)) {
        var err = new Error("El contratoMantenedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoMantenedor.contratoMantenedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE contrato_mantenedor SET ? WHERE contratoMantenedorId = ?";
    sql = mysql.format(sql, [contratoMantenedor, contratoMantenedor.contratoMantenedorId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, contratoMantenedor);
    });
}

// deleteContratoMantenedor
// Elimina el contrato comercial con el id pasado
module.exports.deleteMantenedor = function(id, contratoMantenedor, callback) {
    var connection = getConnection();
    sql = "DELETE from contrato_mantenedor WHERE contratoMantenedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
