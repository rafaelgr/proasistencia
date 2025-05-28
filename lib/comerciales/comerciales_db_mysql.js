// comerciales_db_mysql
// Manejo de la tabla comerciales en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun")

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


module.exports.getComercialesBeneficio = function (callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT DISTINCT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contrato_comercial as cc ON cc.comercialId = c.comercialId";
    sql += " WHERE manCostes = 1 OR segCostes = 1 OR finCostes = 1 OR arqCostes = 1"
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

module.exports.getComercialesEnActivo = function (nombreABuscar, done) {
    var con = getConnection();
    var sql = "SELECT * FROM comerciales WHERE activa = 1 AND tipoComercialId <> 1";
    if (nombreABuscar) {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function (err, comerciales) {
        closeConnection(con);
        if (err) return done(err);
        done(null, comerciales);
    });
}


module.exports.getComercialesEnActivoTipo = function ( tipo, nombreABuscar, done) {
    var con = getConnection();
    var sql = "SELECT * FROM comerciales WHERE activa = 1 AND tipoComercialId = " + tipo;
    if (nombreABuscar !== '*') {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function (err, comerciales) {
        closeConnection(con);
        if (err) return done(err);
        done(null, comerciales);
    });
}

module.exports.getAgentesEnActivo = function (nombreABuscar, done) {
    var con = getConnection();
    var sql = "SELECT * FROM comerciales WHERE activa = 1 AND tipoComercialId = 1";
    if (nombreABuscar != '*') {
        sql += " AND nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombreABuscar + '%');
    }
    con.query(sql, function (err, agentes) {
        closeConnection(con);
        if (err) return done(err);
        done(null, agentes);
    });
}
module.exports.getComercialesActivos = function (callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.activa = 1";
    sql += " ORDER BY c.nombre"
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

module.exports.getAgentesActivos = function (done) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId = 1 AND c.activa = 1";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        comerciales = result;
        done(null, comerciales);
    });
}

module.exports.getColaboradores = function (callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId <> 1";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        comerciales = result;
        callback(null, comerciales);
    });
}

module.exports.getColaboradoresActivos = function (done) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId <> 1 AND c.activa = 1";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        comerciales = result;
        done(null, comerciales);
    });
}

module.exports.getColaboradoresActivosPorTipo = function (tipoComercialId, done) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId = ? AND c.activa = 1";
    sql = mysql.format(sql, tipoComercialId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        comerciales = result;
        done(null, comerciales);
    });
}

module.exports.getColaboradoresPorTipo = function (tipoComercialId, done) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId = ?";
    sql = mysql.format(sql, tipoComercialId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        comerciales = result;
        done(null, comerciales);
    });
}

module.exports.getColaboradoresPorTipos = function (tiposComercialId, done) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.tipoComercialId IN (" + tiposComercialId + ")";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, done);
        if (err) {
            return done(err, null);
        }
        comerciales = result;
        done(null, comerciales);
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

