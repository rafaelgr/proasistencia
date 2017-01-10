// clientes_db_mysql
// Manejo de la tabla clientes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var clienteComisionistaDb = require("../clientes-comisionistas/clientes_comisionistas_db_mysql");
var com = require("../comun/comun");

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
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes ORDER BY nombre";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// nuevas busquedas en desplegables
module.exports.getClientesEnActivo = function(nombreABuscar, done){
    var con = com.getConnection();
    sql = "SELECT * FROM clientes WHERE activa = 1";
    if (nombreABuscar) {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function(err, clientes){
        if (err) return done(err);
        done(null, clientes);
    });
}

module.exports.getMantenedoresEnActivo = function(nombreABuscar, done){
    var con = com.getConnection();
    sql = "SELECT * FROM clientes WHERE activa = 1 AND tipoClienteId = 1";
    if (nombreABuscar) {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function(err, mantenedores){
        if (err) return done(err);
        done(null, mantenedores);
    });
}

// getClientesActivos
// lee todos los registros de la tabla clientes y
// los devuelve como una lista de objetos
module.exports.getClientesActivos = function (callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT clienteId, nombre FROM clientes WHERE activa = 1 ORDER BY nombre";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

module.exports.getClienteComisionistas = function (id, callback) {
    var connection = com.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT cc.*, c.nombre as cliente, co.nombre as comercial, co.proId as codigoComercial, tc.nombre as tipo";
    sql += " FROM clientes_comisionistas as cc";
    sql += " LEFT JOIN clientes as c ON c.clienteId = cc.clienteId";
    sql += " LEFT JOIN comerciales as co ON co.comercialId = cc.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = cc.comercialId"
    sql += "  WHERE cc.clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
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
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes WHERE comercialId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClienetsActivos
module.exports.getClientesActivosNombre = function (nombre, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE activa = 1"
    if (nombre !== "*") {
        sql += " AND c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
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
    var connection = com.getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.tipoClienteId = 1";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
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
    var connection = com.getConnection();
    var mantenedores = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.tipoClienteId = 0";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        mantenedores = result;
        callback(null, mantenedores);
    });
}

// getClientes
// lee todos los registros de la tabla clientes cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getClientes = function (nombre, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    if (nombre !== "*") {
        sql += " WHERE c.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    sql += " ORDER BY c.nombre";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClientes2
// dor de clientes por varios criterios.
// Código --> proId
// Nombre --> nombre
// NIF --> nif 
// Teléfono --> telefono1
// Dirección de trabajo --> direccion2
module.exports.getClientes2 = function (proId, nombre, nif, telefono1, direccion2, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE true";
    if (proId) {
        sql += " AND c.proId LIKE '%" + proId + "%'";
    }
    if (nombre) {
        sql += " AND c.nombre LIKE '%" + nombre + "%'";
    }
    if (nif) {
        sql += " AND c.nif LIKE '%" + nif + "%'";
    }
    if (telefono1) {
        sql += " AND c.telefono1 LIKE '%" + telefono1 + "%'";
    }
    if (direccion2) {
        sql += " AND c.direccion2 LIKE '%" + direccion2 + "%'";
    }
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        clientes = result;
        callback(null, clientes);
    });
}

