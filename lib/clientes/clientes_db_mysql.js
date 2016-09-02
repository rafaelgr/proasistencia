// clientes_db_mysql
// Manejo de la tabla clientes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var commun = require("../comun/comun");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// comprobarCliente
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarCliente(cliente) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof cliente;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && cliente.hasOwnProperty("clienteId"));
    comprobado = (comprobado && cliente.hasOwnProperty("nombre"));
    comprobado = (comprobado && cliente.hasOwnProperty("nif"));
    return comprobado;
}


// getClientes
// lee todos los registros de la tabla clientes y
// los devuelve como una lista de objetos
module.exports.getClientes = function (callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes ORDER BY nombre";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClientesActivos
// lee todos los registros de la tabla clientes y
// los devuelve como una lista de objetos
module.exports.getClientesActivos = function (callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT clienteId, nombre FROM clientes WHERE activa = 1 ORDER BY nombre";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

module.exports.getClienteComisionistas = function (id, callback) {
    var connection = comun.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += "  WHERE cc.clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getClientesAgente
// devuelve todos los clientes de un determiando agente
module.exports.getClientesAgente = function (id, callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT clienteId, nombre FROM clientes WHERE comercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClienetsActivosBuscar
module.exports.getClientesActivosBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE activa = 1"
    if (nombre !== "*") {
        sql += " AND c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getMantenedores
// lee todos los registros de la tabla mantenedores y

// los devuelve como una lista de objetos
module.exports.getMantenedores = function (callback) {
    var connection = comun.getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.tipoClienteId = 1";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getSoloCLientes
// lee todos los registros de la tabla clientes que no son mantenedores y
// los devuelve como una lista de objetos
module.exports.getSoloClientes = function (callback) {
    var connection = comun.getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.tipoClienteId = 0";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getClientesBuscar
// lee todos los registros de la tabla clientes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getClientesBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    if (nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getCliente
// busca  el cliente con id pasado
module.exports.getCliente = function (id, callback) {
    var connection = comun.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " WHERE c.clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postCliente
// crear en la base de datos el cliente pasado
module.exports.postCliente = function (cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    cliente.clienteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO clientes SET ?";
    sql = mysql.format(sql, cliente);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        cliente.clienteId = result.insertId;
        updateClienteConta(cliente, function (err) {
            if (err) return callback(err);
            callback(null, cliente);
        });
    });
}

// putCliente
// Modifica el cliente según los datos del objeto pasao
module.exports.putCliente = function (id, cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != cliente.clienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE clientes SET ? WHERE clienteId = ?";
    sql = mysql.format(sql, [cliente, cliente.clienteId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        updateClienteConta(cliente, function (err) {
            if (err) return callback(err);
            callback(null, cliente);
        });
    });
}

// deleteCliente
// Elimina el cliente con el id pasado
module.exports.deleteCliente = function (id, cliente, callback) {
    deleteClienteConta(id, function (err) {
        if (err) return callback(err);
        var connection = comun.getConnection();
        sql = "DELETE from clientes WHERE clienteId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            comun.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}


// transformaClienteConta
// transforma un objecto cliente de gestión a cliente de contabilidad
var transformaClienteConta = function (cliente, done) {
    var clienteConta = null;
    // asumimos que la cuentaContable es correcta
    // buscamos el código contable de la forma de pago 
    var connection = comun.getConnection();
    var sql = "SELECT * FROM formas_pago where formaPagoId = ?";
    sql = mysql.format(sql, cliente.formaPagoId);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ya podemos ir montando el cliente de contabilidad
        clienteConta = {
            codmacta: cliente.cuentaContable,
            nommacta: cliente.nombre,
            apudirec: 'S',
            model347: 1,
            razosoci: cliente.nombre,
            dirdatos: cliente.direccion,
            codposta: cliente.codPostal,
            despobla: cliente.poblacion,
            desprovi: cliente.provincia,
            nifdatos: cliente.nif,
            maidatos: cliente.email,
            obsdatos: cliente.observaciones,
            iban: cliente.iban,
            forpa: codigoContable
        };
        done(err, clienteConta);
    });
}


// updateClienteConta
// actualiza el cliente en todas las contabilidades
var updateClienteConta = function (cliente, done) {
    var clienteConta = null;
    // formatemos el cliente para contabilidad
    transformaClienteConta(cliente, function (err, c) {
        if (err) return done(err);
        clienteConta = c;
        // obtenemos la información general contable y seguimos desde ahí.
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var contasDb = [];
            result.contas.forEach(function (c) {
                contasDb.push(c.contabilidad);
            });
            // ya tenemos todas las contabilidades ahora montamos actualizamos
            // el cliente en todas ellas
            async.each(contasDb, function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                var sql = "INSERT INTO cuentas SET ? ON DUPLICATE KEY UPDATE ?";
                sql = mysq.format(sql, [clienteConta, clienteConta]);
                conn.query(sql, function (err) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
}

// deleteClienteConta
// elimina el cliente de todas las contabilidades usadas
var deleteClienteConta = function (id, done) {
    // debemos buscar el cliente para sacar su cuenta contable
    var codmacta = null;
    var connection = comun.getConnection();
    var sql = "SELECT * FROM clientes WHERE clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        codmacta = result[0].cuentaContable;
        // obtenemos la información general contable y seguimos desde ahí.
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var contasDb = [];
            result.contas.forEach(function (c) {
                contasDb.push(c.contabilidad);
            });
            // ya tenemos todas las contabilidades ahora borramos
            // el cliente en todas ellas
            async.each(contasDb, function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                var sql = "DELETE FORM cuentas WHERE codmacta = ?";
                sql = mysq.format(sql, codmacta);
                conn.query(sql, function (err) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
}