module.exports.getComercialesActivosBuscar = function (nombre, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId"
    sql += " WHERE c.activa = 1";
    if (nombre !== "*") {
        sql += " AND c.nombre LIKE ?";
        sql += " ORDER BY c.nombre";
        sql = mysql.format(sql, '%' + nombre + '%');
    } else {
        sql += " ORDER BY c.nombre";
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
    sql = "SELECT c.*, c2.nombre AS colaborador, t.nombre AS tipo_actividad, tv.nombre As tipoViaAgente FROM comerciales AS c";
    sql += " LEFT JOIN comerciales as c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN tipos_comerciales as t ON t.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN tipos_via as tv on tv.tipoViaId = c.tipoViaId"
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

// getComercial
// busca  el comercial con id pasado
module.exports.getComercialCliente = function (id, callback) {
    var connection = getConnection();
    var comerciales = null;
    sql = "SELECT co.comercialId AS comercialId, co.nombre AS nombre FROM comerciales AS co";
    sql += " LEFT JOIN clientes AS cli ON cli.comercialId = co.comercialId";
    sql += " WHERE cli.clienteId = ?";
    sql += " ORDER BY co.nombre ASC"
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



// login
module.exports.loginColaborabor = function (login, password, callback) {
    var connection = getConnection();
    var sql = "SELECT comercialId, proId, nombre, nif, activa, tipoComercialId"; 
    sql += " FROM comerciales WHERE loginWeb = ? AND passWeb = ? AND activa = 1";
    sql = mysql.format(sql, [login, password]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        if (result.length == 0) return callback(new Error('No autorizado'));
        callback(null, result[0]);
    });

}

// BuscarComision
// Busca la comisión según los datos pasados y la devuelve en el siguiente orden
// Si hay comision para el cliente
// Si hay comisión en su contrato comercial
// Comisión por defecto de su registro.
// -----------------------------------------------------
module.exports.buscarComision = function (comercialId, clienteId, empresaId, tipoMantenimientoId, done) {
    async.parallel(
        {
           /*  cliente: function (callback) {
                buscarComisionConCliente(comercialId, clienteId, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                });
            }, */
            contrato: function (callback) {
                buscarComisionContratoComercial(comercialId, empresaId, tipoMantenimientoId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            },
           /*  base: function (callback) {
                buscarComisionBase(comercialId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            } */
        },
        function (err, results) {
            if (err) return done(err);
            if (results.contrato || results.contrato === 0) return done(null, results.contrato);
            //if (results.cliente) return done(null, results.cliente);
            //if (results.base) return done(null, results.base);
            done(null, null);
        }
    );
}

module.exports.buscarComision2 = function (comercialId, empresaId, tipoMantenimientoId, done) {
    async.parallel(
        {
           /*  cliente: function (callback) {
                buscarComisionConCliente(comercialId, clienteId, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                });
            }, */
            contrato: function (callback) {
                buscarComisionContratoComercial(comercialId, empresaId, tipoMantenimientoId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            },
           /*  base: function (callback) {
                buscarComisionBase(comercialId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            } */
        },
        function (err, results) {
            if (err) return done(err);
            if (results.contrato || results.contrato === 0) return done(null, results.contrato);
            //if (results.cliente) return done(null, results.cliente);
            //if (results.base) return done(null, results.base);
            done(null, null);
        }
    );
}

module.exports.buscarComisiones = function (comercialId, empresaId, tipoMantenimientoId, done) {
    async.parallel(
        {
           /*  cliente: function (callback) {
                buscarComisionConCliente(comercialId, clienteId, function (err, res) {
                    if (err) return callback(err);
                    callback(null, res);
                });
            }, */
            contrato: function (callback) {
                buscarComisionesContratoComercial(comercialId, empresaId, tipoMantenimientoId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            },
           /*  base: function (callback) {
                buscarComisionBase(comercialId, function (err, res) {
                    if (err) callback(err);
                    callback(null, res);
                });
            } */
        },
        function (err, results) {
            if (err) return done(err);
            if (results.contrato || results.contrato === 0) return done(null, results.contrato);
            //if (results.cliente) return done(null, results.cliente);
            //if (results.base) return done(null, results.base);
            done(null, null);
        }
    );
}

var buscarComisionBase = function (comercialId, done) {
    if (!comercialId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM comerciales WHERE comercialId = ?";
    sql = mysql.format(sql, comercialId);
    conn.query(sql, function (err, res) {
        conn.end();
        if (err) return done(err);
        if (res.length > 0 && res[0].porComer) {
            done(err, res[0].porComer);
        } else {
            return done(null, null);
        }
    });
}

var buscarComisionConCliente = function (comercialId, clienteId, done) {
    if (!comercialId || !clienteId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM clientes_comisionistas WHERE comercialId = ? AND clienteId = ?";
    sql = mysql.format(sql, [comercialId, clienteId]);
    conn.query(sql, function (err, res) {
        conn.end();
        if (err) return done(err);
        if (res.length > 0 && res[0].porComer) {
            done(err, res[0].porComer);
        } else {
            return done(null, null);
        }
    });
}

var buscarComisionContratoComercial = function (comercialId, empresaId, tipoMantenimientoId, done) {
    if (!comercialId || !empresaId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM contrato_comercial WHERE comercialId = ? AND empresaId = ?";
    sql = mysql.format(sql, [comercialId, empresaId]);
    conn.query(sql, function (err, res) {
        conn.end();
        if (err) return done(err);
        if (res.length > 0) {
            // tomamos la Comisión en función del tipo
            var comision = 0;
            if (tipoMantenimientoId == 1 && res[0].manComision) {
                // comision aplicable a mantenimientos.
                comision = res[0].manComision;
            }
            if (tipoMantenimientoId == 2 && res[0].segComision) {
                // comsión aplicable a seguros
                comision = res[0].segComision;
            }
            if (tipoMantenimientoId == 4 && res[0].finComision) {
                // comsión aplicable a seguros
                comision = res[0].finComision;
            }
            if (tipoMantenimientoId == 5 && res[0].arqComision) {
                // comsión aplicable a seguros
                comision = res[0].arqComision;
            }
            if (tipoMantenimientoId == 7 && res[0].repComision) {
                // comsión aplicable a seguros
                comision = res[0].repComision;
            }
            if (tipoMantenimientoId == 8 && res[0].obrComision) {
                // comsión aplicable a seguros
                comision = res[0].obrComision;
            }

            done(err, comision);
        } else {
            return done(null, null);
        }
    });
}

var buscarComisionesContratoComercial = function (comercialId, empresaId, tipoMantenimientoId, done) {
    if (!comercialId || !empresaId) return done(null, null);
    var conn = getConnection();
    var sql = "SELECT * FROM contrato_comercial WHERE comercialId = ? AND empresaId = ?";
    sql = mysql.format(sql, [comercialId, empresaId]);
    conn.query(sql, function (err, res) {
        conn.end();
        if (err) return done(err);
        if (res.length > 0) {
            var data = {};
            if (tipoMantenimientoId == 1 && res[0].manComision) {
                // comision aplicable a mantenimientos.
                data = {
                    porcentajes: {
                        comision: 0
                    }
                }
                if(res[0].manComision) data.porcentajes.comision =  res[0].manComision;
            }
            if (tipoMantenimientoId == 2 && res[0].segComision) {
                // comsión aplicable a seguros
                data = {
                    porcentajes: {
                        comision: 0
                    }
                }
                if(res[0].segComision) data.porcentajes.comision =  res[0].segComision;
            }
            if (tipoMantenimientoId == 4 && res[0].finComision) {
                // comsión aplicable a seguros
                data = {
                    porcentajes: {
                        comision: 0
                    }
                }
                if(res[0].finComision) data.porcentajes.comision =  res[0].finComision;
                
            }
            if (tipoMantenimientoId == 5 && res[0].arqComision) {
                // comsión aplicable a seguros
                data = {
                    porcentajes: {
                        comision: 0
                    }
                }
                if(res[0].arqComision) data.porcentajes.comision =  res[0].arqComision;
               
            }
                
            if (tipoMantenimientoId == 7 && res[0].repComision) {
                // comsión aplicable a seguros
                data = {
                    porcentajes: {
                        comision: 0
                    }
                }
                if(res[0].repComision) data.porcentajes.comision = res[0].repComision;
                
            }
            if (tipoMantenimientoId == 8) {
                // comsión aplicable a seguros
                data = {
                    porcentajes: {
                        comision: 0,
                        comisionAdicional: 0
                    }
                }
                if(res[0].obrComision) data.porcentajes.comision = res[0].obrComision;
                if(res[0].obrComisionAdicional) data.porcentajes.comisionAdicional = res[0].obrComisionAdicional;
            }

            done(err, data);
        } else {
            return done(null, null);
        }
    });
}

//FUNCIONES RELACIONADAS CON LA TABLE CLIENTES_AGENTES

module.exports.getAgentesColaboradores = function (agenteId, callback) {
    var connection = getConnection();
    var clientesAgentes = null;
    sql = "SELECT ca.*, co.nombre  FROM agentes_colaboradores AS ca"
    sql += " INNER JOIN comerciales AS co ON co.comercialId = ca.colaboradorId WHERE agenteId = ?";
    sql += " ORDER BY ca.fechaCambio DESC";
    sql = mysql.format(sql, agenteId);
    connection.query(sql, function (err, result) {
        connection.end()
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });

}

//devuelve un registro determinado de la table clientes_agentes
module.exports.getAgenteColaboradorUnico = function (agenteColaboradorId, callback) {
    var connection = getConnection();
    var clientesAgentes = null;
    sql = "SELECT ca.*, co.nombre, co.porComer FROM agentes_colaboradores AS ca"
    sql += " INNER JOIN comerciales AS co ON co.comercialId = ca.colaboradorId WHERE agenteColaboradorId = ?";
    sql += " ORDER BY ca.fechaCambio DESC";
    sql = mysql.format(sql, agenteColaboradorId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });

}


module.exports.postCambiaColaborador = function (agenteColaborador, callback) {
    var connection = getConnection();
    agenteColaborador.agenteColaboradorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO agentes_colaboradores SET ?";
    sql = mysql.format(sql, agenteColaborador);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, agenteColaborador);
    });
}

module.exports.deleteAgenteColaborador = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from agentes_colaboradores WHERE agenteColaboradorId = ?";
    sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            callback(null);
        });
}

module.exports.getComercialPorCampo = function (valor, key, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM comerciales WHERE  ?  AND activa = 1";
    sql = mysql.format(sql, valor);
    connection.query(sql, function (err, result) {
       connection.end();
        if (err) return callback(err, null);
        if (result.length == 0) return callback(null, null);
        callback(null, result[0]);
    });
}

// putComercialLogin
module.exports.putComercialLogin = function (comercialId, comercial, callback) {
    var connection = getConnection();
        sql = "UPDATE comerciales SET ? WHERE comercialId = ?";
        sql = mysql.format(sql, [comercial, comercialId]);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) return callback(err);
            callback(null, result);
        });
}



