// grupo_grupoTarifa_db_mysql
// Manejo de la tabla  de grupos de grupo_tarifa en la base de datos
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

// comprobarGrupoTarifa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarGrupoTarifa(grupoTarifa) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof grupoTarifa;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && grupoTarifa.hasOwnProperty("grupoTarifaId"));
    comprobado = (comprobado && grupoTarifa.hasOwnProperty("nombre"));
    return comprobado;
}


// getGrupoTarifas
// lee todos los registros de la tabla grupo_tarifa y
// los devuelve como una lista de objetos
module.exports.getGrupoTarifas = function(callback) {
    var connection = getConnection();
    var grupo_tarifa = null;
    sql = "SELECT * FROM grupo_tarifa";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        grupos = result;
        callback(null, grupos);
    });
}

// getGrupoTarifasBuscar
// lee todos los registros de la tabla grupo_tarifa cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getGrupoTarifasBuscar = function(nombre, callback) {
    var connection = getConnection();
    var grupo_tarifa = null;
    var sql = "SELECT * FROM grupo_tarifa";
    if (nombre !== "*") {
        sql = "SELECT * FROM grupo_tarifa";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        grupos = result;
        callback(null, grupos);
    });
}

// getGrupoTarifa
// busca  el grupoTarifa con id pasado
module.exports.getGrupoTarifa = function(id, callback) {
    var connection = getConnection();
    var grupo_tarifa = null;
    sql = "SELECT * FROM grupo_tarifa";
    sql += "  WHERE grupoTarifaId = ?";
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


// postGrupoTarifa
// crear en la base de datos el grupoTarifa pasado
module.exports.postGrupoTarifa = function(grupoTarifa, callback) {
    if (!comprobarGrupoTarifa(grupoTarifa)) {
        var err = new Error("El grupo pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    grupoTarifa.grupoTarifaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO grupo_tarifa SET ?";
    sql = mysql.format(sql, grupoTarifa);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        grupoTarifa.grupoTarifaId = result.insertId;
        callback(null, grupoTarifa);
    });
}

// putGrupoTarifa
// Modifica el grupoGrupoTarifa según los datos del objeto pasao
module.exports.putGrupoTarifa = function(id, grupoTarifa, callback) {
    if (!comprobarTarifa(grupoTarifa)) {
        var err = new Error("El grupo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != grupoTarifa.grupoTarifaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE grupo_tarifa SET ? WHERE grupoTarifaId = ?";
    sql = mysql.format(sql, [grupoTarifa, grupoTarifa.grupoTarifaId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, grupoTarifa);
    });
}

// deleteGrupoTarifa
// Elimina el grupoGrupoTarifa con el id pasado
module.exports.deleteGrupoTarifa = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from grupo_tarifa WHERE grupoTarifaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
