// estado_estadoParteProfesional_db_mysql
// Manejo de la tabla  de estados de estados_partes_profesional en la base de datos
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

// comprobarEstadoParteProfesional
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEstadoParteProfesional(estadoParteProfesional) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof estadoParteProfesional;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && estadoParteProfesional.hasOwnProperty("estadoParteProfesionalId"));
    comprobado = (comprobado && estadoParteProfesional.hasOwnProperty("nombre"));
    return comprobado;
}


// getEstadosParte
// lee todos los registros de la tabla estados_partes_profesional y
// los devuelve como una lista de objetos
module.exports.getEstadosParteProfesional = function(callback) {
    var connection = getConnection();
    var estados_partes_profesional = null;
    sql = "SELECT * FROM estados_partes_profesional";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}


module.exports.getEstadosParteProfesionalMovil = function(cerrado, callback) {
    var connection = getConnection();
    var estados = "1,2,3,4,5,8"
    sql = "SELECT * FROM estados_partes_profesional";
    if(cerrado = 'false') sql += " WHERE estadoParteProfesionalId IN (" + estados + " )";
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
// lee todos los registros de la tabla estados_partes_profesional cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEstadosParteProfesionalBuscar = function(nombre, callback) {
    var connection = getConnection();
    var estados_partes_profesional = null;
    var sql = "SELECT * FROM estados_partes_profesional";
    if (nombre !== "*") {
        sql = "SELECT * FROM estados_partes_profesional";
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

// getEstadoParteProfesional
// busca  el estadoParteProfesional con id pasado
module.exports.getEstadoParteProfesional = function(id, callback) {
    var connection = getConnection();
    var estados_partes_profesional = null;
    sql = "SELECT * FROM estados_partes_profesional";
    sql += "  WHERE estadoParteProfesionalId = ?";
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


// postEstadoParteProfesional
// crear en la base de datos el estadoParteProfesional pasado
module.exports.postEstadoParteProfesional = function(estadoParteProfesional, callback) {
    if (!comprobarEstadoParteProfesional(estadoParteProfesional)) {
        var err = new Error("El estado pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    estadoParteProfesional.estadoParteProfesionalId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO estados_partes_profesional SET ?";
    sql = mysql.format(sql, estadoParteProfesional);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        estadoParteProfesional.estadoParteProfesionalId = result.insertId;
        callback(null, estadoParteProfesional);
    });
}

// putEstadoParteProfesional
// Modifica el estadoEstadoParteProfesional según los datos del objeto pasao
module.exports.putEstadoParteProfesional = function(id, estadoParteProfesional, callback) {
    if (!comprobarEstadoParteProfesional(estadoParteProfesional)) {
        var err = new Error("El estado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != estadoParteProfesional.estadoParteProfesionalId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var resultado = false;
    sql = "UPDATE estados_partes_profesional SET ? WHERE estadoParteProfesionalId = ?";
    sql = mysql.format(sql, [estadoParteProfesional, estadoParteProfesional.estadoParteProfesionalId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, estadoParteProfesional);
    });
}

// deleteEstadoParteProfesional
// Elimina el estadoEstadoParteProfesional con el id pasado
module.exports.deleteEstadoParteProfesional = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from estados_partes_profesional WHERE estadoParteProfesionalId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