module.exports.getAgentesColaboradoresConLiquidacion = function (dFecha, hFecha, comercialId, tipoComercialId, callback) {
    var connection = getConnection();
    //primero los marcamos todos como no seleccionados
    var sql = "UPDATE comerciales SET sel = 0";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err)    return callback(err, null);
        var connection2 = getConnection();
        sql = " SELECT DISTINCT com.comercialId, com.nombre AS comercialNombre, com.nif, ";
        sql += " CONCAT(tv.nombre, ' ',com.direccion) AS direccion, com.poblacion, com.emailConfi, com.telefono1";
        sql += " FROM liquidacion_comercial AS liq ";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId ";
        sql += " LEFT JOIN tipos_via AS tv ON tv.tipoViaId = com.tipoViaId ";
        sql += " WHERE liq.dFecha = '" + dFecha + "' AND liq.hFecha = '" + hFecha + "'";
       
        if (comercialId != 0) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        connection2.query(sql, function (err, result) {
            connection2.end()
            if (err)    return callback(err, null);
            
            callback(null, result);
        });   
    });
}

// getAnticipoColaboradore
// busca  la anttura con id pasado
module.exports.getLimiteAnticipo = async (proveedorId, empresaServiciadaId, contratoId, comercialId) => {
    let conn = undefined
    var sql = "";
    var result = {};
    return new Promise(async (resolve, reject) => {
        var ant = null;
        try {
            conn = await comun.getConnection2();
            //RECUPERAMOS LOAS LIMITES QUE EL PROVEEDOR TIENE ESTABLECIDOS
            sql = "SELECT";
            sql += " c.comercialId, ";
            sql += " c.tipoComercialId,";
            sql += " con.tipoContratoId,";
            sql += " 0 AS limite,"
            sql += " COALESCE(con.importeCliente, 0) AS importeCliente,"
            sql += " COALESCE(cc.manPagoAcuenta, 0) AS manPagoAcuenta,";
            sql += " COALESCE(cc.manPorPagoAcuenta, 0) AS manPorPagoAcuenta,";
            sql += " COALESCE(cc.manComision, 0) AS manComision,";
            sql += " COALESCE(cc.segPagoAcuenta, 0) AS segPagoAcuenta,";
            sql += " COALESCE(cc.segPorPagoAcuenta, 0) AS segPorPagoAcuenta,";
            sql += " COALESCE(cc.segComision, 0) AS segComision,";
            sql += " COALESCE(cc.finPagoAcuenta, 0) AS finPagoAcuenta,";
            sql += " COALESCE(cc.finPorPagoAcuenta, 0) AS finPorPagoAcuenta,";
            sql += " COALESCE(cc.finComision, 0) AS finComision,";
            sql += " COALESCE(cc.arqPagoAcuenta, 0) AS arqPagoAcuenta,";
            sql += " COALESCE(cc.arqPorPagoAcuenta, 0) AS arqPorPagoAcuenta,";
            sql += " COALESCE(cc.arqComision, 0) AS arqComision,";
            sql += " COALESCE(cc.repPagoAcuenta, 0) AS repPagoAcuenta,";
            sql += " COALESCE(cc.repPorPagoAcuenta, 0) AS repPorPagoAcuenta,";
            sql += " COALESCE(cc.repComision, 0) AS repComision,";
            sql += " COALESCE(cc.obrPagoAcuenta, 0) AS obrPagoAcuenta,";
            sql += " COALESCE(cc.obrPorPagoAcuenta, 0) AS obrPorPagoAcuenta,";
            sql += " COALESCE(cc.obrComision, 0) AS obrComision";
            sql += " FROM comerciales AS c";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = c.comercialId";
            sql += " LEFT JOIN contratos_comisionistas AS co ON co.comercialId = cc.comercialId";
            sql += " LEFT JOIN contratos AS con ON con.contratoId = co.contratoId";
            sql += " WHERE c.comercialId = ? AND c.proveedorId = ? AND cc.empresaId = ?";
            sql += " AND co.contratoId = ?";
            //sql += " GROUP BY c.comercialId"
            sql = mysql2.format(sql, [comercialId, proveedorId, empresaServiciadaId, contratoId])
            const [resp] = await conn.query(sql);
            //miramos según el departamento que sea si tiene los campos de los marcados para el límite del anticipo
            if(resp.length > 0) {// si la primera consulta devualve datos buscamos los posibles anticipos según el proveedor y su tipo de colaborador
                result = resp[0];
                if(result.tipoComercialId != 1) {//los agentes no se procesan
                    sql = " SELECT";
                    sql += " COALESCE(SUM(an.importe), 0) AS totAnticipado";
                    sql += " FROM  contratos AS c ";
                    sql += " LEFT JOIN empresas AS e ON e.empresaId = c.empresaId";
                    sql += " LEFT JOIN antprove_serviciados AS an ON an.contratoId = c.contratoId AND an.empresaId = e.empresaId ";
                    sql += " LEFT JOIN  antprove AS a ON a.antproveId = an.antproveId";
                    sql += " WHERE";
                    sql += " a.comercialId = ? AND a.proveedorId = ?";
                    sql += " AND an.empresaId = ? ";
                    sql += " AND an.contratoId = ? ";
                    sql += " GROUP BY a.tipoComercialId";
                    sql = mysql2.format(sql, [comercialId, proveedorId, empresaServiciadaId, contratoId])
                    const [r] = await conn.query(sql);
                    await conn.end();
                    if(r.length > 0) {//hay anticipos
                        result.totAnticipado = r[0].totAnticipado
                    } else {
                        result.totAnticipado = 0
                    }
                    result.limite = limiteAnticipoPorDepartamento(result);
                } else {
                    result.limite = null;
                }
                resolve (result);
            } else {// se decualve un ojeto vacio si no hay resultados en la primera consulta
                resolve (result);
            }
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}

var limiteAnticipoPorDepartamento = function (r) {
    var data = null;
    if (r.tipoContratoId == 1) {
        // mantenimento
        if (r.manPagoAcuenta && r.manPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.manComision, r.manPorPagoAcuenta);
        }
        return data;
    }
    else if (r.tipoContratoId == 2) {
        // seguros
        if (r.segPagoAcuenta && r.segPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.segComision, r.segPorPagoAcuenta);
        }
        return data;
    }
    else if (r.tipoContratoId == 4) {
        // fincas
        if (r.finPagoAcuenta && r.finPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.finComision, r.finPorPagoAcuenta);
        }
        return data;
    }
    else if (r.tipoContratoId == 5) {
        // arquitectura
        if (r.arqPagoAcuenta && r.arqPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.arqComision, r.arqPorPagoAcuenta);
        }
        return data;
    }
    //REPARACIONES DE MOMENTO NO
   /*  else if (r.tipoContratoId == 7) {
        // reparaciones
        if (r.repPagoAcuenta && r.repPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.repComision, r.repPorPagoAcuenta);
        }
        return data;
    } */
    else if (r.tipoContratoId == 8) {
        // obras
        if (r.obrPagoAcuenta && r.obrPagoAcuenta != 0) {
            data = fnCalculoDelLimite(r.importeCliente, r.obrComision, r.obrPorPagoAcuenta);
        }
        return data;
    } else {
        return data;
    }
}

