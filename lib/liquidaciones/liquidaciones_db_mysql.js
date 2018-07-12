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


// deleteLiquidacionFactura
// Elimina la liquidacion relacionada con una factura
module.exports.deleteLiquidacionFactura = function (id,  factura, callback) {
    var connection = getConnection();
    sql = "DELETE from liquidacion_comercial WHERE facturaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

module.exports.getLiquidacionAcumulada = function (dFecha, hFecha, tipoComercialId, contratoId, done) {
    var con = getConnection();
    var sql = "SELECT lf.comercialId, c.nombre, tc.nombre AS tipo, SUM(lf.impCliente) AS totFactura, SUM(lf.base) AS totBase, SUM(lf.comision) AS totComision";
    sql += " FROM liquidacion_comercial AS lf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contratos AS con ON con.contratoId = lf.contratoId";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    if (tipoComercialId != 0){
        sql += " AND c.tipocomercialId = " + tipoComercialId;
    }
    if (contratoId != 0){
        sql += " AND con.contratoId = " + contratoId;
    }
    sql += " GROUP BY lf.comercialId";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}

module.exports.getLiquidacionAcumuladaComercial = function (comercialId, contratoId, done) {
    var con = getConnection();
    var sql = "SELECT lf.comercialId, c.nombre, tc.nombre AS tipo, SUM(lf.impCliente) AS totFactura, SUM(lf.base) AS totBase, SUM(lf.comision) AS totComision";
    sql += " FROM liquidacion_comercial AS lf";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contratos AS con ON con.contratoId = lf.contratoId";
    sql += " WHERE lf.facturaId IS NULL";
    if (comercialId != 0){
        sql += " AND lf.comercialId = " + comercialId;
    }
    if (contratoId != 0){
        sql += " AND con.contratoId = " + contratoId;
    }
    sql += " GROUP BY lf.comercialId";
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}


module.exports.getLiquidacionDetalle = function (dFecha, hFecha, comercialId, done) {
    var con = getConnection();
    var sql = "SELECT c.nombre, tc.nombre AS tipo, lf.*,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS facNum, f.fecha AS fechaFactura,";
    sql += " ccm.referencia AS contrato";
    sql += " FROM liquidacion_comercial AS lf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contratos AS ccm ON ccm.contratoId = lf.contratoId";
    sql += " WHERE lf.comercialId = ?";
    sql += " AND f.fecha >= ? AND f.fecha <= ?";
    sql = mysql.format(sql, [comercialId, dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}

module.exports.getLiquidacionDetalleComercial = function ( comercialId, contratoId, done) {
    var con = getConnection();
    var sql = "SELECT c.nombre, tc.nombre AS tipo, lf.*,";
    //sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS facNum, f.fecha AS fechaFactura,";
    sql += " ccm.referencia AS contrato";
    sql += " FROM liquidacion_comercial AS lf";
    //sql += " LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contratos AS ccm ON ccm.contratoId = lf.contratoId";
    sql += " WHERE lf.facturaId IS NULL";
    sql += " AND lf.comercialId = ?";
    sql = mysql.format(sql, comercialId);
    if(contratoId > 0){
        sql += "  AND lf.contratoId = ?";
        sql = mysql.format(sql, contratoId);
    }
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}




// postFacturaLiquidacion
module.exports.postFacturaLiquidacion = function (dFecha, hFecha, tipoContratoId, empresaId, comercialId, done) {
    var con = getConnection();
    var sql = "";
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // el primer paso es eliminar las posibles liquidaciones de las mismas facturas
        sql = "DELETE FROM liquidacion_comercial WHERE facturaId IN";
        sql += " (SELECT DISTINCT facturaId FROM facturas AS f";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
        sql += "  WHERE f.fecha >= ? AND f.fecha <= ?";
        if (tipoContratoId != 0) {
            sql += " AND cnt.tipoContratoId = " + tipoContratoId;
        }
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND (cnt.agenteId = " + comercialId + " OR cms.comercialId = " + comercialId + ")";
        }
        sql += ")";
        sql = mysql.format(sql, [dFecha, hFecha]);
        /*
        if (tipoComercialId != 0) {
            sql += " AND comercialId IN (";
            sql += "SELECT comercialId FROM comerciales WHERE tipoComercialId = " + tipoComercialId + ")";
        }
        */
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            sql = "SELECT f.facturaId, f.fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.coste, f.porcentajeAgente,";
            sql += " cm.contratoId, cm.referencia, cm.tipoContratoId as tipoMantenimientoId,";
            sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porcentajeComision as porComer,";
            sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
            sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial,";
            sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial,";
            sql += " finComisAgente, finPorImpCliente, finPorImpClienteAgente, finPorCostes, finCostes, finJefeObra, finOficinaTecnica, finAsesorTecnico, finComercial";            
            sql += " FROM facturas AS f";
            sql += " LEFT JOIN contratos AS cm ON cm.contratoId = f.contratoId";
            sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " WHERE f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
            if (tipoContratoId != 0) {
                sql += " AND cm.tipoContratoId = " + tipoContratoId;
            }
            if (empresaId != 0) {
                sql += " AND f.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND (cm.agenteId = " + comercialId + " OR cmc.comercialId = " + comercialId + ")";
            }            
            sql += " ORDER BY f.facturaId";
            sql = mysql.format(sql, [hFecha, dFecha]);

            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                if (res.length == 0) {
                    // la consulta no ha devuelto registros
                    return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                }
                // hay que montar ir procesando factura a factura
                // como varios registros pueden formar parte de una misma factura hay que mandarlas agrupadas a su procesamiento
                var antFactura = res[0].facturaId;
                var fs = [];
                var fsl = [];
                var regs = [];
                res.forEach(function (f) {
                    if (f.facturaId != antFactura) {
                        var ls = fnProcesarFacturasLiquidacion(fsl);
                        ls.forEach(function (l) { regs.push(l.registro) });
                        fsl = [];
                    }
                    fsl.push(f);
                    antFactura = f.facturaId
                })
                if (fsl.length > 0) {
                    var ls = fnProcesarFacturasLiquidacion(fsl);
                    ls.forEach(function (l) { regs.push(l.registro) });
                }
                async.eachSeries(regs, function (r, callback) {
                    delete r.quita; // borrramos la propiedad quita para que no de error al actualizar
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        callback(null);
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        done(null, null); // todo correcto
                    });
                });
            })
        })


    });
}

