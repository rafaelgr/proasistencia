// comerciales_db_mysql
// Manejo de la tabla comerciales en la base de datos
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
function comprobarComercial(comercial) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof comercial;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && comercial.hasOwnProperty("comercialId"));
    comprobado = (comprobado && comercial.hasOwnProperty("nombre"));
    comprobado = (comprobado && comercial.hasOwnProperty("nif"));
    return comprobado;
}


// getComerciales
// lee todos los registros de la tabla comerciales y
// los devuelve como una lista de objetos
module.exports.getComerciales = function (callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

// getAgentes
// lee todos los registros de la tabla comerciales 
// que son agentes (tipoComercialId = 1)  y los devuelve 
// como una lista de objetos
module.exports.getAgentes = function (callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId = 1";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}


// getComercialesBuscar
// lee todos los registros de la tabla comerciales cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getComercialesBuscar = function (nombre, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    if (nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

// getComercial
// busca  el comercial con id pasado
module.exports.getComercial = function (id, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"    
    sql += " WHERE c.comercialId = ?";
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

// getComercialByCodigo
// busca  el comercial con codigo pasado
module.exports.getComercialByCodigo = function (id, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"    
    sql += " WHERE c.proId = ?";
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


// postComercial
// crear en la base de datos el comercial pasado
module.exports.postComercial = function (comercial, callback) {
    if (!comprobarComercial(comercial)) {
        var err = new Error("El comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    comercial.comercialId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO comerciales SET ?";
    sql = mysql.format(sql, comercial);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        comercial.comercialId = result.insertId;
        callback(null, comercial);
    });
}

// putComercial
// Modifica el comercial según los datos del objeto pasao
module.exports.putComercial = function (id, comercial, callback) {
    if (!comprobarComercial(comercial)) {
        var err = new Error("El comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != comercial.comercialId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE comerciales SET ? WHERE comercialId = ?";
    sql = mysql.format(sql, [comercial, comercial.comercialId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, comercial);
    });
}

// deleteComercial
// Elimina el comercial con el id pasado
module.exports.deleteComercial = function (id, comercial, callback) {
    var connection = getConnection();
    sql = "DELETE from comerciales WHERE comercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// BuscarComision
// Busca la comisión según los datos pasados y la devuelve en el siguiente orden
// Si hay comision para el cliente
// Si hay comisión en su contrato comercial
// Comisión por defecto de su registro.
// -----------------------------------------------------
module.exports.buscarComision = function(comercialId, clienteId, empresaId, done){
    async.parallel(
        {
            cliente: function(callback){
                buscarComisionConCliente(comercialId, clienteId, function(err, res){
                    if (err) return callback(err);
                    callback(null, res);
                });
            },
            contrato: function(callback){
                buscarComisionConEmpresa(comercialId, empresaId, function(err, res){
                    if (err) callback(err);
                    callback(null, res);
                });
            },
            base: function(callback){
                buscarComisionBase(comercialId,function(err, res){
                    if (err) callback(err);
                    callback(null, res);
                });
            }
        },
        function(err, results){
            if (err) return done(err);
            if (results.cliente) return done(null, results.cliente);
            if (results.contrato) return done(null, results.contrato);
            if (results.base) return done(null, results.base);
            done(null, null);
        }
    );
}

var buscarComisionBase = function(comercialId, done){
    if (!comercialId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM comerciales WHERE comercialId = ?";
    sql = mysql.format(sql, comercialId);
    conn.query(sql, function(err, res){
        if (err) return done(err);
        if (res.length > 0 && res[0].porComer){
            done(err, res[0].porComer);
        }else{
            return done(null, null);
        }
    });
}

var buscarComisionConCliente = function(comercialId, clienteId, done){
    if (!comercialId || !clienteId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM clientes_comisionistas WHERE comercialId = ? AND clienteId = ?";
    sql = mysql.format(sql, [comercialId, clienteId]);
    conn.query(sql, function(err, res){
        if (err) return done(err);
        if (res.length > 0 && res[0].porComer){
            done(err, res[0].porComer);
        }else{
            return done(null, null);
        }
    });
}

var buscarComisionConEmpresa = function(comercialId, empresaId, done){
    if (!comercialId || !empresaId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM contrato_comercial WHERE comercialId = ? AND empresaId = ?";
    sql = mysql.format(sql, [comercialId, empresaId]);
    conn.query(sql, function(err, res){
        if (err) return done(err);
        if (res.length > 0 && res[0].comision){
            done(err, res[0].comision);
        }else{
            return done(null, null);
        }
    });
}