var fnCalculoDelLimite = function (importeCliente, porComer, PorPagoAcuenta) {
    var limite = 0;

    limite =  importeCliente * (PorPagoAcuenta/100) * (porComer/100);

    return parseFloat(limite.toFixed(2));
}


module.exports.getTecnicosContrato = function (contratoId, callback) {
        var connection = getConnection();
        sql = " SELECT * FROM contratos_tecnicos ";
        sql += " WHERE contratoId = ?"
        sql = mysql.format(sql, contratoId);
        connection.query(sql, function (err, result) {
            connection.end()
            if (err)    return callback(err, null);
            
            callback(null, result);
        });   
}


module.exports.getCorreosComercial = function (comercialId) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "SELECT c.*, e.nombre As empresaNombre FROM comercialCorreos AS c";
            sql += " LEFT JOIN empresas as e ON e.empresaId = c.empresaId"
            sql += " WHERE  comercialId = ?";
            sql = mysql2.format(sql, comercialId)
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}

module.exports.getCorreoComercial = function (comercialCorreoId) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "SELECT c.*, e.nombre As empresaNombre FROM comercialCorreos AS c";
            sql += " LEFT JOIN empresas as e ON e.empresaId = c.empresaId"
            sql += " WHERE  comercialCorreoId = ?";
            sql = mysql2.format(sql, comercialCorreoId)
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}

