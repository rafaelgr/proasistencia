// proveedores_db_mysql
// Manejo de la tabla proveedores en la base de datos
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

// comprobarProveedor
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarProveedor(proveedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof proveedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && proveedor.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && proveedor.hasOwnProperty("nombre"));
    comprobado = (comprobado && proveedor.hasOwnProperty("nif"));
    return comprobado;
}


// getProveedores
// lee todos los registros de la tabla proveedores y
// los devuelve como una lista de objetos
module.exports.getProveedores = function(callback) {
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT * FROM proveedores";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

// getProveedoresBuscar
// lee todos los registros de la tabla proveedores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getProveedoresBuscar = function(nombre, callback) {
    var connection = getConnection();
    var proveedores = null;
    var sql = "SELECT * FROM proveedores";
    if (nombre !== "*") {
        sql = "SELECT * FROM proveedores WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

// getProveedor
// busca  el proveedor con id pasado
module.exports.getProveedor = function(id, callback) {
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT * FROM proveedores WHERE proveedorId = ?";
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


// postProveedor
// crear en la base de datos el proveedor pasado
module.exports.postProveedor = function(proveedor, callback) {
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    proveedor.proveedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO proveedores SET ?";
    sql = mysql.format(sql, proveedor);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        proveedor.proveedorId = result.insertId;
        callback(null, proveedor);
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedor = function(id, proveedor, callback) {
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != proveedor.proveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE proveedores SET ? WHERE proveedorId = ?";
    sql = mysql.format(sql, [proveedor, proveedor.proveedorId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, proveedor);
    });
}

// deleteProveedor
// Elimina el proveedor con el id pasado
module.exports.deleteProveedor = function(id, proveedor, callback) {
    var connection = getConnection();
    sql = "DELETE from proveedores WHERE proveedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