module.exports.checkFacturasLiquidadas = function (dFecha, hFecha, tipoContratoId, empresaId, comercialId, done) {
    var con = getConnection();
    var sql = "SELECT * ";
    sql += " FROM liquidacion_comercial AS lq";
    sql += " WHERE lq.facturaId IN";
    sql += " (SELECT DISTINCT facturaId FROM facturas AS f";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
    sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
    sql += "  WHERE f.fecha >= ? AND f.fecha <= ?";
    if (tipoContratoId != 0) {
        sql += " AND cnt.tipoContratoId = " + tipoContratoId;
    }
    if (empresaId != 0) {
        sql += " AND f.empresaId = " + empresaId;
    }
    if (comercialId != 0) {
        sql += " AND (cnt.agenteId = " + comercialId + " OR cms.comercialId = " + comercialId + ")";
    }  
    sql += ")";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    })
}

module.exports.checkContratosLiquidados = function (dFecha, hFecha, tipoContratoId, empresaId, comercialId, done) {
    var con = getConnection();
    var sql = "SELECT *";
    sql += " FROM liquidacion_comercial AS lq";
    sql += " WHERE lq.contratoId IN ";
    sql += " (SELECT c.contratoId";
    sql += " FROM contratos AS c";
    sql += " LEFT JOIN contratos_comisionistas AS cms ON cms.contratoId = c.contratoId";
    sql += " WHERE c.fechaInicio >= ? AND c.fechaInicio <= ? AND c.contratoCerrado = 1";
    if (tipoContratoId != 0) {
        sql += " AND c.tipoContratoId = " + tipoContratoId;
    }
    if (empresaId != 0) {
        sql += " AND c.empresaId = " + empresaId;
    }
    if (comercialId != 0) {
        sql += " AND cms.comercialId = " + comercialId;
    }  
    sql += ")";
    sql += " AND lq.facturaId IS NULL";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}

