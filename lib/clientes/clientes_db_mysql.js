// clientes_db_mysql
// Manejo de la tabla clientes en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var clienteComisionistaDb = require("../clientes-comisionistas/clientes_comisionistas_db_mysql");
var com = require("../comun/comun");
const { nextTick } = require("process");
const { truncateSync } = require("fs");


//  leer la configurción de MySQL

var sql = "";

const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}


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

//nueva busqueda, devuelve todos los clientes
module.exports.getTodosClientes = function(done){
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT clienteId, nombre FROM clientes ORDER BY nombre LIMIT 10";
    connection.query(sql, function(err, result){
        com.closeConnection(connection);
        if (err) return done(err);
        return done(null, result);
    });
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
        con.end();
        if (err) return done(err);
        done(null, clientes);
    });
}

module.exports.getMantenedoresEnActivo = function(nombreABuscar, done){
    var con = com.getConnection();
    sql = "SELECT *, clienteId AS mantenedorId FROM clientes WHERE activa = 1 AND tipoClienteId = 1";
    if (nombreABuscar) {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function(err, mantenedores){
        con.end();
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
    sql = "SELECT * FROM clientes WHERE activa = 1 ORDER BY  proId";
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
    sql = "SELECT * FROM clientes WHERE comercialId = ? ORDER BY nombre";
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

// getClientesAgente
// devuelve todos los clientes de un determiando agente
module.exports.getClientesAgenteActivos = function (id, callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes WHERE comercialId = ? and activa = 1 ORDER BY proId";
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

// getClientesAgente
// devuelve todos los clientes de un determiando agente
module.exports.getClientesAgenteConNombre = function (nombre, id,callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT * FROM clientes WHERE nombre LIKE '%"+nombre+"%' AND comercialId = ?";
    sql = mysql.format(sql, [id]);
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
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial, CONCAT(c.nombre, ' --- ', c.cuentaContable) AS nomconcat";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE c.activa = 1"
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
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial, CONCAT(c.nombre, ' --- ', c.cuentaContable) AS nomconcat";
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
module.exports.getClientes2 = function (proId, nombre, nif, telefono1, direccion2, cuentaContable ,callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercialc, c.nombreComercial as nomcom, tv.nombre AS tipoViaOfertasNombre, cc.nombre AS nombreAgente";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " LEFT JOIN tipos_via as tv ON tv.tipoViaId = c.tipoViaIdOfertas";
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
    if (cuentaContable) {
        sql += " AND c.cuentaContable LIKE '%" + cuentaContable + "%'";
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
module.exports.getClientesActivos2 = function (proId, nombre, nif, telefono1, direccion2, cuentaContable,callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT c.*, tc.nombre as tipo, cc.proId as codigoComercial, c.nombreComercial as nomcom, tv.nombre AS tipoViaOfertasNombre, cc.nombre AS nombreAgente";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " LEFT JOIN tipos_via as tv ON tv.tipoViaId = c.tipoViaIdOfertas";
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
    if (cuentaContable) {
        sql += " AND c.cuentaContable LIKE '%" + cuentaContable + "%'";
    }
    sql += " AND c.activa = 1";
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
    sql = "SELECT c.*,";
    sql += " tc.nombre as tipo,";
    sql += " cc.proId as codigoComercial,";
    sql += " cc.nombre as nombreAgente,";
    sql += " fp.nombre AS nomForpa,";
    sql += " cc2.nombre AS colaboradorNombre,";
    sql += " c.nombreComercial as nomcom,";
    sql += " tf.nombre AS tarifaNombre,";
    sql += " COALESCE(tv1.nombre, '') AS tipoViaFiscal,";
    sql += " COALESCE(tv2.nombre, '')  AS tipoViaTrabajo,";
    sql += " COALESCE(tv3.nombre, '') AS tipoViaPostal,";
    sql += " COALESCE(tv4.nombre, '') AS tipoViaOfertasNombre,"
    sql += " mb.nombre AS motivoBaja";
    sql += " FROM clientes as c ";
    sql += " LEFT JOIN tipos_clientes as tc ON tc.tipoClienteId = c.tipoClienteId";
    sql += " LEFT JOIN comerciales as cc ON cc.comercialId = c.comercialId";
    sql += " LEFT JOIN comerciales as cc2 ON cc2.comercialId = c.colaboradorId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = c.formaPagoId";
    sql += " LEFT JOIN tarifas_cliente AS tf ON tf.tarifaClienteId = c.tarifaId";
    sql += " LEFT JOIN tipos_via AS tv1 ON tv1.tipoViaId = c.tipoViaId";
    sql += " LEFT JOIN tipos_via AS tv2 ON tv2.tipoViaId = c.tipoViaId2";
    sql += " LEFT JOIN tipos_via AS tv3 ON tv3.tipoViaId = c.tipoViaId3";
    sql += " LEFT JOIN tipos_via AS tv4 ON tv4.tipoViaId = c.tipoViaIdOfertas";
    sql += " LEFT JOIN motivos_baja AS mb ON mb.motivoBajaId = c.motivoBajaId";
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
    sql = "SELECT COALESCE(MAX(codigo) + 1, 1) codigo FROM clientes WHERE codigo < 999999";
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

//getProId
module.exports.getProId = function (callback) {
    var connection = com.getConnection();
    var clientes = null;
    sql = "SELECT proId ";
    sql += " FROM clientes";
    
    
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postCliente
// crear en la base de datos el cliente pasado
module.exports.postCliente = function (cliente, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = com.getConnection();
    connection.beginTransaction(function (err) {
        if (err) return callback(err);   
        cliente.clienteId = 0; // fuerza el uso de autoincremento
        sql = "INSERT INTO clientes SET ?";
        sql = mysql.format(sql, cliente);
        connection.query(sql, function (err, result) {  
            if (err) return connection.rollback(function () { callback(err); });   
            connection.commit(function (err) {
                if (err) return connection.rollback(function () { callback(err) });
                cliente.clienteId = result.insertId;
                cliente.method = "POST";
                updateClienteConta(cliente, null, function (err) {
                    if (err) return connection.rollback(function () { callback(err); });
                    com.closeConnection(connection);
                    callback(null, cliente);
                });
            });
        });
    });
}

// postCliente
// crear en la base de datos el cliente pasado
module.exports.postClienteNuevo = async (cliente) => {
        let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                if (!comprobarCliente(cliente)) {
                    throw new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
                }
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                    cliente.clienteId = 0; // fuerza el uso de autoincremento
                    sql = "INSERT INTO clientes SET ?";
                    sql = mysql.format(sql, cliente);
                    let [result] = await connection.query(sql);
                            cliente.clienteId = result.insertId;
                            cliente.method = "POST";
                            updateClienteContaNuevo(cliente, null, connection)
                            .then( (result) => {
                                connection.commit();
                                connection.end();
                                resolve(cliente)
                            })
                            .catch ((err) => {
                                if(connection) {
                                    if (!connection.connection._closing) {
        
                                        connection.rollback();
                                        connection.end();
                                        reject(err);
                                    }    
                                   
                                } else {
                                    reject (err);
                                }
                            })
            }catch(e) {
                if(connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    } 
                }
                return reject (e);
            }
        });
}

// putCliente
// Modifica el cliente según los datos del objeto pasao
module.exports.putCliente = function (id, cliente, cuentaContable, callback) {
    if (!comprobarCliente(cliente)) {
        var err = new Error("El cliente pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != cliente.clienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = com.getConnection();
    connection.beginTransaction(function (err) {
        sql = "UPDATE clientes SET ? WHERE clienteId = ?";
        sql = mysql.format(sql, [cliente, cliente.clienteId]);
        connection.query(sql, function (err, result) {
            if (err) return connection.rollback(function () { callback(err); });
            updateClienteConta(cliente, cuentaContable, function (err) {
                if (err) return connection.rollback(function () { callback(err); });
                connection.commit(function (err) {
                    if (err) return connection.rollback(function () { callback(err) });
                    com.closeConnection(connection);
                    callback(null, cliente);
                })
            });
        });
    });
}

// putClienteDesdeAgente
// Modifica los  clientes de una gente según los datos del objeto pasao
module.exports.putClienteDesdeAgente = function (agenteId, cliente, callback) {
    var connection = com.getConnection();
    connection.beginTransaction(function (err) {
        sql = "UPDATE clientes SET ? WHERE comercialId = ?";
        sql = mysql.format(sql, [cliente, agenteId]);
        connection.query(sql, function (err, result) {
            if (err) return connection.rollback(function () { callback(err); });
            updateClienteConta(cliente, true, function (err) {
                if (err) return callback(err);
                connection.commit(function (err) {
                    if (err) return connection.rollback(function () { callback(err) });
                    com.closeConnection(connection);
                    callback(null, cliente);
                });
            });
        });
    });
}

// putClienteLogin
module.exports.putClienteLogin = function (clienteId, cliente, callback) {
    var connection = com.getConnection();
        sql = "UPDATE clientes SET ? WHERE clienteId = ?";
        sql = mysql.format(sql, [cliente, clienteId]);
        connection.query(sql, function (err, result) {
            com.closeConnection(connection);
            if (err) return callback(err);
            callback(null, result);
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
        connection.end();
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ya podemos ir montando el cliente de contabilidad
        clienteConta = {
            codmacta: cliente.cuentaContable,
            nommacta: cliente.nombre,
            apudirec: 'S',
            razosoci: cliente.nombreComercial,
            dirdatos: cliente.direccion,
            codposta: cliente.codPostal,
            despobla: cliente.poblacion,
            desprovi: cliente.provincia,
            nifdatos: cliente.nif,
            maidatos: cliente.emailFacturas,
            obsdatos: cliente.observaciones,
            iban: cliente.iban,
            forpa: codigoContable
        };
        if(!clienteConta.razosoci) clienteConta.razosoci = cliente.nombre;
        delete cliente.method;
        done(err, clienteConta);
    });
}


// updateClienteConta
// actualiza el cliente en todas las contabilidades
var updateClienteConta = function (cliente, cuentaContable, done) {
    var clienteConta = null;
    var nomConta = "";
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
            //comprobamos que la cuenta contable existe antes de crearla
            if(!cuentaContable) {
                async.each(contasDb, function (conta, callback) {
                    var connection = com.getConnectionDb(conta);
                    var sql = "SELECT * FROM cuentas WHERE codmacta = ?";
                    sql = mysql.format(sql, clienteConta.codmacta);
                    connection.query(sql, function (err, result) {
                        com.closeConnection(connection);
                        if (result.length > 0) {
                            nomConta = asignaNobreConta(conta);
                            try{
                                throw new Error("La cuenta contable " +  clienteConta.codmacta + " ya existe en la contabilidad de la empresa " + nomConta + 
                                " El cliente no se ha creado");
                            }catch(err){
                                return callback(err);
                            }
                        } else {
                            callback()
                        }
                    });
                }, function (err) {
                    if (err) return done(err);
                    // ya tenemos todas las contabilidades ahora montamos actualizamos
                    // el cliente en todas ellas
                    async.each(contasDb, function (conta, callback) {
                        var connection = com.getConnectionDb(conta);
                        clienteConta.model347 =  1;
                        var sql = "INSERT INTO cuentas SET ?";
                        sql = mysql.format(sql, clienteConta);
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
            } else {
                // ya tenemos todas las contabilidades ahora montamos
                    // el cliente en todas ellas

                    //primero comprobamos el 347 en las posibles cuentas existentes y que coincida en todas las contabilidades
                    var model347 = [];
                    async.each(contasDb, function (conta, callback) {
                        var connection = com.getConnectionDb(conta);
                        var sql = "SELECT * FROM cuentas WHERE codmacta = ?";
                        sql = mysql.format(sql, clienteConta.codmacta);
                        connection.query(sql, function (err, result) {
                            com.closeConnection(connection);
                            if (result.length > 0) {
                                model347.push(result[0].model347);
                                return callback();
                            } else {
                                callback()
                            }
                        });
                    }, function (err) {
                        if (err) return done(err);
                        //miramos si hay algun 347 a 1
                        var m = 0;
                        if( model347.length == 0) {
                            m = 1
                        } else {
                            for(var i = 1; i< model347.length; i++) {
                                if(model347[i] == 1) {
                                    m = 1;
                                    break;
                                }
                            }
                        }
                       
                        async.each(contasDb, function (conta, callback2) {
                            delete clienteConta.model347;
                            var connection = com.getConnectionDb(conta);
                            var sql = "UPDATE cuentas SET ? WHERE codmacta = ?";
                            sql = mysql.format(sql, [clienteConta, clienteConta.codmacta]);
                            connection.query(sql, function (err, result) {
                                com.closeConnection(connection);
                                if (err) return callback2(err);
                                if(result.affectedRows == 0) {
                                    var connection2 = com.getConnectionDb(conta);
                                    clienteConta.model347 =  m;
                                    var sql2 = "INSERT INTO cuentas SET ?";
                                    sql2 = mysql.format(sql2, clienteConta);
                                    connection2.query(sql2, function (err, result) {
                                        com.closeConnection(connection2);
                                        if (err) return callback2(err);
                                        callback2();
                                    })
                                } else {
                                    callback2();
                                }
                            });
                        }, function (err) {
                            if (err) return done(err);
                            done();
                        });
                        
                    });
            }
      
            });
        });
    }

    // updateClienteConta
// actualiza el cliente en todas las contabilidades
var updateClienteContaNuevo = async (cliente, cuentaContable, connection) => {
    return new Promise(async (resolve, reject) => {
        try {
            var clienteConta = null;
            var nomConta = "";
            // Si no tiene cuenta contable no va a contabilidad
            if (!cliente.cuentaContable) {
                return done(err, null);
            }
            // formatemos el cliente para contabilidad
            transformaClienteConta(cliente, function (err, c) {
                if (err) return reject(err);
             
                clienteConta = c;
                // obtenemos la información general contable y seguimos desde ahí.
                contabilidadDb.getInfContable(async (err, result) => {
                    try {
                        if (err) throw new Error(err);
                        var infContable = result;
                        var contasDb = [];
                        result.contas.forEach(function (c) {
                            contasDb.push(c.contabilidad);
                        });
                        //comprobamos que la cuenta contable existe antes de crearla
                        if(!cuentaContable) {
                            for(let conta of contasDb){ 
                                var sql = "SELECT * FROM " + conta + ".cuentas WHERE codmacta = ?";
                                sql = mysql.format(sql, clienteConta.codmacta);
                                let [result] = await connection.query(sql);
                                    if (result.length > 0) {
                                        nomConta = asignaNobreConta(conta);
                                        throw new Error("La cuenta contable " +  clienteConta.codmacta + " ya existe en la contabilidad de la empresa " + nomConta + 
                                        " El cliente no se ha creado");
                                        //return reject(err);
                                    } 
                            }
                            for(let conta of contasDb){ 
                                 // ya tenemos todas las contabilidades ahora montamos actualizamos
                                // el cliente en todas ellas
                                    clienteConta.model347 =  1;
                                    var sql = "INSERT INTO " + conta + ".cuentas SET ?";
                                    sql = mysql.format(sql, clienteConta);
                                    let [result2] = await connection.query(sql);
                            }
                            resolve(cliente)
                          
                               
                        } else {
                            // ya tenemos todas las contabilidades ahora montamos
                            // el cliente en todas ellas
                            for(let conta of contasDb){ 
                                delete clienteConta.model347;
                                var sql = "UPDATE " + conta + ".cuentas SET ? WHERE codmacta = ?";
                                sql = mysql.format(sql, [clienteConta, clienteConta.codmacta]);
                                let [result3] = await connection.query(sql);
                                if(result3.affectedRows == 0) {
                                    clienteConta.model347 =  1;
                                    sql = "INSERT INTO " + conta + ".cuentas SET ?";
                                    sql = mysql.format(sql, clienteConta);
                                    let [result4] = await connection.query(sql); 
                                }
                            }
                            resolve(cliente);
    
                        }
                    }catch(e) {
                    return reject(e);
                    }
                });
            
            });
        } catch(e) {
            return reject (e);
        }
    
    });
}
           
    var asignaNobreConta = function(conta) {
        switch(conta) {
            case "ariconta11":
                nomConta = "PROASISTENCIA, S.L.";
                break;
                
            case "ariconta12":
            nomConta = "ROMÁN ALONSO GARCÍA";
            break;
    
            case "ariconta13":
            nomConta = "FONDOGAR S.L.";
            break;
    
            case "ariconta14":
            nomConta = "GRUPO INMOBILIARIO METROPOLITANO S.A.";
            break;
    
            case "ariconta15":
            nomConta = "REABITA OBRAS DE REHABILITACIÓN, S.L.";
            break;
    
            case "ariconta16":
            nomConta = "SIERRA DEL GUADARRAMA C.B.";
            break;
    
            case "ariconta17":
            nomConta = "ADMINISTRADORES DE FINCAS REDFINCAS S.L.";
            break;
    
            case "ariconta18":
            nomConta = "REPARALAR - CLAUDIA ALONSO GOMEZ";
            break;
    
            case "ariconta19":
            nomConta = "PROYECTA MEDIACIÓN EN INGENIERÍA Y ARQUITECTURA S.L.";
            break;
    
            case "ariconta21":
            nomConta = "RENTAVIVA, S.L..";
        }
    
        return nomConta;
    
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
        connection.end();
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


//FUNCIONES RELACIONADAS CON LA TABLE CLIENTES_AGENTES

module.exports.getClientesAgentes = function (clienteId, callback) {
    var connection = com.getConnection();
    var clientesAgentes = null;
    sql = "SELECT ca.*, co.nombre  FROM clientes_agentes AS ca"
    sql += " INNER JOIN comerciales AS co ON co.comercialId = ca.comercialId WHERE clienteId = ?";
    sql += " ORDER BY ca.fechaCambio DESC";
    sql = mysql.format(sql, clienteId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });

}

//devuelve un registro determinado de la table clientes_agentes
module.exports.getClientesAgenteUnico = function (clienteAgenteId, callback) {
    var connection = com.getConnection();
    var clientesAgentes = null;
    sql = "SELECT ca.*, co.nombre, co.porComer FROM clientes_agentes AS ca"
    sql += " INNER JOIN comerciales AS co ON co.comercialId = ca.comercialId WHERE clienteAgenteId = ?";
    sql += " ORDER BY ca.fechaCambio DESC";
    sql = mysql.format(sql, clienteAgenteId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });

}


module.exports.postCambiaAgente = function (clienteAgente, callback) {
    var connection = com.getConnection();
    clienteAgente.clienteAgenteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO clientes_agentes SET ?";
    sql = mysql.format(sql, clienteAgente);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null, clienteAgente);
    });
}

module.exports.deleteClienteAgente = function (id, callback) {
    var connection = com.getConnection();
    sql = "DELETE from clientes_agentes WHERE clienteAgenteId = ?";
    sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            com.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
}

module.exports.getPrecioUnitario = function (id, codigoReparacion, callback) {
    var connection = com.getConnection();
    var sql = "SELECT tcl.precioUnitario AS precioCliente";
    sql += " FROM articulos AS ar";
    sql += " LEFT JOIN tarifas_cliente_lineas AS tcl ON tcl.articuloId = ar.articuloId";
    sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = tcl.tarifaClienteId";
    sql += " LEFT JOIN clientes AS cli ON cli.tarifaId = tc.tarifaClienteId"
    sql += "  WHERE clienteId = ? AND ar.codigoReparacion = ?";
    sql = mysql.format(sql, [id, codigoReparacion]);
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

module.exports.getPrecioUnitarioPorArticuloId = function (clienteId, articuloId, callback) {
    var connection = com.getConnection();
    var sql = "SELECT tcl.precioUnitario AS precioCliente";
    sql += " FROM articulos AS ar";
    sql += " LEFT JOIN tarifas_cliente_lineas AS tcl ON tcl.articuloId = ar.articuloId";
    sql += " LEFT JOIN tarifas_cliente AS tc ON tc.tarifaClienteId = tcl.tarifaClienteId";
    sql += " LEFT JOIN clientes AS cli ON cli.tarifaId = tc.tarifaClienteId"
    sql += "  WHERE clienteId = ? AND ar.articuloId = ?";
    sql = mysql.format(sql, [clienteId, articuloId]);
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

module.exports.getClientePorNif = function (nif, callback) {
    var connection = com.getConnection();
    sql = "SELECT * FROM clientes WHERE nif = ?  AND activa = 1";
    sql = mysql.format(sql, nif);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.getClienteProId = function (proId, callback) {
    var connection = com.getConnection();
    var sql = "SELECT COALESCE(SUBSTRING_INDEX(MAX(proId), '/', -1) + 1, 1) AS num";
    sql += " FROM clientes"
    sql += " WHERE proId LIKE ?";
    sql = mysql.format(sql, "%"+proId+"%");
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.getClientePorCuentaContable = function (cuentaContable, callback) {
    var connection = com.getConnection();
    sql = "SELECT * FROM clientes WHERE cuentaContable = ?";
    sql = mysql.format(sql, cuentaContable);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

module.exports.postClientePorCodigo = function (proId, callback) {
    var connection = com.getConnection();
    sql = "SELECT * FROM clientes WHERE proId = ? AND fechaBaja IS NULL";
    sql = mysql.format(sql, proId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

module.exports.postClienteActivoLogin = function (cliente, callback) {
    var connection = com.getConnection();
	if (cliente && cliente.login && cliente.password){
		var sql = "SELECT  `clienteId`,`proId`,`nombre`,`nif`,`activa`,`tipoClienteId`,`nombreComercial`  FROM clientes WHERE loginWeb = ? AND passWeb = ? AND activa = 1";
		sql = mysql.format(sql, [cliente.login, cliente.password]);
		connection.query(sql, function(err, result){
            connection.end()
			if (err) return callback(err, null);
				
            if (result.length == 0) return callback(null, null);
            
			return callback(null, result[0]);
            
		});
	}else{
		var err = new Error('API: No se ha proporcionado un objeto usuario con login y contraseña');
		callback(err, null);
		return;
	}
}


module.exports.getClientePorCampo = function (valor, key, callback) {
    var connection = com.getConnection();
    sql = "SELECT * FROM clientes WHERE  ?  AND activa = 1";
    sql = mysql.format(sql, valor);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) return callback(err, null);
        if (result.length == 0) return callback(null, null);
        callback(null, result[0]);
    });
}

module.exports.getContratosActivos = async (id) => {
    let con = null;
    var sql= "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT referencia FROM contratos";
            sql += " WHERE contratoCerrado = 0 AND clienteId = ?";
            sql += " ORDER BY referencia"
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            await con.end();
            //procesamos los resultados
			resolve(result);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
					await con.end();
                } 
            }
            reject (e);
        }
    });
}



