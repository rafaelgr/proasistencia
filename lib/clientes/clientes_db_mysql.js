// clientes_db_mysql
// Manejo de la tabla clientes en la base de datos
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

// comprobarCliente
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarCliente(cliente) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof cliente;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && cliente.hasOwnProperty("clienteId"));
    comprobado = (comprobado && cliente.hasOwnProperty("nombre"));
    comprobado = (comprobado && cliente.hasOwnProperty("nif"));
    return comprobado;
}


// getClientes
// lee todos los registros de la tabla clientes y
// los devuelve como una lista de objetos
module.exports.getClientes = function(callback) {
    var connection = getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes ORDER BY nombre";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClientesActivos
// lee todos los registros de la tabla clientes y
// los devuelve como una lista de objetos
module.exports.getClientesActivos = function(callback) {
    var connection = getConnection();
    var clientes = null;
    sql = "SELECT clienteId, nombre FROM clientes WHERE activa = 1 ORDER BY nombre";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClienetsActivosBuscar
module.exports.getClientesActivosBuscar = function(nombre, callback) {
    var connection = getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE activa = 1"
    if (nombre !== "*") {
        sql += " AND c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getMantenedores
// lee todos los registros de la tabla mantenedores y
// los devuelve como una lista de objetos
module.exports.getMantenedores = function(callback) {
    var connection = getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.tipoClienteId = 1";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getSoloCLientes
// lee todos los registros de la tabla clientes que no son mantenedores y
// los devuelve como una lista de objetos
module.exports.getSoloClientes = function(callback) {
    var connection = getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.tipoClienteId = 0";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getClientesBuscar
// lee todos los registros de la tabla clientes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getClientesBuscar = function(nombre, callback) {
    var connection = getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    if (nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getCliente
// busca  el cliente con id pasado
module.exports.getCliente = function(id, callback) {
    var connection = getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.clienteId = ?";
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


// postCliente
// crear en la base de datos el cliente pasado
module.exports.postCliente = function(cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    cliente.clienteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO clientes SET ?";
    sql = mysql.format(sql, cliente);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        cliente.clienteId = result.insertId;
        callback(null, cliente);
    });
}

// putCliente
// Modifica el cliente según los datos del objeto pasao
module.exports.putCliente = function(id, cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != cliente.clienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE clientes SET ? WHERE clienteId = ?";
    sql = mysql.format(sql, [cliente, cliente.clienteId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, cliente);
    });
}

// deleteCliente
// Elimina el cliente con el id pasado
module.exports.deleteCliente = function(id, cliente, callback) {
    var connection = getConnection();
    sql = "DELETE from clientes WHERE clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
