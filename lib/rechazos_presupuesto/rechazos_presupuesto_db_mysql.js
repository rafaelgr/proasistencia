// rechazo_rechazoPresupuesto_db_mysql
// Manejo de la tabla  de rechazos de rechazos_presupuesto en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL

//  leer la configurción de .env
var config = require('dotenv');
config.config();
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

// comprobarRechazoPresupuesto
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarRechazoPresupuesto(rechazoPresupuesto) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof rechazoPresupuesto;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && rechazoPresupuesto.hasOwnProperty("rechazoPresupuestoId"));
    comprobado = (comprobado && rechazoPresupuesto.hasOwnProperty("nombre"));
    return comprobado;
}


// getRechazosPresupuesto
// lee todos los registros de la tabla rechazos_presupuesto y
// los devuelve como una lista de objetos
module.exports.getRechazosPresupuesto = function(callback) {
    var connection = getConnection();
    sql = "SELECT * FROM rechazos_presupuesto";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        rechazos = result;
        callback(null, rechazos);
    });
}

// getRechazosPresupuestoBuscar
// lee todos los registros de la tabla rechazos_presupuesto cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getRechazosPresupuestoBuscar = function(nombre, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM rechazos_presupuesto";
    if (nombre !== "*") {
        sql = "SELECT * FROM rechazos_presupuesto";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        rechazos = result;
        callback(null, rechazos);
    });
}

// getRechazoPresupuesto
// busca  el rechazoPresupuesto con id pasado
module.exports.getRechazoPresupuesto = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM rechazos_presupuesto";
    sql += "  WHERE rechazoPresupuestoId = ?";
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


// postRechazoPresupuesto
// crear en la base de datos el rechazoPresupuesto pasado
module.exports.postRechazoPresupuesto = function(rechazoPresupuesto, callback) {
    if (!comprobarRechazoPresupuesto(rechazoPresupuesto)) {
        var err = new Error("El rechazo pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    rechazoPresupuesto.rechazoPresupuestoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO rechazos_presupuesto SET ?";
    sql = mysql.format(sql, rechazoPresupuesto);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        rechazoPresupuesto.rechazoPresupuestoId = result.insertId;
        callback(null, rechazoPresupuesto);
    });
}

// putRechazoPresupuesto
// Modifica el rechazoRechazoPresupuesto según los datos del objeto pasao
module.exports.putRechazoPresupuesto = function(id, rechazoPresupuesto, callback) {
    if (!comprobarRechazoPresupuesto(rechazoPresupuesto)) {
        var err = new Error("El rechazo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != rechazoPresupuesto.rechazoPresupuestoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE rechazos_presupuesto SET ? WHERE rechazoPresupuestoId = ?";
    sql = mysql.format(sql, [rechazoPresupuesto, rechazoPresupuesto.rechazoPresupuestoId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, rechazoPresupuesto);
    });
}

// deleteRechazoPresupuesto
// Elimina el rechazoRechazoPresupuesto con el id pasado
module.exports.deleteRechazoPresupuesto = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from rechazos_presupuesto WHERE rechazoPresupuestoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


