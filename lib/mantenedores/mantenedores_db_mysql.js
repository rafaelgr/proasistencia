// mantenedores_db_mysql
// Manejo de la tabla mantenedores en la base de datos
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
function comprobarMantenedor(mantenedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof mantenedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && mantenedor.hasOwnProperty("mantenedorId"));
    comprobado = (comprobado && mantenedor.hasOwnProperty("nombre"));
    comprobado = (comprobado && mantenedor.hasOwnProperty("nif"));
    return comprobado;
}


// getMantenedores
// lee todos los registros de la tabla mantenedores y
// los devuelve como una lista de objetos
module.exports.getMantenedores = function(callback) {
    var connection = getConnection();
    var mantenedores = null;
    sql = "SELECT * FROM mantenedores";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getMantenedoresBuscar
// lee todos los registros de la tabla mantenedores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getMantenedoresBuscar = function(nombre, callback) {
    var connection = getConnection();
    var mantenedores = null;
    var sql = "SELECT * FROM mantenedores";
    if (nombre !== "*") {
        sql = "SELECT * FROM mantenedores WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getMantenedor
// busca  el mantenedor con id pasado
module.exports.getMantenedor = function(id, callback) {
    var connection = getConnection();
    var mantenedores = null;
    sql = "SELECT * FROM mantenedores WHERE mantenedorId = ?";
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


// postMantenedor
// crear en la base de datos el mantenedor pasado
module.exports.postMantenedor = function(mantenedor, callback) {
    if (!comprobarMantenedor(mantenedor)) {
        var err = new Error("El mantenedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    mantenedor.mantenedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO mantenedores SET ?";
    sql = mysql.format(sql, mantenedor);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        mantenedor.mantenedorId = result.insertId;
        callback(null, mantenedor);
    });
}

// putMantenedor
// Modifica el mantenedor según los datos del objeto pasao
module.exports.putMantenedor = function(id, mantenedor, callback) {
    if (!comprobarMantenedor(mantenedor)) {
        var err = new Error("El mantenedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != mantenedor.mantenedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE mantenedores SET ? WHERE mantenedorId = ?";
    sql = mysql.format(sql, [mantenedor, mantenedor.mantenedorId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, mantenedor);
    });
}

// deleteMantenedor
// Elimina el mantenedor con el id pasado
module.exports.deleteMantenedor = function(id, mantenedor, callback) {
    var connection = getConnection();
    sql = "DELETE from mantenedores WHERE mantenedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