var fnProcesarFacturasLiquidacion = function (fsl) {
    var ls = [];
    // calculamos la correspondiente al agente
    var f = fsl[0];
    var l1 = fnUnaLineaVacia(f);
    l1.registro.facturaId = f.facturaId;
    l1.registro.comercialId = f.agenteId;
    l1.registro.contratoId = f.contratoId;
    l1.registro.impCliente = f.totalAlCliente;
    l1.registro.coste = f.coste;
    l1.registro.base = f.totalAlCliente;
    l1.registro.porComer = f.porcentajeAgente;
    l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
    l1.tipoComercial = 1; // es un agente
    ls.push(l1);
    var comisAgente = l1.registro.comision;
    // vamos a crear una lista de objetos con dos propiedades que a su vez son objetos
    // origen: lo que se ha leido de la base de datos
    // registro: lo que se guardará como registro de liquidación
    fsl.forEach(function (f) {
        var l = fnUnaLineaVacia(f);
        l.registro.facturaId = f.facturaId;
        l.registro.comercialId = f.comercialId;
        l.registro.contratoId = f.contratoId;
        l.registro.impCliente = f.totalAlCliente;
        l.registro.coste = f.coste;
        l.registro.porComer = f.porComer;
        l.registro.quita = false;
        // el caso es diferente si se trata de seguro o mantenimiento
        if (f.tipoMantenimientoId == 1) {
            // mantenimiento
            if (f.manComisAgente && f.manComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.manPorImpCliente && f.manPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.manPorImpCliente) / 100.0;
            }
            if (f.manPorImpClienteAgente && f.manPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.manPorImpClienteAgente) / 100.0;
            }
            if (f.manPorCostes && f.manPorCostes != 0) {
                l.registro.PCO = (f.coste * f.manPorCostes) / 100.0;
            }
            if (f.manCostes && f.manCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.manJefeObra || f.manJefeObra == 0) &&
                (!f.manOficinaTecnica || f.manOficinaTecnica == 0) &&
                (!f.manAsesorTecnico || f.manAsesorTecnico == 0) &&
                (!f.manComercial || f.manComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        if (f.tipoMantenimientoId == 2) {
            // seguro
            if (f.segComisAgente && f.segComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.segPorImpCliente && f.segPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.segPorImpCliente) / 100.0;
            }
            if (f.segPorImpClienteAgente && f.segPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.segPorImpClienteAgente) / 100.0;
            }
            if (f.segPorImpCostes && f.segPorImpCostes != 0) {
                l.registro.PCO = (f.coste * f.segPorCostes) / 100.0;
            }
            if (f.segCostes && f.segCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.segJefeObra || f.segJefeObra == 0) &&
                (!f.segOficinaTecnica || f.segOficinaTecnica == 0) &&
                (!f.segAsesorTecnico || f.segAsesorTecnico == 0) &&
                (!f.segComercial || f.segComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        if (f.tipoMantenimientoId == 4) {
            // fincas
            if (f.finComisAgente && f.finComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.finPorImpCliente && f.finPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.finPorImpCliente) / 100.0;
            }
            if (f.finPorImpClienteAgente && f.finPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.finPorImpClienteAgente) / 100.0;
            }
            if (f.finPorImpCostes && f.finPorImpCostes != 0) {
                l.registro.PCO = (f.coste * f.finPorCostes) / 100.0;
            }
            if (f.finCostes && f.finCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.finJefeObra || f.finJefeObra == 0) &&
                (!f.finOficinaTecnica || f.finOficinaTecnica == 0) &&
                (!f.finAsesorTecnico || f.finAsesorTecnico == 0) &&
                (!f.finComercial || f.finComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }  
        if (f.tipoMantenimientoId == 5) {
            // arquitectura
            if (f.arqComisAgente && f.arqComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.arqPorImpCliente && f.arqPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.arqPorImpCliente) / 100.0;
            }
            if (f.arqPorImpClienteAgente && f.arqPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.arqPorImpClienteAgente) / 100.0;
            }
            if (f.arqPorImpCostes && f.arqPorImpCostes != 0) {
                l.registro.PCO = (f.coste * f.arqPorCostes) / 100.0;
            }
            if (f.arqCostes && f.arqCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.arqJefeObra || f.arqJefeObra == 0) &&
                (!f.arqOficinaTecnica || f.arqOficinaTecnica == 0) &&
                (!f.arqAsesorTecnico || f.arqAsesorTecnico == 0) &&
                (!f.arqComercial || f.arqComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }               
        // en un primer paso calculamos al agente que figura en todos los registros
        if(!l.registro.quita) ls.push(l);
    });
    // hay que reordernar los registros para se calculen las dependencias en el orden correcto
    var l2 = [];
    ls.forEach(function (l) {
        switch (l.tipoComercial) {
            case 1:
                l.orden = 1;
                break;
            case 2:
                l.orden = 2;
                break;
            case 3:
                l.orden = 7;
                break;
            case 4:
                l.orden = 3;
                break;
            case 5:
                l.orden = 4;
                break;
            case 6:
                l.orden = 6;
                break;
            case 7:
                l.orden = 5;
                break;
        }
        l2.push(l);
    })
    l2.sort(function (a, b) { return (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0); });
    // Ahora hay que revisar las comisiones pendientes de calcular porque tenían dependencias.
    l2.forEach(function (l) {
        if (l.registro.comision == 0) {
            // si no le hemos calculado la comisión es que tenía una dependencia que no concíamos
            // en un primer momento.
            // nuevamente es distinto finún el tipo de contrato de mantenimiento o seguro
            if (l.origen.tipoMantenimientoId == 1) {
                // mantenimento
                if (l.origen.manJefeObra && l.origen.manJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.manOficinaTecnica && l.origen.manOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.manAsesorTecnico && l.origen.manAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.manComercial && l.origen.manComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 2) {
                // seguros
                if (l.origen.segJefeObra && l.origen.segJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.segOficinaTecnica && l.origen.segOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.segAsesorTecnico && l.origen.segAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.segComercial && l.origen.segComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            fnCalculoComisionDeUnRegistro(l.registro);
        }
    })
    return l2;
}

var fnUnaLineaVacia = function (l) {
    var l1 = {
        origen: l,
        registro: {
            liquidacionComercialId: 0,
            facturaId: 0,
            comercialId: 0,
            contratoId: 0,
            impCliente: 0,
            coste: 0,
            CA: 0,
            PC: 0,
            PCA: 0,
            PCO: 0,
            ICO: 0,
            IJO: 0,
            IOT: 0,
            IAT: 0,
            IC: 0,
            base: 0,
            porComer: 0,
            comision: 0
        },
        tipoComercial: l.tipoComercial
    };
    return l1;
}

var fnCalculoComisionDeUnRegistro = function (r) {
    var base = r.impCliente - r.CA - r.PC - r.PCA - r.PCO - r.ICO - r.IJO - r.IOT - r.IAT - r.IC;
    r.base = base;
    r.comision = (base * r.porComer) / 100.0;
}

var fnCalculoDeComisionDeUnTipo = function (ls, tipoComercial) {
    var comisionTipo = 0;
    ls.forEach(function (l) {
        // comprobamos si corresponde al tipo buscado
        if (l.tipoComercial == tipoComercial) {
            comisionTipo += l.registro.comision;
        }
    });
    return comisionTipo;
}


module.exports.postFacturaLiquidacionAgente = function (dFecha, hFecha, tipoContratoId, empresaId, comercialId, done) {
    var con = getConnection();
    var sql = "";
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // el primer paso es eliminar las posibles liquidaciones de las mismas facturas
        sql = "DELETE FROM liquidacion_comercial WHERE facturaId IN";
        sql += " (SELECT DISTINCT facturaId FROM facturas AS f";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
        sql += "  WHERE f.fecha >= ? AND f.fecha <= ?";
        if (tipoContratoId != 0) {
            sql += " AND cnt.tipoContratoId = " + tipoContratoId;
        }
        if (empresaId != 0) {
            sql += " AND f.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND (cnt.agenteId = " + comercialId + " OR cms.comercialId = " + comercialId + ")";
        }
        sql += ")";
        sql = mysql.format(sql, [dFecha, hFecha]);
        /*
        if (tipoComercialId != 0) {
            sql += " AND comercialId IN (";
            sql += "SELECT comercialId FROM comerciales WHERE tipoComercialId = " + tipoComercialId + ")";
        }
        */
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            sql = "SELECT f.facturaId, f.fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.coste, f.porcentajeAgente,";
            sql += " cm.contratoId, cm.referencia, cm.tipoContratoId as tipoMantenimientoId,";
            sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porcentajeComision as porComer,";
            sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
            sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial,";
            sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial,";
            sql += " finComisAgente, finPorImpCliente, finPorImpClienteAgente, finPorCostes, finCostes, finJefeObra, finOficinaTecnica, finAsesorTecnico, finComercial,";            
            sql += " arqComisAgente, arqPorImpCliente, arqPorImpClienteAgente, arqPorCostes, arqCostes, arqJefeObra, arqOficinaTecnica, arqAsesorTecnico, arqComercial";            
            sql += " FROM facturas AS f";
            sql += " LEFT JOIN contratos AS cm ON cm.contratoId = f.contratoId";
            sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " WHERE f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
            if (tipoContratoId != 0) {
                sql += " AND cm.tipoContratoId = " + tipoContratoId;
            }
            if (empresaId != 0) {
                sql += " AND f.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND (cm.agenteId = " + comercialId + " OR cmc.comercialId = " + comercialId + ")";
            }            
            sql += " ORDER BY f.facturaId";
            sql = mysql.format(sql, [hFecha, dFecha]);

            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                if (res.length == 0) {
                    // la consulta no ha devuelto registros
                    return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                }
                // hay que montar ir procesando factura a factura
                // como varios registros pueden formar parte de una misma factura hay que mandarlas agrupadas a su procesamiento
                var antFactura = res[0].facturaId;
                var fs = [];
                var fsl = [];
                var regs = [];
                res.forEach(function (f) {
                    if (f.facturaId != antFactura) {
                        var ls = fnProcesarFacturasLiquidacionAgente(fsl);
                        ls.forEach(function (l) { regs.push(l.registro) });
                        fsl = [];
                    }
                    fsl.push(f);
                    antFactura = f.facturaId
                })
                if (fsl.length > 0) {
                    var ls = fnProcesarFacturasLiquidacionAgente(fsl);
                    ls.forEach(function (l) { regs.push(l.registro) });
                }
                async.eachSeries(regs, function (r, callback) {
                    delete r.quita; // borrramos la propiedad quita para que no de error al actualizar
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        callback(null);
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        done(null, null); // todo correcto
                    });
                });
            })
        })


    });
}

