// formaPagos_db_mysql
// Manejo de la tabla formaPagos en la base de datos
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

// comprobarFormaPago
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarFormaPago(formaPago) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof formaPago;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && formaPago.hasOwnProperty("formaPagoId"));
    comprobado = (comprobado && formaPago.hasOwnProperty("nombre"));
    comprobado = (comprobado && formaPago.hasOwnPropety("codigoContable"));
    return comprobado;
}


// getFormaPagos
// lee todos los registros de la tabla formaPagos y
// los devuelve como una lista de objetos
module.exports.getFormasPago = function(callback) {
    var connection = getConnection();
    var formaPagos = null;
    sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPago = result;
        callback(null, formasPago);
    });
}

// getFormaPagosBuscar
// lee todos los registros de la tabla formaPagos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getFormasPagoBuscar = function(nombre, callback) {
    var connection = getConnection();
    var formaPagos = null;
    var sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    if (nombre !== "*") {
        sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
        sql += "  WHERE fp.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPagos = result;
        callback(null, formasPagos);
    });
}

// getFormaPago
// busca  el formaPago con id pasado
module.exports.getFormaPago = function(id, callback) {
    var connection = getConnection();
    var formaPagos = null;
    sql = "SELECT fp.*, tfp.nombre AS tipoFormaPago FROM formas_pago AS fp LEFT JOIN tipos_forma_pago AS tfp ON tfp.tipoFormaPagoId = fp.tipoFormaPagoId";
    sql += "  WHERE formaPagoId = ?";
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


// postFormaPago
// crear en la base de datos el formaPago pasado
module.exports.postFormaPago = function(formaPago, callback) {
    if (!comprobarFormaPago(formaPago)) {
        var err = new Error("La forma de pago pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    formaPago.formaPagoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO formas_pago SET ?";
    sql = mysql.format(sql, formaPago);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        formaPago.formaPagoId = result.insertId;
        callback(null, formaPago);
    });
}

// putFormaPago
// Modifica el formaPago según los datos del objeto pasao
module.exports.putFormaPago = function(id, formaPago, callback) {
    if (!comprobarFormaPago(formaPago)) {
        var err = new Error("El forma de pago pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != formaPago.formaPagoId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE formas_pago SET ? WHERE formaPagoId = ?";
    sql = mysql.format(sql, [formaPago, formaPago.formaPagoId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, formaPago);
    });
}

// deleteFormaPago
// Elimina el formaPago con el id pasado
module.exports.deleteFormaPago = function(id, formaPago, callback) {
    var connection = getConnection();
    sql = "DELETE from formas_pago WHERE formaPagoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
