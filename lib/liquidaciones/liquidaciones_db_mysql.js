// liquidacion_db_mysql
// Manejo de la tabla liquidacion_comercial en la base de datos
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

// comprobarLiquidacion
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarLiquidacion(liquidacion) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof liquidacion;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && liquidacion.hasOwnProperty("liquidacionId"));
    return comprobado;
}


// getLiquidaciones
// lee todos los registros de la tabla liquidacion_comercial y
// los devuelve como una lista de objetos
module.exports.getLiquidaciones = function (callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    sql = "SELECT * FROM liquidacion_comercial";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPago = result;
        callback(null, formasPago);
    });
}

// getLiquidacionesBuscar
// lee todos los registros de la tabla liquidacion_comercial cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getLiquidacionesBuscar = function (nombre, callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    var sql = "SELECT * FROM liquidacion_comercial";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPagos = result;
        callback(null, formasPagos);
    });
}

// getLiquidacion
// busca  el liquidacion con id pasado
module.exports.getLiquidacion = function (id, callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    sql = "SELECT * FROM liquidacion_comercial as lc";
    sql += "  WHERE lc.liquidacionId = ?";
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


// postLiquidacion
// crear en la base de datos el liquidacion pasado
module.exports.postLiquidacion = function (liquidacion, callback) {
    if (!comprobarLiquidacion(liquidacion)) {
        var err = new Error("El liquidacion pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    liquidacion.liquidacionId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO liquidacion_comercial SET ?";
    sql = mysql.format(sql, liquidacion);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        liquidacion.liquidacionId = result.insertId;
        callback(null, liquidacion);
    });
}


// putLiquidacion
// Modifica el liquidacion según los datos del objeto pasao
module.exports.putLiquidacion = function (id, liquidacion, callback) {
    if (id != liquidacion.liquidacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE liquidacion_comercial SET ? WHERE liquidacionId = ?";
    sql = mysql.format(sql, [liquidacion, liquidacion.liquidacionId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, liquidacion);
    });
}

// deleteLiquidacion
// Elimina el liquidacion con el id pasado
module.exports.deleteLiquidacion = function (id, liquidacion, callback) {
    var connection = getConnection();
    sql = "DELETE from liquidacion_comercial WHERE liquidacionId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// postFacturaLiquidacion
module.exports.postFacturaLiquidacion = function (dFecha, hFecha, tipoComercial, comercialId, done) {
    var con = getConnection();
    con.beginTransaction(function (err) {
        if (err) return done(err);
        var sql = "SELECT f.facturaId, f.fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.costeproporcional,";
        sql += " cm.contratoClienteMantenimientoId, cm.referencia, cm.tipoMantenimientoId,";
        sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porComer,";
        sql += " cm.comercialId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.manPorComer AS porAgente,";
        sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesortecnico, manComercial,";
        sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesortecnico, segComercial";
        sql += " FROM facturas AS f";
        sql += " LEFT JOIN contrato_cliente_mantenimiento AS cm ON cm.contratoClienteMantenimientoId = f.contratoClienteMantenimientoId";
        sql += " LEFT JOIN contrato_cliente_mantenimiento_comisionistas AS cmc ON cmc.contratoClienteMantenimientoId = cm.contratoClienteMantenimientoId";
        sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId";
        sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
        sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.comercialId";
        sql += " WHERE f.fecha <= ? AND f.fecha >= ?"
        sql = mysql.format(sql, [dFecha, hFecha]);
        // hay que revisar los criterios de búsqueda
        if (tipoComercial) {
            if (tipoComercial == 1) {
                sql += " AND c2.tipoComercial = " + tipoComercial;
            } else {
                sql += " AND c.tipoComercial = " + tipoComercial;
            }
        }
        if (comercialId) {
            sql += " AND c.comercialId = " + comercialId;
        }
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err) { done(err) });
            if (err.length == 0) {
                // la consulta no ha devuelto registros
                return con.rollback(function (err) { done(new Error('No hay facturas con estos criterios')) });
            }
            con.commit(function (err) {
                if (err) return con.rollback(function (err) { done(err) });
                done(null); // todo correcto
            });
        })
    });
}

var fnProcesarFacturasLiquidacion = function(fs){
    var ls = [];
    // vamos a crear una lista de objetos con dos propiedades que a su vez son objetos
    // origen: lo que se ha leido de la base de datos
    // registro: lo que se guardará como registro de liquidación
    fs.forEach(function(f){
        var l = {
            origen: f,
            registro: {
            }
        }
        ls.push(l);
    })
    return ls;
}