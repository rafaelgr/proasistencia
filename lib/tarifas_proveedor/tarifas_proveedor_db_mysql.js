// tarifas_db_mysql 
// Manejo de la tabla tarifas_proveedor en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var config2 = require("../../config.json");
var fs = require('fs');

var sql = "";
var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');

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

// comprobartarifa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTarifa(tarifa_proveedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifa_proveedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifa_proveedor.hasOwnProperty("tarifaProveedorId"));
    comprobado = (comprobado && tarifa_proveedor.hasOwnProperty("nombre"));
    return comprobado;
}


// getTarifasProveedor
// lee todos los registros de la tabla tarifas_proveedor que no estén tarifadosy
// los devuelve como una lista de objetos
module.exports.getTarifasProveedor = function (callback) {
    var connection = getConnection();
    var tarifas_proveedor = null;
    sql = "SELECT * FROM tarifas_proveedor";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        tarifas_proveedor = result;
        callback(null, tarifas_proveedor);
    });
}

// getTarifa
// busca  el tarifa_proveedor con id pasado
module.exports.getTarifaProveedor = function (id, callback) {
    var connection = getConnection();
    var tarifas_proveedor = null;
    sql = "SELECT  * FROM tarifas_proveedor";
    sql += " WHERE tarifaProveedorId = ?";
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






module.exports.getTarifasGrupo = function(grupoId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas_proveedor";
    sql += " WHERE grupoTarifaId = ?";
    sql = mysql.format(sql, grupoId);
    connection.query(sql, function (err, result){
        closeConnectionCallback(connection, callback);
        if(err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// postTarifa
// crear en la base de datos el tarifa_proveedor pasado
module.exports.postTarifaProveedor = function (tarifa_proveedor, callback) {
    if (!comprobarTarifa(tarifa_proveedor)) {
        var err = new Error("la tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifa_proveedor.tarifaProveedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tarifas_proveedor SET ?";
    sql = mysql.format(sql, tarifa_proveedor);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        tarifa_proveedor.tarifaProveedorId = result.insertId;
        callback(null, tarifa_proveedor);
    });
}

module.exports.postContabilizarTarifasProveedor = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "";
    sql = "SELECT * FROM empresas;";
    con.query(sql, function (err, empresas) {
        async.eachSeries(empresas, function (empresa, callback) {
            contabilizarEmpresa(dFecha, hFecha, empresa, function (err) {
                if (err) return callback(err);
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            done(null, 'OK');
        });
    });
}




// putTarifa
// Modifica el tarifa_proveedor según los datos del objeto pasao
module.exports.putTarifaProveedor = function (id, tarifa_proveedor, callback) {
    if (!comprobarTarifa(tarifa_proveedor)) {
        var err = new Error("El tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifa_proveedor.tarifaProveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas_proveedor SET ? WHERE tarifaProveedorId = ?";
    sql = mysql.format(sql, [tarifa_proveedor, tarifa_proveedor.tarifaProveedorId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifa_proveedor);
    });
}

// deleteTarifa
// Elimina el tarifa_proveedor con el id pasado
module.exports.deleteTarifaProveedor = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_proveedor WHERE tarifaProveedorId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteTarifasContrato
// Elimina todas las tarifas_proveedor pertenecientes a un contrato.
module.exports.deleteTarifasProveedorContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_proveedor WHERE contratoProveedorMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


/*
|---------------------------------------|
|                                       |
|  LINEAS TARIFAS                       |
|                                       |
|---------------------------------------|
*/


// comprobartarifaProveedorLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobartarifaProveedorLinea(tarifaProveedorLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifaProveedorLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifaProveedorLinea.hasOwnProperty("tarifaProveedorLineaId"));
    comprobado = (comprobado && tarifaProveedorLinea.hasOwnProperty("tarifaProveedorId"));
    comprobado = (comprobado && tarifaProveedorLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && tarifaProveedorLinea.hasOwnProperty("precioUnitario"));
    return comprobado;
}


// gettarifaProveedorLineas
// Devuelve todas las líneas de una tarifa_proveedor
module.exports.getTarifaProveedorLineas = function (id, callback) {
    var connection = getConnection();
    var tarifas_proveedor = null;
    sql = "SELECT CONCAT(a.nombre,' ( ',gr.nombre,' )') AS unidadConstructiva, tf.*, a.codigoReparacion FROM tarifas_proveedor_lineas AS tf";
    sql += " INNER JOIN articulos AS a ON a.articuloId = tf.articuloId";
    sql += " INNER JOIN grupo_articulo AS gr ON a.grupoArticuloId = gr.grupoArticuloId";
    sql += " WHERE tf.tarifaProveedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// gettarifaProveedorLinea
// Devuelve la línea de tarifa_proveedor solcitada por su id.
module.exports.getTarifaProveedorLinea = function (id, callback) {
    var connection = getConnection();
    var tarifas_proveedor = null;
    sql = "SELECT pfl.*, a.grupoArticuloId FROM tarifas_proveedor_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " WHERE pfl.tarifaProveedorLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getArticuloTarifa= function (articuloId, tarifaProveedorId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas_proveedor_lineas";
    sql += " WHERE articuloId = ?";
    sql += " AND tarifaProveedorId = ?";
    sql = mysql.format(sql, [articuloId, tarifaProveedorId]);
    connection.query(sql, function(err, result){
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })

}

// posttarifaProveedorLinea
// crear en la base de datos la linea de tarifa_proveedor pasada
module.exports.postTarifaProveedorLinea = function (tarifaProveedorLinea, callback) {
    if (!comprobartarifaProveedorLinea(tarifaProveedorLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifaProveedorLinea.tarifaProveedorLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tarifas_proveedor_lineas SET ?";
    sql = mysql.format(sql, tarifaProveedorLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaProveedorLinea);
    });
}

module.exports.postTarifaProveedorLineaMultiple = function (tarifaProveedorLinea, callback) {
    var connection = getConnection();
    sql = "INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId, articuloId, precioUnitario)";
    sql += " SELECT ?, articuloId, precioUnitario * ? AS nuevoPrecio FROM articulos"
    sql += " WHERE grupoArticuloId = ?"
    sql = mysql.format(sql, [tarifaProveedorLinea.tarifaProveedorId, tarifaProveedorLinea.porcentaje, tarifaProveedorLinea.grupoArticuloId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaProveedorLinea);
    });
}

module.exports.postTarifaProveedorLineaMultipleTodos= function(tarifaProveedorLinea, callback) {
    var connection = getConnection();
    sql = "INSERT INTO tarifas_proveedor_lineas (tarifaProveedorId, articuloId, precioUnitario)";
    sql += " SELECT ?, articuloId, precioUnitario * ? AS nuevoPrecio FROM articulos"
    sql = mysql.format(sql, [tarifaProveedorLinea.tarifaProveedorId, tarifaProveedorLinea.porcentaje, tarifaProveedorLinea.capitulo]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaProveedorLinea);
    });
}


// puttarifaProveedorLinea
// Modifica la linea de tarifa según los datos del objeto pasao
module.exports.putTarifaProveedorLinea = function (id, tarifaProveedorLinea, callback) {
    if (!comprobartarifaProveedorLinea(tarifaProveedorLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifaProveedorLinea.tarifaProveedorLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas_proveedor_lineas SET ? WHERE tarifaProveedorLineaId = ?";
    sql = mysql.format(sql, [tarifaProveedorLinea, tarifaProveedorLinea.tarifaProveedorLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaProveedorLinea);
    });
}

// deletetarifaProveedorLinea
// Elimina la linea de tarifa con el id pasado
module.exports.deleteTarifaProveedorLinea = function (id, tarifaProveedorLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_proveedor_lineas WHERE tarifaProveedorLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

