// empresas_db_mysql
// Manejo de la tabla empresas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require('../comun/comun.js');



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

// comprobarEmpresa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarEmpresa(empresa) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof empresa;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && empresa.hasOwnProperty("empresaId"));
    comprobado = (comprobado && empresa.hasOwnProperty("nombre"));
    comprobado = (comprobado && empresa.hasOwnProperty("nif"));
    return comprobado;
}


// getEmpresas
// lee todos los registros de la tabla empresas y
// los devuelve como una lista de objetos
module.exports.getEmpresas = function(callback) {
    var connection = getConnection();
    var empresas = null;
    sql = "SELECT * FROM empresas";
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        empresas = result;
        callback(null, empresas);
    });
}

// getEmpresasBuscar
// lee todos los registros de la tabla empresas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getEmpresasBuscar = function(nombre, callback) {
    var connection = getConnection();
    var empresas = null;
    var sql = "SELECT * FROM empresas";
    if (nombre !== "*") {
        sql = "SELECT * FROM empresas WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        empresas = result;
        callback(null, empresas);
    });
}

// getEmpresa
// busca  el empresa con id pasado
module.exports.getEmpresa = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM empresas WHERE empresaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getSeriesEmpresa
// busca  las series de facturación de una empresa
module.exports.getSeriesEmpresa = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT"; 
    sql += " empresaSerieId, es.departamentoId, es.tipoProyectoId, es.empresaId, dep.nombre AS departamentoNombre, tp.nombre AS tipoProyectoNombre,"
    sql += " es.serie_factura, es.serie_prefactura, emp.serieFacR";
    sql += " FROM empresas_series AS es";
    sql += " LEFT JOIN departamentos AS dep ON dep.departamentoId = es.departamentoId";
    sql += " LEFT JOIN tipos_proyecto AS tp ON tp.tipoProyectoId = es.tipoProyectoId";
    sql += " LEFT JOIN empresas as emp ON emp.empresaId = es.empresaId"
    sql += " WHERE es.empresaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getEmpresaSerie
// busca  un registro de la tabla empresas_series
module.exports.getEmpresaSerie = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT es.*"; 
    sql += " ,empresaSerieId, empresaId, dep.nombre AS departamentoNombre, tp.nombre AS tipoProyectoNombre,"
    sql += " es.serie_factura, es.serie_prefactura";
    sql += " FROM empresas_series AS es";
    sql += " LEFT JOIN departamentos AS dep ON dep.departamentoId = es.departamentoId";
    sql += " LEFT JOIN tipos_proyecto AS tp ON tp.tipoProyectoId = es.tipoProyectoId";
    sql += " WHERE es.empresaSerieId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getSeries
// busca  las series de una conta
module.exports.getSeries = function(conta, callback) {
    var connection = comun.getConnectionDb(conta);
    sql = "SELECT *, CONCAT(tiporegi, ' ',nomregis) AS nombre FROM contadores";
    connection.query(sql, function(err, result) {
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

// deleteEmpresa
// Elimina el empresa con el id pasado
module.exports.deleteEmpresaSerie = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from empresas_series WHERE empresaSerieId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// postEmpresa
// crear en la base de datos el empresa pasado
module.exports.postEmpresa = function(empresa, callback) {
    if (!comprobarEmpresa(empresa)) {
        var err = new Error("El empresa pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    empresa.empresaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO empresas SET ?";
    sql = mysql.format(sql, empresa);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        empresa.empresaId = result.insertId;
        callback(null, empresa);
    });
}


// postEmpresaSerie
module.exports.postEmpresaSerie = function(empresaSerie, callback) {
    var connection = getConnection();
    empresaSerie.empresaSerieId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO empresas_series SET ?";
    sql = mysql.format(sql, empresaSerie);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        empresaSerie.empresaSerieId = result.insertId;
        callback(null, empresaSerie);
    });
}

// putEmpresa
// Modifica el empresa según los datos del objeto pasao
module.exports.putEmpresa = function(id, empresa, callback) {
    if (!comprobarEmpresa(empresa)) {
        var err = new Error("El empresa pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != empresa.empresaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE empresas SET ? WHERE empresaId = ?";
    sql = mysql.format(sql, [empresa, empresa.empresaId]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, empresa);
    });
}

// putEmpresaSerie
// Modifica el empresa según los datos del objeto pasao
module.exports.putEmpresaSerie = function(empresaSerie, id, callback) {
    var connection = getConnection();
    sql = "UPDATE empresas_series SET ? WHERE empresaSerieId = ?";
    sql = mysql.format(sql, [empresaSerie, id]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, empresaSerie);
    });
}

// deleteEmpresa
// Elimina el empresa con el id pasado
module.exports.deleteEmpresa = function(id, empresa, callback) {
    var connection = getConnection();
    sql = "DELETE from empresas WHERE empresaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// getSeriesEmpresa
// busca  las cuentas de pago/cobro de una empresa
module.exports.getCuentasEmpresa = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT"; 
    sql += " es.empresaCuentapagoId ,es.empresaId, dep.nombre AS TipoFormaPagoNombre, es.cuentapago, es.tipoFormaPagoId"
    sql += " FROM empresas_cuentaspago  AS es";
    sql += " LEFT JOIN tipos_forma_pago AS dep ON dep.tipoFormaPagoId  = es.tipoFormaPagoId ";
    sql += " WHERE es.empresaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getEmpresaSerie
// busca  un registro de la tabla empresas_series
module.exports.getEmpresaCuenta = function(id, callback) {
    var connection = getConnection();
    sql = "SELECT"; 
    sql += " es.empresaCuentapagoId ,es.empresaId, dep.nombre AS TipoFormaPagoNombre, es.cuentapago, es.tipoFormaPagoId"
    sql += " FROM empresas_cuentaspago  AS es";
    sql += " LEFT JOIN tipos_forma_pago AS dep ON dep.tipoFormaPagoId  = es.tipoFormaPagoId ";
    sql += " WHERE es.empresaCuentapagoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getEmpresaCuentaConta
// busca  una cuentaContable en la contabilidad de la empresa
module.exports.getEmpresaCuentaConta = function(conta, codmacta, callback) {
    var connection = comun.getConnectionDb(conta);
    sql = "SELECT * from cuentas WHERE codmacta = ?"; 
    sql = mysql.format(sql, codmacta);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// postEmpresaCuentas
module.exports.postEmpresaCuentas = function(empresaCuentas, callback) {
    var connection = getConnection();
    empresaCuentas.empresaCuentapagoId  = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO empresas_cuentaspago  SET ?";
    sql = mysql.format(sql, empresaCuentas);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        empresaCuentas.empresaCuentapagoId  = result.insertId;
        callback(null, empresaCuentas);
    });
}

// putEmpresaCuentas
module.exports.putEmpresaCuentas = function(empresaCuentas, id, callback) {
    var connection = getConnection();
    sql = "UPDATE empresas_cuentaspago  SET ? WHERE empresaCuentapagoId = ?";
    sql = mysql.format(sql, [empresaCuentas, id]);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, empresaCuentas);
    });
}

// deleteEmpresaCuentas
module.exports.deleteEmpresaCuentas = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from empresas_cuentaspago  WHERE empresaCuentapagoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

