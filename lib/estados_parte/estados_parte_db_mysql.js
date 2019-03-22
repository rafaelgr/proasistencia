// estado_estadoParte_db_mysql
// Manejo de la tabla  de estados de estados_partes en la base de datos
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

// comprobarEstadoParte
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEstadoParte(estadoParte) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof estadoParte;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && estadoParte.hasOwnProperty("estadoParteId"));
    comprobado = (comprobado && estadoParte.hasOwnProperty("nombre"));
    return comprobado;
}


// getEstadosParte
// lee todos los registros de la tabla estados_partes y
// los devuelve como una lista de objetos
module.exports.getEstadosParte = function(callback) {
    var connection = getConnection();
    var estados_partes = null;
    sql = "SELECT * FROM estados_partes";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadosParteBuscar
// lee todos los registros de la tabla estados_partes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEstadosParteBuscar = function(nombre, callback) {
    var connection = getConnection();
    var estados_partes = null;
    var sql = "SELECT * FROM estados_partes";
    if (nombre !== "*") {
        sql = "SELECT * FROM estados_partes";
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

// getEstadoParte
// busca  el estadoParte con id pasado
module.exports.getEstadoParte = function(id, callback) {
    var connection = getConnection();
    var estados_partes = null;
    sql = "SELECT * FROM estados_partes";
    sql += "  WHERE estadoParteId = ?";
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


// postEstadoParte
// crear en la base de datos el estadoParte pasado
module.exports.postEstadoParte = function(estadoParte, callback) {
    if (!comprobarEstadoParte(estadoParte)) {
        var err = new Error("El estado pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    estadoParte.estadoParteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO estados_partes SET ?";
    sql = mysql.format(sql, estadoParte);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        estadoParte.estadoParteId = result.insertId;
        callback(null, estadoParte);
    });
}

// putEstadoParte
// Modifica el estadoEstadoParte según los datos del objeto pasao
module.exports.putEstadoParte = function(id, estadoParte, callback) {
    if (!comprobarEstadoParte(estadoParte)) {
        var err = new Error("El estado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != estadoParte.estadoParteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var resultado = false;
    sql = "UPDATE estados_partes SET ? WHERE estadoParteId = ?";
    sql = mysql.format(sql, [estadoParte, estadoParte.estadoParteId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, estadoParte);
    });
}

// deleteEstadoParte
// Elimina el estadoEstadoParte con el id pasado
module.exports.deleteEstadoParte = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from estados_partes WHERE estadoParteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


