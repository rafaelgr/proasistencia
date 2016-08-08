// contratosComerciales_db_mysql
// Manejo de la tabla contratosComerciales en la base de datos
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
    connection.connect(function (err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

// comprobarComercial
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarComercial(contratoComercial) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof contratoComercial;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && contratoComercial.hasOwnProperty("contratoComercialId"));
    comprobado = (comprobado && contratoComercial.hasOwnProperty("empresaId"));
    comprobado = (comprobado && contratoComercial.hasOwnProperty("comercialId"));
    return comprobado;
}


// getContratosComerciales
// lee todos los registros de la tabla contratosComerciales y
// los devuelve como una lista de objetos
module.exports.getContratosComerciales = function (callback) {
    var connection = getConnection();
    var contratosComerciales = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS comercial";
    sql += " FROM contrato_comercial AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        contratosComerciales = result;
        callback(null, contratosComerciales);
    });
}

// getContratoComercial
// busca  el contrato comercial con id pasado
module.exports.getContratoComercial = function (id, callback) {
    var connection = getConnection();
    var contratosComerciales = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS comercial";
    sql += " FROM contrato_comercial AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId";
    sql += " WHERE cc.contratoComercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
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

// getContratosComercial
// busca los contratos de un comercial en concreto
module.exports.getContratosComercial = function (id, callback) {
    var connection = getConnection();
    var contratosComerciales = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS comercial";
    sql += " FROM contrato_comercial AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId";
    sql += " WHERE cc.comercialId = ?";
    sql += " ORDER BY fechaInicio DESC";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getContratoDeUnComercialEmpresa
// busca  el contrato comercial con id pasado
module.exports.getContratoComercialEmpresa = function (comercialId, empresaId, callback) {
    var connection = getConnection();
    var contratosComerciales = null;
    sql = "SELECT cc.*, e.nombre AS empresa, c.nombre AS comercial";
    sql += " FROM contrato_comercial AS cc";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = cc.empresaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = cc.comercialId";
    sql += " WHERE 1=1";
    if (comercialId) {
        sql += " AND cc.comercialId = ?";
        sql = mysql.format(sql, comercialId);
    }
    if (empresaId) {
        sql += " AND cc.empresaId = ?";
        sql = mysql.format(sql, empresaId);
    }
    sql += " ORDER BY cc.fechaInicio DESC";
    connection.query(sql, function (err, result) {
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

// postContratoComercial
// crear en la base de datos el contrato comercial pasado
module.exports.postContratoComercial = function (contratoComercial, callback) {
    if (!comprobarComercial(contratoComercial)) {
        var err = new Error("El contrato comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    contratoComercial.contratoComercialId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO contrato_comercial SET ?";
    sql = mysql.format(sql, contratoComercial);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        contratoComercial.contratoComercialId = result.insertId;
        callback(null, contratoComercial);
    });
}

// putContratoComercial
// Modifica el contrato comercial según los datos del objeto pasao
module.exports.putContratoComercial = function (id, contratoComercial, callback) {
    if (!comprobarComercial(contratoComercial)) {
        var err = new Error("El contratoComercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != contratoComercial.contratoComercialId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE contrato_comercial SET ? WHERE contratoComercialId = ?";
    sql = mysql.format(sql, [contratoComercial, contratoComercial.contratoComercialId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, contratoComercial);
    });
}

// deleteContratoComercial
// Elimina el contrato comercial con el id pasado
module.exports.deleteComercial = function (id, contratoComercial, callback) {
    var connection = getConnection();
    sql = "DELETE from contrato_comercial WHERE contratoComercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

/*-------------------------------------------------------------------
    Manejo de la generación de las prefacturas de 
    los contratos comerciales
---------------------------------------------------------------------*/
module.exports.creaPrefacturas = function (lista, callback) {
    var listaPrefacturas = []; // nueva lista a devolver    
    // la lista lleva prefacturas previas
    async.each(lista, function(pf,callback2){
        fnCreaUnaPrefactura(pf, function(err, prefactura){
            if (err) return callback3(err);
            listaPrefacturas.push(prefactura);
            callback2();            
        })
    }, function(err){
        if (err) return callback(err);
        callback(null, listaPrefacturas);
    })
}

var fnCreaUnaPrefactura = function (prefactura, callback) {
    var pf = prefactura;
    async.series({
        pfCabecera: function (cbk) {
            // Crear la cabecera

        },
        pfLineas: function (cbk) {
            // Crear las líneas
        },
        pfBases: function (cbk) {
            // Crear las bases
        }

    }, function (err, result) {

    });




    callback(null, pf);
};