// getClientesActivos2
// dor de clientes por varios criterios.
// Código --> proId
// Nombre --> nombre
// NIF --> nif 
// Teléfono --> telefono1
// Dirección de trabajo --> direccion2
module.exports.getClientesActivos2 = function (proId, nombre, nif, telefono1, direccion2, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proIdComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE true";
    if (proId) {
        sql += " AND c.proId LIKE '%" + proId + "%'";
    }
    if (nombre) {
        sql += " AND c.nombre LIKE '%" + nombre + "%'";
    }
    if (nif) {
        sql += " AND c.nif LIKE '%" + nif + "%'";
    }
    if (telefono1) {
        sql += " AND c.telefono1 LIKE '%" + telefono1 + "%'";
    }
    if (direccion2) {
        sql += " AND c.direccion2 LIKE '%" + direccion2 + "%'";
    }
    sql += " AND activa = 1";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
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
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.getClienteByProId = function (id, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.proId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.getMantenedorByProId = function (id, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.proId = ?";
    sql += " AND c.tipoClienteId = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getNuevoCodigo
// busca el siguiente código en la tabla
module.exports.getNuevoCodigo = function (callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT COALESCE(MAX(codigo) +1, 1) codigo FROM clientes";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}

// getClientesAmpliadoActivos
module.exports.getClientesAmpliadoActivos = function (done) {
    var con = com.getConnection();
    sql = "SELECT co.nombre AS agente, fp.nombre AS formaPago,";
    sql += " CONCAT(COALESCE(v1.nombre,''), ' ', COALESCE(cl.direccion,'')) AS dr1,";
    sql += " CONCAT(COALESCE(v2.nombre,''), ' ', COALESCE(cl.direccion2,'')) AS dr1,";
    sql += " mb.nombre AS motivoBaja,";
    sql += " cl.* ";
    sql += " FROM clientes AS cl";
    sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.comercialId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cl.formaPagoId";
    sql += " LEFT JOIN tipos_via AS v1 ON v1.tipoViaId = cl.tipoViaId";
    sql += " LEFT JOIN tipos_via AS v2 ON v2.tipoViaId = cl.tipoViaId2";
    sql += " LEFT JOIN motivos_baja AS mb ON mb.motivoBajaId = cl.motivoBajaId";
    sql += " WHERE cl.activa = 1";
    con.query(sql, function(err, clientes){
        com.closeConnection(con);
        if (err) return done(err);
        done(null, clientes);
    })
}


// getClientesAmpliadoTodos
module.exports.getClientesAmpliadoTodos = function (done) {
    var con = com.getConnection();
    sql = "SELECT co.nombre AS agente, fp.nombre AS formaPago,";
    sql += " CONCAT(COALESCE(v1.nombre,''), ' ', COALESCE(cl.direccion,'')) AS dr1,";
    sql += " CONCAT(COALESCE(v2.nombre,''), ' ', COALESCE(cl.direccion2,'')) AS dr1,";
    sql += " mb.nombre AS motivoBaja,";
    sql += " cl.* ";
    sql += " FROM clientes AS cl";
    sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.comercialId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cl.formaPagoId";
    sql += " LEFT JOIN tipos_via AS v1 ON v1.tipoViaId = cl.tipoViaId";
    sql += " LEFT JOIN tipos_via AS v2 ON v2.tipoViaId = cl.tipoViaId2";
    sql += " LEFT JOIN motivos_baja AS mb ON mb.motivoBajaId = cl.motivoBajaId";
    con.query(sql, function(err, clientes){
        com.closeConnection(con);
        if (err) return done(err);
        done(null, clientes);
    })
}


// postCliente
// crear en la base de datos el cliente pasado
module.exports.postCliente = function (cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = com.getConnection();
    cliente.clienteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO clientes SET ?";
    sql = mysql.format(sql, cliente);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        cliente.clienteId = result.insertId;
        updateComisionista(cliente.clienteId, function (err) {
            if (err) return callback(err);
            updateClienteConta(cliente, function (err) {
                if (err) return callback(err);
                callback(null, cliente);
            });
        })
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
    var connection = com.getConnection();
    sql = "UPDATE clientes SET ? WHERE clienteId = ?";
    sql = mysql.format(sql, [cliente, cliente.clienteId]);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
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
        var connection = com.getConnection();
        sql = "DELETE from clientes WHERE clienteId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            com.closeConnection(connection);
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
    var connection = com.getConnection();
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
    // Si no tiene cuenta contable no va a contabilidad+
    if (!cliente.cuentaContable) {
        return done(null, cliente);
    }
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
                var connection = com.getConnectionDb(conta);
                var sql = "INSERT INTO cuentas SET ? ON DUPLICATE KEY UPDATE ?";
                sql = mysql.format(sql, [clienteConta, clienteConta]);
                connection.query(sql, function (err) {
                    com.closeConnection(connection);
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
    // debemos  el cliente para sacar su cuenta contable
    var codmacta = null;
    var connection = com.getConnection();
    var sql = "SELECT * FROM clientes WHERE clienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        codmacta = result[0].cuentaContable;
        if (!codmacta) {
            // no hay nada que borrar
            return done();
        }
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
                var connection = com.getConnectionDb(conta);
                var sql = "DELETE FROM cuentas WHERE codmacta = ?";
                sql = mysql.format(sql, codmacta);
                connection.query(sql, function (err) {
                    com.closeConnection(connection);
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

// updateComisionista
// 
var updateComisionista = function (clienteId, done) {
    async.waterfall([
        // buscar el agente asociado al cliente
        function (callback) {
            var con = com.getConnection();
            var sql = "SELECT * FROM clientes WHERE clienteId = ?";
            sql = mysql.format(sql, clienteId);
            con.query(sql, function (err, res) {
                if (err) return callback(err);
                if (res.length == 0) return callback(null, null);
                callback(null, res[0].comercialId);
            });
        },
        // buscar el colaborador asociado al agente
        function (comercialId, callback) {
            if (!comercialId) return callback(null, null);
            var con = com.getConnection();
            var sql = "SELECT COALESCE(c2.comercialId,0) AS comercialId, COALESCE(c2.porComer, 0) AS porComer";
            sql += " FROM comerciales AS c1";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = c1.ascComercialId";
            sql += " WHERE c1.comercialId = ?";
            sql = mysql.format(sql, comercialId);
            con.query(sql, function (err, res) {
                if (err) return callback(err);
                if (res.length == 0) return callback(null, null);
                if (res[0].comercialId == 0) return callback(null, null);
                comercial = {
                    comercialId: res[0].comercialId,
                    porComer: res[0].porComer
                };
                callback(null, comercial);
            });
        },
        // crear un comisionista con los datos de colaborador
        function (comercial, callback) {
            if (!comercial) return callback(null, null);
            var clienteComisionista = {
                clienteComisionistaId: 0,
                clienteId: clienteId,
                comercialId: comercial.comercialId,
                porComer: comercial.porComer
            };
            clienteComisionistaDb.postClienteComisionista(clienteComisionista, function (err, res) {
                if (err) return callback(err);
                callback(null);
            });
        }
    ],
        function (err) {
            if (err) return done(err);
            done(null)
        })
}