var fnProcesarFacturasLiquidacionAgente = function (fsl) {
    var ls = [];
    // calculamos la correspondiente al agente
    var f = fsl[0];
    var l1 = fnUnaLineaVacia(f);
    l1.registro.facturaId = f.facturaId;
    l1.registro.comercialId = f.agenteId;
    l1.registro.contratoId = f.contratoId;
    l1.registro.impCliente = f.totalAlCliente;
    l1.registro.coste = f.coste;
    l1.registro.base = f.totalAlCliente;
    l1.registro.porComer = f.porcentajeAgente;
    l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
    l1.tipoComercial = 1; // es un agente
    ls.push(l1);
    var comisAgente = l1.registro.comision;
    return ls;
}


// -- contratos
module.exports.postFacturaLiquidacionContratos = function (dFecha, hFecha, tipoContratoId, empresaId, comercialId, done) {
    var con = getConnection();
    var sql = "";
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // el primer paso es eliminar las posibles liquidaciones de los mismos contratos
        var sql = "DELETE";
        sql += " FROM liquidacion_comercial";
        sql += " WHERE contratoId IN ";
        sql += " (SELECT c.contratoId";
        sql += " FROM contratos AS c";
        sql += " LEFT JOIN contratos_comisionistas AS cms ON cms.contratoId = c.contratoId";
        sql += " WHERE c.fechaInicio >= ? AND c.fechaInicio <= ? AND c.contratoCerrado = 1";
        if (tipoContratoId != 0) {
            sql += " AND c.tipoContratoId = " + tipoContratoId;
        }
        if (empresaId != 0) {
            sql += " AND c.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND cms.comercialId = " + comercialId;
        }  
        sql += ")";
        sql += " AND facturaId IS NULL";
        sql = mysql.format(sql, [dFecha, hFecha]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            sql = "SELECT" 
            sql += " cm.contratoId, (COALESCE(cm2.facturado, 0) - COALESCE(cm3.gastos, 0)) AS beneficio, COALESCE(cm2.facturado, 0) as facturado,";
            sql += " COALESCE(cm2.facturadoAlCliente, 0) as facturadoAlCliente, COALESCE(cm3.gastos, 0) as gastos,"
            sql += " cm.referencia, cm.tipoContratoId AS tipoMantenimientoId,";
            sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porcentajeComision AS porComer,";
            sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
            sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial,";
            sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial,";
            sql += " finComisAgente, finPorImpCliente, finPorImpClienteAgente, finPorCostes, finCostes, finJefeObra, finOficinaTecnica, finAsesorTecnico, finComercial,";
            sql += " arqComisAgente, arqPorImpCliente, arqPorImpClienteAgente, arqPorCostes, arqCostes, arqJefeObra, arqOficinaTecnica, arqAsesorTecnico, arqComercial ";
            sql += " FROM contratos AS cm";
            sql += " LEFT JOIN (SELECT contratoId, SUM(total) AS facturado,  SUM(totalAlCliente) AS facturadoAlCliente FROM facturas GROUP BY contratoId) AS cm2 ON cm2.contratoId = cm.contratoId";
            sql += " LEFT JOIN (SELECT contratoId, SUM(importe) AS gastos FROM facprove_serviciados GROUP BY contratoId) AS cm3 ON cm3.contratoId = cm.contratoId";
            sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = cm.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " WHERE NOT cmc.comercialId IS NULL";
            sql += " AND cm.fechaInicio <= ? AND cm.fechaInicio >= ? AND cm.sel = 1";
            if (tipoContratoId != 0) {
                sql += " AND cm.tipoContratoId = " + tipoContratoId;
            }
            if (empresaId != 0) {
                sql += " AND cm.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND cmc.comercialId = " + comercialId ;
            }            
            sql += " ORDER BY cm.contratoId";
            sql = mysql.format(sql, [hFecha, dFecha]);

            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                if (res.length == 0) {
                    // la consulta no ha devuelto registros
                    return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                }
                // hay que montar ir procesando factura a factura
                // como varios registros pueden formar parte de una misma factura hay que mandarlas agrupadas a su procesamiento
                var antContrato = res[0].contratoId;
                var fs = [];
                var fsl = [];
                var regs = [];
                res.forEach(function (c) {
                    if (c.contratoId != antContrato) {
                        var ls = fnProcesarFacturasLiquidacionContratos(fsl);
                        ls.forEach(function (l) { regs.push(l.registro) });
                        fsl = [];
                    }
                    fsl.push(c);
                    antContrato = c.contratoId;
                })
                if (fsl.length > 0) {
                    var ls = fnProcesarFacturasLiquidacionContratos(fsl);
                    ls.forEach(function (l) { regs.push(l.registro) });
                }
                async.eachSeries(regs, function (r, callback) {
                    delete r.quita; // borrramos la propiedad quita para que no de error al actualizar
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        callback(null);
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        done(null, null); // todo correcto
                    });
                });
            })
        })


    });
}