module.exports.getCorreoComercialEmpresa = function (comercialId, empresaId) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "SELECT c.*, e.nombre As empresaNombre FROM comercialCorreos AS c";
            sql += " LEFT JOIN empresas as e ON e.empresaId = c.empresaId"
            sql += " WHERE  c.comercialId = ? AND c.empresaId = ?";
            sql = mysql2.format(sql, [comercialId, empresaId])
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}




module.exports.postCorreosComercial = function (data) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "INSERT INTO comercialCorreos SET ?";
            sql = mysql2.format(sql, data)
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if(error.code == "ER_DUP_ENTRY") {
                error.message = "Empresa duplicada";
            }
            if (conn) await conn.end()
            reject (error)
        }
    });
}


module.exports.putCorreoComercial = function (data) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "UPDATE  comercialCorreos SET ?";
            sql += " WHERE comercialCorreoId = ?"
            sql = mysql2.format(sql, [data, data.comercialCorreoId])
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if(error.code == "ER_DUP_ENTRY") {
                error.message = "Empresa duplicada";
            }
            if (conn) await conn.end()
            reject (error)
        }
    });
}

module.exports.deleteCorreoComercial = function (id) {
    let conn = undefined
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            conn = await comun.getConnection2();
            sql = "DELETE FROM  comercialCorreos";
            sql += " WHERE comercialCorreoId = ?"
            sql = mysql2.format(sql, id)
            const [resp] = await conn.query(sql);
            await   conn.end();
            resolve (resp);
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}

