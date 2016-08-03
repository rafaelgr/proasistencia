// grupo_grupoArticulo_db_mysql
// Manejo de la tabla  de grupos de grupo_articulo en la base de datos
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

// comprobarGrupoArticulo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarGrupoArticulo(grupoArticulo) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof grupoArticulo;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && grupoArticulo.hasOwnProperty("grupoArticuloId"));
    comprobado = (comprobado && grupoArticulo.hasOwnProperty("nombre"));
    return comprobado;
}


// getGrupoArticulos
// lee todos los registros de la tabla grupo_articulo y
// los devuelve como una lista de objetos
module.exports.getGrupoArticulos = function(callback) {
    var connection = getConnection();
    var grupo_articulo = null;
    sql = "SELECT * FROM grupo_articulo";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        grupos = result;
        callback(null, grupos);
    });
}

// getGrupoArticulosBuscar
// lee todos los registros de la tabla grupo_articulo cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getGrupoArticulosBuscar = function(nombre, callback) {
    var connection = getConnection();
    var grupo_articulo = null;
    var sql = "SELECT * FROM grupo_articulo";
    if (nombre !== "*") {
        sql = "SELECT * FROM grupo_articulo";
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

// getGrupoArticulo
// busca  el grupoArticulo con id pasado
module.exports.getGrupoArticulo = function(id, callback) {
    var connection = getConnection();
    var grupo_articulo = null;
    sql = "SELECT * FROM grupo_articulo";
    sql += "  WHERE grupoArticuloId = ?";
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


// postGrupoArticulo
// crear en la base de datos el grupoArticulo pasado
module.exports.postGrupoArticulo = function(grupoArticulo, callback) {
    if (!comprobarGrupoArticulo(grupoArticulo)) {
        var err = new Error("El grupo pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    grupoArticulo.grupoArticuloId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO grupo_articulo SET ?";
    sql = mysql.format(sql, grupoArticulo);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        grupoArticulo.grupoArticuloId = result.insertId;
        callback(null, grupoArticulo);
    });
}

// putGrupoArticulo
// Modifica el grupoGrupoArticulo según los datos del objeto pasao
module.exports.putGrupoArticulo = function(id, grupoArticulo, callback) {
    if (!comprobarArticulo(grupoArticulo)) {
        var err = new Error("El grupo pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != grupoArticulo.grupoArticuloId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE grupo_articulo SET ? WHERE grupoArticuloId = ?";
    sql = mysql.format(sql, [grupoArticulo, grupoArticulo.grupoArticuloId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, grupoArticulo);
    });
}

// deleteGrupoArticulo
// Elimina el grupoGrupoArticulo con el id pasado
module.exports.deleteGrupoArticulo = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from grupo_articulo WHERE grupoArticuloId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
