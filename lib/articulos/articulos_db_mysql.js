// articulo_db_mysql
// Manejo de la tabla articulos en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

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

// comprobarArticulo
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarArticulo(articulo) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof articulo;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && articulo.hasOwnProperty("articuloId"));
    comprobado = (comprobado && articulo.hasOwnProperty("nombre"));
    return comprobado;
}


// getArticulos
// lee todos los registros de la tabla articulos y
// los devuelve como una lista de objetos
module.exports.getArticulos = function (callback) {
    var connection = getConnection();
    var articulos = null;
    sql = "SELECT a.*, tiv.nombre AS tipoIVA, tiv.porcentaje AS porceIva  FROM articulos AS a LEFT JOIN tipos_iva AS tiv ON tiv.tipoIvaId = a.tipoIvaId";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPago = result;
        callback(null, formasPago);
    });
}

module.exports.getArticulosPorGrupo = function (grupoArticuloId, done) {
    var connection = getConnection();
    var articulos = null;
    sql = "SELECT a.*, tiv.nombre AS tipoIVA FROM articulos AS a LEFT JOIN tipos_iva AS tiv ON tiv.tipoIvaId = a.tipoIvaId";
    sql += " WHERE a.grupoArticuloId = ?";
    sql = mysql.format(sql, grupoArticuloId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        formasPago = result;
        done(null, formasPago);
    });
}



module.exports.getArticuloTipoProfesion = function (articuloId, done) {
    var connection = getConnection();
    sql = " SELECT tp.nombre AS profesion";
    sql += " FROM articulos AS art";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = art.tipoProfesionalId"
    sql += " WHERE articuloId = ?"
    sql = mysql.format(sql, articuloId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        tipoProfesional = result;
        done(null, tipoProfesional);
    });
}


// getArticulosBuscar
// lee todos los registros de la tabla articulos cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getArticulosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var articulos = null;
    var sql = "SELECT a.*, tiv.nombre AS tipoIVA FROM articulos AS a LEFT JOIN tipos_iva AS tiv ON tiv.tipoIvaId = a.tipoIvaId";
    if (nombre !== "*") {
        sql = "SELECT a.*, tiv.nombre AS tipoIVA FROM articulos AS a LEFT JOIN tipos_iva AS tiv ON tiv.tipoIvaId = a.tipoIvaId";
        sql += "  WHERE a.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPagos = result;
        callback(null, formasPagos);
    });
}

// getArticulo
// busca  el articulo con id pasado
module.exports.getArticulo = function (id, callback) {
    var connection = getConnection();
    var articulos = null;
    sql = "SELECT a.*,tiv.porcentaje, tiv.nombre AS tipoIVA FROM articulos AS a LEFT JOIN tipos_iva AS tiv ON tiv.tipoIvaId = a.tipoIvaId";
    sql += "  WHERE a.articuloId = ?";
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

module.exports.getArticulosConcat = function (callback){
    var connection = getConnection();    
    
    sql = "SELECT CONCAT(art.nombre,'----', COALESCE(tp.nombre, '')) AS nombre, art.articuloId";
    sql += " FROM articulos AS art";
    sql += " LEFT JOIN grupo_articulo AS cap ON cap.grupoArticuloId = art.grupoArticuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = art.unidadId";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = art.tipoProfesionalId";
    connection.query(sql, function(err, result){
        closeConnectionCallback(connection, callback);
        if(err) return callback (err, null);
        callback(null, result);
    });
}

module.exports.getArticuloPorCodigo = function (codigoReparacion, done) {
    var connection = getConnection();
    var articulos = null;
    sql = "SELECT * FROM articulos";
    sql += " WHERE codigoReparacion = ?";
    sql = mysql.format(sql, codigoReparacion);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        done(null, result[0]);
    });
}

 module.exports.getArticulosTarifas = function (clienteId, proveedorId, tipoProfesionalId, done) {
    var connection = getConnection();
    sql = "SELECT  tcl.tarifaClienteId, tc.nombre AS tarifaClienteNombre, ";
    sql += " tp.nombre AS tarifaProveedorNombre,tpl.tarifaProveedorId,ar.articuloId,";
    sql += " ar.codigoReparacion, u.abrev, ar.nombre,tcl.precioUnitario AS precioCliente,";
    sql += " tpl.precioUnitario AS precioProveedor";
    sql += " FROM articulos AS ar";
    sql += " LEFT JOIN  tarifas_cliente_lineas AS tcl ON tcl.articuloId = ar.articuloId";
    sql += " LEFT JOIN  tarifas_proveedor_lineas AS tpl ON tpl.articuloId = ar.articuloId";
    sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = tcl.tarifaClienteId";
    sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = tpl.tarifaProveedorId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = ar.unidadId";
    sql += " LEFT JOIN clientes AS cli ON cli.tarifaId = tcl.tarifaClienteId";
    sql +=" LEFT JOIN proveedores AS pro ON pro.tarifaId = tpl.tarifaProveedorId"
    sql += " WHERE cli.clienteId = ? AND pro.proveedorId = ?";
    sql = mysql.format(sql, [clienteId, proveedorId]);
    if(tipoProfesionalId) {
        sql += " AND ar.tipoProfesionalId = ?"
        sql = mysql.format(sql, tipoProfesionalId);
    }
    sql += " ORDER BY ar.codigoReparacion";
   
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        done(null, result);
    });
}



// postArticulo
// crear en la base de datos el articulo pasado
module.exports.postArticulo = function (articulo, callback) {
    if (!comprobarArticulo(articulo)) {
        var err = new Error("El articulo pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    articulo.articuloId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO articulos SET ?";
    sql = mysql.format(sql, articulo);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        articulo.articuloId = result.insertId;
        callback(null, articulo);
    });
}

// putArticulo
// Modifica el articulo según los datos del objeto pasao
module.exports.putArticulo = function (id, articulo, callback) {
    if (!comprobarArticulo(articulo)) {
        var err = new Error("El forma de pago pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != articulo.articuloId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE articulos SET ? WHERE articuloId = ?";
    sql = mysql.format(sql, [articulo, articulo.articuloId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, articulo);
    });
}

// deleteArticulo
// Elimina el articulo con el id pasado
module.exports.deleteArticulo = function (id, articulo, callback) {
    var connection = getConnection();
    sql = "DELETE from articulos WHERE articuloId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}
