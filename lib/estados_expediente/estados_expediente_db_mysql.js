// estado_estadoExpediente_db_mysql
// Manejo de la tabla  de estados de estados_expediente en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

var com = require("../comun/comun");//conexiones con ariconta


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

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}

// comprobarEstadoExpediente
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEstadoExpediente(estadoExpediente) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof estadoExpediente;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && estadoExpediente.hasOwnProperty("estadoExpedienteId"));
    comprobado = (comprobado && estadoExpediente.hasOwnProperty("nombre"));
    return comprobado;
}


// getEstadosExpediente
// lee todos los registros de la tabla estados_expediente y
// los devuelve como una lista de objetos
module.exports.getEstadosExpediente = function(callback) {
    var connection = getConnection();
    var estados_expediente = null;
    sql = "SELECT * FROM estados_expediente";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadosExpedienteBuscar
// lee todos los registros de la tabla estados_expediente cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEstadosExpedienteBuscar = function(nombre, callback) {
    var connection = getConnection();
    var estados_expediente = null;
    var sql = "SELECT * FROM estados_expediente";
    if (nombre !== "*") {
        sql = "SELECT * FROM estados_expediente";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadoExpediente
// busca  el estadoExpediente con id pasado
module.exports.getEstadoExpediente = function(id, callback) {
    var connection = getConnection();
    var estados_expediente = null;
    sql = "SELECT * FROM estados_expediente";
    sql += "  WHERE estadoExpedienteId = ?";
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


// postEstadoExpediente
// crear en la base de datos el estadoExpediente pasado
module.exports.postEstadoExpediente = function(estadoExpediente, callback) {
    if (!comprobarEstadoExpediente(estadoExpediente)) {
        var err = new Error("El estado pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    estadoExpediente.estadoExpedienteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO estados_expediente SET ?";
    sql = mysql.format(sql, estadoExpediente);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        estadoExpediente.estadoExpedienteId = result.insertId;
        callback(null, estadoExpediente);
    });
}

// putEstadoExpediente
// Modifica el estadoEstadoExpediente según los datos del objeto pasao
module.exports.putEstadoExpediente = function(id, estadoExpediente, callback) {
    if (!comprobarEstadoExpediente(estadoExpediente)) {
        var err = new Error("El estado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != estadoExpediente.estadoExpedienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var resultado = false;
    sql = "UPDATE estados_expediente SET ? WHERE estadoExpedienteId = ?";
    sql = mysql.format(sql, [estadoExpediente, estadoExpediente.estadoExpedienteId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, estadoExpediente);
    });
}

// deleteEstadoExpediente
// Elimina el estadoEstadoExpediente con el id pasado
module.exports.deleteEstadoExpediente = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from estados_expediente WHERE estadoExpedienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


