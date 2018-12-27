// estado_estadoPresupuesto_db_mysql
// Manejo de la tabla  de estados de estados_presupuesto en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

var com = require("../comun/comun");//conexiones con ariconta

//  leer la configurción de MySQL

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

// comprobarEstadoPresupuesto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEstadoPresupuesto(estadoPresupuesto) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof estadoPresupuesto;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && estadoPresupuesto.hasOwnProperty("estadoPresupuestoId"));
    comprobado = (comprobado && estadoPresupuesto.hasOwnProperty("nombre"));
    return comprobado;
}


// getEstadosPresupuesto
// lee todos los registros de la tabla estados_presupuesto y
// los devuelve como una lista de objetos
module.exports.getEstadosPresupuesto = function(callback) {
    var connection = getConnection();
    var estados_presupuesto = null;
    sql = "SELECT * FROM estados_presupuesto";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        estados = result;
        callback(null, estados);
    });
}

// getEstadosPresupuestoBuscar
// lee todos los registros de la tabla estados_presupuesto cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEstadosPresupuestoBuscar = function(nombre, callback) {
    var connection = getConnection();
    var estados_presupuesto = null;
    var sql = "SELECT * FROM estados_presupuesto";
    if (nombre !== "*") {
        sql = "SELECT * FROM estados_presupuesto";
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

// getEstadoPresupuesto
// busca  el estadoPresupuesto con id pasado
module.exports.getEstadoPresupuesto = function(id, callback) {
    var connection = getConnection();
    var estados_presupuesto = null;
    sql = "SELECT * FROM estados_presupuesto";
    sql += "  WHERE estadoPresupuestoId = ?";
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


// postEstadoPresupuesto
// crear en la base de datos el estadoPresupuesto pasado
module.exports.postEstadoPresupuesto = function(estadoPresupuesto, callback) {
    if (!comprobarEstadoPresupuesto(estadoPresupuesto)) {
        var err = new Error("El estado pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    estadoPresupuesto.estadoPresupuestoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO estados_presupuesto SET ?";
    sql = mysql.format(sql, estadoPresupuesto);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        estadoPresupuesto.estadoPresupuestoId = result.insertId;
        callback(null, estadoPresupuesto);
    });
}

// putEstadoPresupuesto
// Modifica el estadoEstadoPresupuesto según los datos del objeto pasao
module.exports.putEstadoPresupuesto = function(id, estadoPresupuesto, callback) {
    if (!comprobarEstadoPresupuesto(estadoPresupuesto)) {
        var err = new Error("El estado pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != estadoPresupuesto.estadoPresupuestoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    var resultado = false;
    sql = "UPDATE estados_presupuesto SET ? WHERE estadoPresupuestoId = ?";
    sql = mysql.format(sql, [estadoPresupuesto, estadoPresupuesto.estadoPresupuestoId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, estadoPresupuesto);
    });
}

// deleteEstadoPresupuesto
// Elimina el estadoEstadoPresupuesto con el id pasado
module.exports.deleteEstadoPresupuesto = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from estados_presupuesto WHERE estadoPresupuestoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