var fnProcesarFacturasLiquidacionContratos = function (fsl) {
    var ls = [];
    // vamos a crear una lista de objetos con dos propiedades que a su vez son objetos
    // origen: lo que se ha leido de la base de datos
    // registro: lo que se guardará como registro de liquidación
    fsl.forEach(function (c) {
        var l = fnUnaLineaVacia(c);
        l.registro.facturaId = null;
        l.registro.comercialId = c.comercialId;
        l.registro.contratoId = c.contratoId;
        l.registro.impCliente = c.facturado;
        l.registro.coste = c.gastos;
        l.registro.porComer = c.porComer;
        var comisAgente = (c.facturadoAlCliente * c.porAgente) / 100.0;
        // el caso es diferente si se trata de seguro o mantenimiento
        if (c.tipoMantenimientoId == 1) {
            // mantenimiento
            if (c.manComisAgente && c.manComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.manPorImpCliente && c.manPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.manPorImpCliente) / 100.0;
            }
            if (c.manPorImpClienteAgente && c.manPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.manPorImpClienteAgente) / 100.0;
            }
            if (c.manPorCostes && c.manPorCostes != 0) {
                l.registro.PCO = (c.gastos * c.manPorCostes) / 100.0;
            }
            if (c.manCostes && c.manCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.manJefeObra || c.manJefeObra == 0) &&
                (!c.manOficinaTecnica || c.manOficinaTecnica == 0) &&
                (!c.manAsesorTecnico || c.manAsesorTecnico == 0) &&
                (!c.manComercial || c.manComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        if (c.tipoMantenimientoId == 2) {
            // seguro
            if (c.segComisAgente && c.segComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.segPorImpCliente && c.segPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.segPorImpCliente) / 100.0;
            }
            if (c.segPorImpClienteAgente && c.segPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.segPorImpClienteAgente) / 100.0;
            }
            if (c.segPorImpCostes && c.segPorImpCostes != 0) {
                l.registro.PCO = (c.gastos * c.segPorCostes) / 100.0;
            }
            if (c.segCostes && c.segCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.segJefeObra || c.segJefeObra == 0) &&
                (!c.segOficinaTecnica || c.segOficinaTecnica == 0) &&
                (!c.segAsesorTecnico || c.segAsesorTecnico == 0) &&
                (!c.segComercial || c.segComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        if (c.tipoMantenimientoId == 4) {
            // fincas
            if (c.finComisAgente && c.finComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.finPorImpCliente && c.finPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.finPorImpCliente) / 100.0;
            }
            if (c.finPorImpClienteAgente && c.finPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.finPorImpClienteAgente) / 100.0;
            }
            if (c.finPorImpCostes && c.finPorImpCostes != 0) {
                l.registro.PCO = (c.gastos * c.finPorCostes) / 100.0;
            }
            if (c.finCostes && c.finCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.finJefeObra || c.finJefeObra == 0) &&
                (!c.finOficinaTecnica || c.finOficinaTecnica == 0) &&
                (!c.finAsesorTecnico || c.finAsesorTecnico == 0) &&
                (!c.finComercial || c.finComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }  
        if (c.tipoMantenimientoId == 5) {
            // arquitectura
            if (c.arqComisAgente && c.arqComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.arqPorImpCliente && c.arqPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.arqPorImpCliente) / 100.0;
            }
            if (c.arqPorImpClienteAgente && c.arqPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.arqPorImpClienteAgente) / 100.0;
            }
            if (c.arqPorImpCostes && c.arqPorImpCostes != 0) {
                l.registro.PCO = (c.gastos * c.arqPorCostes) / 100.0;
            }
            if (c.arqCostes && c.arqCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.arqJefeObra || c.arqJefeObra == 0) &&
                (!c.arqOficinaTecnica || c.arqOficinaTecnica == 0) &&
                (!c.arqAsesorTecnico || c.arqAsesorTecnico == 0) &&
                (!c.arqComercial || c.arqComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }               
        ls.push(l);
    });
    // hay que reordernar los registros para se calculen las dependencias en el orden correcto
    var l2 = [];
    ls.forEach(function (l) {
        switch (l.tipoComercial) {
            case 1:
                l.orden = 1;
                break;
            case 2:
                l.orden = 2;
                break;
            case 3:
                l.orden = 7;
                break;
            case 4:
                l.orden = 3;
                break;
            case 5:
                l.orden = 4;
                break;
            case 6:
                l.orden = 6;
                break;
            case 7:
                l.orden = 5;
                break;
        }
        l2.push(l);
    })
    l2.sort(function (a, b) { return (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0); });
    // Ahora hay que revisar las comisiones pendientes de calcular porque tenían dependencias.
    l2.forEach(function (l) {
        if (l.registro.comision == 0) {
            // si no le hemos calculado la comisión es que tenía una dependencia que no concíamos
            // en un primer momento.
            // nuevamente es distinto finún el tipo de contrato de mantenimiento o seguro
            if (l.origen.tipoMantenimientoId == 1) {
                // mantenimento
                if (l.origen.manJefeObra && l.origen.manJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.manOficinaTecnica && l.origen.manOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.manAsesorTecnico && l.origen.manAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.manComercial && l.origen.manComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 2) {
                // seguros
                if (l.origen.segJefeObra && l.origen.segJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.segOficinaTecnica && l.origen.segOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.segAsesorTecnico && l.origen.segAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.segComercial && l.origen.segComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            fnCalculoComisionDeUnRegistro(l.registro);
        }
    })
    return l2;
}