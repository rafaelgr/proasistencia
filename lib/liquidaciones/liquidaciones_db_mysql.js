// liquidacion_db_mysql
// Manejo de la tabla liquidacion_comercial en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");

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

module.exports.getLiquidacionAcumulada = function (dFecha, hFecha, tipoComercialId, contratoId, departamentoId, usuarioId, done) {
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
    if (departamentoId != 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"            
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


module.exports.getLiquidacionDetalle = function (dFecha, hFecha, comercialId, departamentoId, usuarioId, done) {
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
    if (departamentoId != 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"            
    }
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
                        con.end();
                        done(null, null); // todo correcto
                    });
                });
            })
        })


    });
}

module.exports.checkFacturasLiquidadas = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
    var con = getConnection();
    var sql = "SELECT * ";
    sql += " FROM liquidacion_comercial AS lq";
    sql += " WHERE lq.facturaId IN";
    sql += " (SELECT DISTINCT facturaId FROM facturas AS f";
    sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
    sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
    sql += "  WHERE f.fecha >= ? AND f.fecha <= ?";
    if (departamentoId != 0) {
        sql += " AND f.departamentoId = " + departamentoId;
    }else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"     
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

module.exports.checkContratosLiquidados = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
    var con = getConnection();
    var sql = "SELECT *";
    sql += " FROM liquidacion_comercial AS lq";
    sql += " WHERE lq.contratoId IN ";
    sql += " (SELECT c.contratoId";
    sql += " FROM contratos AS c";
    sql += " LEFT JOIN contratos_comisionistas AS cms ON cms.contratoId = c.contratoId";
    sql += " WHERE c.fechaFinal >= ? AND c.fechaFinal <= ? AND c.contratoCerrado = 1";
    if (departamentoId != 0) {
        sql += " AND c.tipoContratoId = " + departamentoId;
    } else {
        sql += " AND c.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")";
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
            if (f.segPorCostes && f.segPorCostes != 0) {
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
            if (f.finPorCostes && f.finPorCostes != 0) {
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
            if (f.arqPorCostes && f.arqPorCostes != 0) {
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
        if (f.tipoMantenimientoId == 7) {
            // reparaciones
            if (f.repComisAgente && f.repComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.repPorImpCliente && f.repPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.repPorImpCliente) / 100.0;
            }
            if (f.repPorImpClienteAgente && f.repPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.repPorImpClienteAgente) / 100.0;
            }
            if (f.repPorCostes && f.repPorCostes != 0) {
                l.registro.PCO = (f.coste * f.repPorCostes) / 100.0;
            }
            if (f.repCostes && f.repCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.repJefeObra || f.repJefeObra == 0) &&
                (!f.repOficinaTecnica || f.repOficinaTecnica == 0) &&
                (!f.repAsesorTecnico || f.repAsesorTecnico == 0) &&
                (!f.repComercial || f.repComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }         
        if (f.tipoMantenimientoId == 8) {
            // obras
            if (f.obrComisAgente && f.obrComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.obrPorImpCliente && f.obrPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.obrPorImpCliente) / 100.0;
            }
            if (f.obrPorImpClienteAgente && f.obrPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.obrPorImpClienteAgente) / 100.0;
            }
            if (f.obrPorCostes && f.obrPorCostes != 0) {
                l.registro.PCO = (f.coste * f.obrPorCostes) / 100.0;
            }
            if (f.obrCostes && f.obrCostes != 0) {
                //l.registro.ICO = f.coste;
                l.registro.ICO = 0;
                l.registro.quita = true;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.obrJefeObra || f.obrJefeObra == 0) &&
                (!f.obrOficinaTecnica || f.obrOficinaTecnica == 0) &&
                (!f.obrAsesorTecnico || f.obrAsesorTecnico == 0) &&
                (!f.obrComercial || f.obrComercial == 0)) {
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
            if (l.origen.tipoMantenimientoId == 4) {
                // fincas
                if (l.origen.finJefeObra && l.origen.finJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.finOficinaTecnica && l.origen.finOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.finAsesorTecnico && l.origen.finAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.finComercial && l.origen.finComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 5) {
                // arquitectura
                if (l.origen.arqJefeObra && l.origen.arqJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.arqOficinaTecnica && l.origen.arqOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.arqAsesorTecnico && l.origen.arqAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.arqComercial && l.origen.arqComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 7) {
                // reparaciones
                if (l.origen.repJefeObra && l.origen.repJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.repOficinaTecnica && l.origen.repOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.repAsesorTecnico && l.origen.repAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.repComercial && l.origen.repComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 8) {
                // obraraciones
                if (l.origen.obrJefeObra && l.origen.obrJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.obrOficinaTecnica && l.origen.obrOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.obrAsesorTecnico && l.origen.obrAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.obrComercial && l.origen.obrComercial != 0) {
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

 
module.exports.postFacturaLiquidacionAgente = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
    var con = getConnection();
    var sql = "";
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // el primer paso es eliminar las posibles liquidaciones de las mismas facturas
        sql = "DELETE FROM liquidacion_comercial WHERE facturaId IN";
        sql += " (SELECT DISTINCT facturaId FROM facturas AS f";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " LEFT JOIN contratos_comisionistas as cms ON cms.contratoId = f.contratoId"
        sql += "  WHERE f.fecha >= ? AND f.fecha <= ? AND f.sel = 1";
        if (departamentoId != 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        }else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"        
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
            sql = "SELECT cli.nombre, clag.comercialId as histComercialId, DATE_FORMAT(clag.fechaCambio, '%y-%m-%d') AS fechaCambio, f.facturaId, DATE_FORMAT(f.fecha, '%y-%m-%d') AS fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.coste, f.porcentajeAgente,";
            sql += " cm.contratoId, cm.referencia, cm.tipoContratoId as tipoMantenimientoId,";
            sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porcentajeComision as porComer,";
            sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente";
            sql += " FROM facturas AS f";
            sql += " LEFT JOIN contratos AS cm ON cm.contratoId = f.contratoId";
            sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cm.clienteId";
            sql += " LEFT JOIN clientes_agentes AS clag ON clag.clienteId = cm.clienteId";
            sql += " WHERE f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
            if (departamentoId != 0 && departamentoId != 7) {//se procesa el departamento de reparaciones despues de procesar el resto
                sql += " AND f.departamentoId = " + departamentoId;
            }else {
                sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE departamentoId != 7 AND usuarioId = "+ usuarioId+")"        
            }
            if (empresaId != 0) {
                sql += " AND f.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND (cm.agenteId = " + comercialId + " OR cmc.comercialId = " + comercialId + ")";
            }            
            sql += " ORDER BY f.facturaId, clag.fechaCambio ASC";
            sql = mysql.format(sql, [hFecha, dFecha]);

            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                liquidacionAgenteGeneral(res, false, con,function(err, result) {
                    if (err) return con.rollback(function (err) { done(err) });
                    if(departamentoId == 7) {//procesamos las facturas de reparaciones
                        sql = "SELECT";
                        sql += " f.facturaId, fl.facturaLineaId,f.ano, f.numero, f.serie,";  
                        sql += " f.clienteId, c.nombre, NULL AS contratoId, NULL AS referencia, 7 tipoMantenimientoI,";
                        sql += " c.comercialId AS agenteId, co.nombre AS nombreAgente, co.nif AS nifAgente,";
                        sql += " 1 AS tipoAgente, p.rappel AS porcentajeAgente, p.rappel  AS porAgente,";
                        sql += " NULL AS comercialId, NULL AS nombreComercial, NULL AS nifComercial, NULL AS tipoComercial, 0 AS porComer,";
                        sql += " SUM(fl.totalLinea) AS totalAlCliente, SUM(fl.totalLinea) AS coste,";
                        sql += " ca.comercialId AS histComercialId, DATE_FORMAT(ca.fechaCambio, '%y-%m-%d') AS fechaCambio,"
                        sql += " DATE_FORMAT(f.fecha, '%y-%m-%d') AS fecha"
                        sql += " FROM facturas_lineas AS fl";
                        sql += " LEFT JOIN facturas AS f ON fl.facturaId = f.facturaId";
                        sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
                        sql += " LEFT JOIN clientes_agentes AS ca ON ca.clienteId = c.clienteId";
                        sql += " LEFT JOIN comerciales AS co ON c.comercialId = co.comercialId";
                        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = fl.facturaLineaId";
                        sql += " LEFT JOIN partes AS p ON p.parteId = pl.parteId";
                        sql += " WHERE departamentoId = 7 AND f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
                        if (empresaId != 0) {
                            sql += " AND f.empresaId = " + empresaId;
                        }
                        if (comercialId != 0) {
                            sql += " AND c.agenteId = " + comercialId;
                        }            
                        sql += " GROUP BY f.facturaId, c.comercialId, p.rappel, histComercialId";
                        sql += " ORDER BY f.facturaId, fl.facturaLineaId,ca.fechaCambio ASC";
                        sql = mysql.format(sql, [hFecha, dFecha]);
                        con.query(sql, function (err, res2) {
                            if (err) return con.rollback(function (err2) {  done(err) });
                            if (res.length == 0 && res2.length == 0) {
                                // las consultas no ha devuelto registros
                                return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                            }
                            if (res2.length > 0) {// la segunda consultaa  ha devuelto registros
                                liquidacionAgenteGeneral(res2, true, con,function(err, result2) {
                                    if (err) return con.rollback(function (err2) { done(err) });
                                    con.commit(function (err) {
                                        if (err) return con.rollback(function (err2) { done(err) });
                                        con.end();
                                        done(null, null); // todo correcto
                                    });
                                });
                            } else {
                                con.commit(function (err) {
                                    if (err) return con.rollback(function (err2) { done(err) });
                                    con.end();
                                    done(null, null); // todo correcto
                                });
                            }

                        });

                    } else {
                        if (res.length == 0) {
                            // la consulta no ha devuelto registros
                            return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                        }
                        con.commit(function (err) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            con.end();
                            done(null, null); // todo correcto
                        });
                    }
                });
            })
        })
    });
}

var liquidacionAgenteGeneral = function(res, reparaciones, con, done) {
    if(res.length == 0) return done(null, null);
    var sql = "";
    //montamos un objeto como lineas el historial de agentes del cliente se los tuviese
    res = fnFacturasFromDbToJson(res, reparaciones);
    // hay que montar ir procesando factura a factura
    // como varios registros pueden formar parte de una misma factura hay que mandarlas agrupadas a su procesamiento
    var antFactura;
    if(!reparaciones) {
        antFactura = res[0].facturaId;
    } else {
        antFactura = res[0].facturaLineaId;
    }
    var fs = [];
    var fsl = [];
    var regs = [];
    res.forEach(function (f) {
        var parametro;
        if(!reparaciones) {
            parametro = f.facturaId;
        } else {
            parametro = f.facturaLineaId;
        }
        if (parametro != antFactura) {
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
        con.query(sql, function (err, res) {7
            if (err) return con.rollback(function (err2) { done(err) });
            callback(null);
        });
    }, function (err) {
        if (err) return con.rollback(function (err2) { done(err) });
        done(null, null); // todo correcto
    });
}

var fnFacturasFromDbToJson = function(facturas, reparaciones) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var facturaIdAnt = 0;
    var parametro;
    
    for (var i = 0; i < facturas.length; i++) {
        var f = facturas[i];
        if(!reparaciones) {
            parametro = f.facturaId;
        } else {
            parametro = f.facturaLineaId;
        }
        if (facturaIdAnt != parametro) {
            // es un campo nuevo
            // si ya habiamos procesado uno lo pasamos al vector
            if (cabJs) {
                pdJs.push(cabJs);
            }
            cabJs = {
                nombre: f.nombre,
                facturaId: f.facturaId,
                facturaLineaId: f.facturaLineaId,
                fecha: f.fecha,
                serie: f.serie,
                ano: f.ano,
                numero: f.numero,
                totalAlCliente: f.totalAlCliente,
                coste: f.coste,
                porcentajeAgente: f.porcentajeAgente,
                contratoId: f.contratoId,
                referencia: f.referencia,
                tipoMantenimientoId: f.tipoMantenimientoId,
                comercialId: f.comercialId,
                nombreComercial: f.nombreComercial,
                nifComercial: f.nifComercial,
                tipoComercial: f.tipoComercial,
                porComer: f.porComer,
                agenteId: f.agenteId,
                nombreAgente: f.nombreAgente,
                nifAgente: f.nifAgente,
                tipoAgente: f.tipoAgente,
                porAgente: f.porAgente,
                histAgentes: []
            };
           
            facturaIdAnt = parametro;
        }
        // siempre se procesa una linea
        if (f.histComercialId) {
            linJs = {
                histComercialId: f.histComercialId,
                fechaCambio: f.fechaCambio,
            };
            cabJs.histAgentes.push(linJs);
        }
    }
    if (cabJs) {
        pdJs.push(cabJs);
    }
    return pdJs;
}

var fnProcesarFacturasLiquidacionAgente = function (fsl) {

    var ls = [];
    // calculamos la correspondiente al agente
    var f = fsl[0];
    var l1 = fnUnaLineaVacia(f);
    var calculado = false;
    try {
        if(f.histAgentes.length > 0){
            f.histAgentes.forEach(function (h) {
                if(f.fecha <= h.fechaCambio) {
                    l1.registro.facturaId = f.facturaId;
                    l1.registro.comercialId = h.histComercialId;
                    l1.registro.contratoId = f.contratoId;
                    l1.registro.impCliente = f.totalAlCliente;
                    l1.registro.coste = f.coste;
                    l1.registro.base = f.totalAlCliente;
                    l1.registro.porComer = f.porcentajeAgente;
                    l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
                    l1.tipoComercial = 1; // es un agente
                    ls.push(l1);
                    calculado = true;
                    if(calculado) {
                        throw BreakException;
                    }
                }
            });
        }
    } catch (e) {
    }
    
    if(!calculado) {
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
    }
    var comisAgente = l1.registro.comision;
    return ls;
}


// -- contratos
module.exports.postFacturaLiquidacionContratos = function (dFecha, hFecha, departamentoId, empresaId, comercialId, usuarioId, done) {
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
        sql += " WHERE c.fechaFinal >= ? AND c.fechaFinal <= ? AND c.contratoCerrado = 1";
        if (departamentoId != 0) {
            sql += " AND c.tipoContratoId = " + departamentoId;
        }  else {
            sql += " AND c.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")";
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
            sql += " arqComisAgente, arqPorImpCliente, arqPorImpClienteAgente, arqPorCostes, arqCostes, arqJefeObra, arqOficinaTecnica, arqAsesorTecnico, arqComercial, ";
            sql += " repComisAgente, repPorImpCliente, repPorImpClienteAgente, repPorCostes, repCostes, repJefeObra, repOficinaTecnica, repAsesorTecnico, repComercial, ";
            sql += " obrComisAgente, obrPorImpCliente, obrPorImpClienteAgente, obrPorCostes, obrCostes, obrJefeObra, obrOficinaTecnica, obrAsesorTecnico, obrComercial ";
            sql += " FROM contratos AS cm";
            sql += " LEFT JOIN (SELECT contratoId, SUM(total) AS facturado,  SUM(totalAlCliente) AS facturadoAlCliente FROM facturas GROUP BY contratoId) AS cm2 ON cm2.contratoId = cm.contratoId";
            sql += " LEFT JOIN (SELECT contratoId, SUM(importe) AS gastos FROM facprove_serviciados GROUP BY contratoId) AS cm3 ON cm3.contratoId = cm.contratoId";
            sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = cm.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " WHERE NOT cmc.comercialId IS NULL";
            sql += " AND cm.fechaFinal <= ? AND cm.fechaFinal >= ? AND cm.sel = 1";
            if (departamentoId != 0) {
                sql += " AND cm.tipoContratoId = " + departamentoId;
            } else {
                sql += " AND cm.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")";
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
                        con.end();
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
                l.registro.PC = (c.facturado * c.manPorImpCliente) / 100.0;
            }
            if (c.manPorImpClienteAgente && c.manPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturado - comisAgente) * c.manPorImpClienteAgente) / 100.0;
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
            if (c.segPorCostes && c.segPorCostes != 0) {
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
            if (c.finPorCostes && c.finPorCostes != 0) {
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
            if (c.arqPorCostes && c.arqPorCostes != 0) {
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
        if (c.tipoMantenimientoId == 7) {
            // reparaciones
            if (c.repComisAgente && c.repComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.repPorImpCliente && c.repPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.repPorImpCliente) / 100.0;
            }
            if (c.repPorImpClienteAgente && c.repPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.repPorImpClienteAgente) / 100.0;
            }
            if (c.repPorCostes && c.repPorCostes != 0) {
                l.registro.PCO = (c.gastos * c.repPorCostes) / 100.0;
            }
            if (c.repCostes && c.repCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.repJefeObra || c.repJefeObra == 0) &&
                (!c.repOficinaTecnica || c.repOficinaTecnica == 0) &&
                (!c.repAsesorTecnico || c.repAsesorTecnico == 0) &&
                (!c.repComercial || c.repComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }               
        if (c.tipoMantenimientoId == 8) {
            // obras
            if (c.obrComisAgente && c.obrComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.obrPorImpCliente && c.obrPorImpCliente != 0) {
                l.registro.PC = (c.facturadoAlCliente * c.obrPorImpCliente) / 100.0;
            }
            if (c.obrPorImpClienteAgente && c.obrPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturadoAlCliente - comisAgente) * c.obrPorImpClienteAgente) / 100.0;
            }
            if (c.obrPorCostes && c.obrPorCostes != 0) {
                l.registro.PCO = (c.gastos * c.obrPorCostes) / 100.0;
            }
            if (c.obrCostes && c.obrCostes != 0) {
                l.registro.ICO = c.gastos;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!c.obrJefeObra || c.obrJefeObra == 0) &&
                (!c.obrOficinaTecnica || c.obrOficinaTecnica == 0) &&
                (!c.obrAsesorTecnico || c.obrAsesorTecnico == 0) &&
                (!c.obrComercial || c.obrComercial == 0)) {
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
            if (l.origen.tipoMantenimientoId == 4) {
                // fincas
                if (l.origen.finJefeObra && l.origen.finJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.finOficinaTecnica && l.origen.finOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.finAsesorTecnico && l.origen.finAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.finComercial && l.origen.finComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 5) {
                // arquitectura
                if (l.origen.arqJefeObra && l.origen.arqJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.arqOficinaTecnica && l.origen.arqOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.arqAsesorTecnico && l.origen.arqAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.arqComercial && l.origen.arqComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 7) {
                // reparaciones
                if (l.origen.repJefeObra && l.origen.repJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.repOficinaTecnica && l.origen.repOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.repAsesorTecnico && l.origen.repAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.repComercial && l.origen.repComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 8) {
                // obraraciones
                if (l.origen.obrJefeObra && l.origen.obrJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.obrOficinaTecnica && l.origen.obrOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.obrAsesorTecnico && l.origen.obrAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.obrComercial && l.origen.obrComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            fnCalculoComisionDeUnRegistro(l.registro);
        }
    })
    return l2;
}


//creacion de report json
module.exports.postCrearReportColaboradores = function (dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, callback) {
    var connection = getConnection();
    var sql = "";
    var obj = 
        {
            liqAgente: ""
        }
        if(departamentoId !=7 && departamentoId > 0) {
            sql = "SELECT";
            sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
            sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
            sql += " com.comercialId,";
            sql += " com.nombre AS nomComercial,";
            sql += " tpp.nombre AS tipoProyecto,";
            sql += " cli.nombre AS nomCliente,";
            sql += " cnt.direccion,"
            sql += " cnt.referencia,";
            sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
            sql += " fac.numero,";
            sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
            sql += " fac.facturaId,";
            sql += " fac.fecha,";
            sql += " fac.serie,";
            sql += " fac.ano,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador, ";
            sql += "  DATE_FORMAT(cnt.fechaFinal, '%Y-%m-%d') AS fechaFinal";
            sql += " FROM liquidacion_comercial AS liq";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = cnt.tipoContratoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = cnt.tipoProyectoId";
            if(tipoComercialId != 1) {
                sql += " WHERE cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
            } else {
                sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            }
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            if (departamentoId && departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = " + departamentoId;
            }else {
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"
            }
        }
        else if(departamentoId == 7)  {
            sql = "SELECT";
            sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
            sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,"
            sql += " com.comercialId,"; 
            sql += " com.nombre AS nomComercial,";
            sql += " '' AS tipoProyecto,";
            sql += " cli.nombre AS nomCliente,";
            sql += " '' AS direccion,";
            sql += " '' AS referencia,";
            sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
            sql += " fac.numero,";
            sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
            sql += " fac.facturaId,"
            sql += " fac.fecha,";
            sql += " fac.serie,";
            sql += " fac.ano,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " NULL AS fechaFinal ";
            sql += " FROM liquidacion_comercial AS liq ";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7";
        }
        else {
            sql = "SELECT";
            sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
            sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
            sql += " com.comercialId,";
            sql += " com.nombre AS nomComercial,";
            sql += " tpp.nombre AS tipoProyecto,";
            sql += " cli.nombre AS nomCliente,";
            sql += " cnt.direccion,"
            sql += " cnt.referencia,";
            sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
            sql += " fac.numero,";
            sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
            sql += " fac.facturaId,";
            sql += " fac.fecha,";
            sql += " fac.serie,";
            sql += " fac.ano,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador, ";
            sql += "  DATE_FORMAT(cnt.fechaFinal, '%Y-%m-%d') AS fechaFinal";
            sql += " FROM liquidacion_comercial AS liq";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = cnt.tipoContratoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = cnt.tipoProyectoId";
            if(tipoComercialId != 1) {
                sql += " WHERE cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
            } else {
                sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            }
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+")"
    
            sql += " UNION";
    
            sql += " SELECT";
            sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
            sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,"
            sql += " "
            sql += " com.comercialId,"; 
            sql += " com.nombre AS nomComercial,";
            sql += " '' AS tipoProyecto,";
            sql += " cli.nombre AS nomCliente,";
            sql += " '' AS direccion,";
            sql += " '' AS referencia,";
            sql += " CONCAT(fac.serie, '-', fac.ano, '-', fac.numero) AS numfactu,";
            sql += " fac.numero,";
            sql += " DATE_FORMAT(fac.fecha, '%Y-%m-%d') AS fechaBis,";
            sql += " fac.facturaId,"
            sql += " fac.fecha,";
            sql += " fac.serie,";
            sql += " fac.ano,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " NULL AS fechaFinal ";
            sql += " FROM liquidacion_comercial AS liq ";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7";
    
        }

    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)    return callback(err, null);
        obj.liqAgente = result;
        async.forEachSeries(result, function(f, done) {
            fnFacturaConta(f.facturaId, function (err, rows) {
                if (err) return done(err);
                if (rows.length == 0) {
                    done(); 
                }else {
                    var fa = rows[0];
                    var numserie = fa.serie;
                    var numfactu = fa.numfac;
                    var fecfactu = fa.fecha;
                    var conta = fa.contabilidad;
                    var facturaId = fa.facturaId;
                    fnCobroEnConta(conta, numserie, numfactu, fecfactu, facturaId,function (err, cobros) {
                        if (err) return done(err);
                        f = procesaCobros(cobros, f)
                        done();
                    });
                }
               
            });
        },function(err) {
            if(err) return callback(err);
            callback(null, obj);
        });
        
       // obj.libCli = procesaResultado(result);

       /*  var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\listado.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });
         */
        
    });

var procesaCobros = function(cobros, f) {
    f.devuelto = 0;
    f.recobrado = 0;
    f.ultCobro = null;
    cobros.forEach(c => {
        if(!c.impcobro && c.Devuelto ==1) f.devuelto += c.impvenci;
        if(c.impcobro && c.Devuelto == 1) {
            f.devuelto += c.impvenci;
            f.ultCobro = c.fecultco
        }
    });
    return f;
}
// devuelve la información sobre la factura y la contabilidad
// en la que debe estar su cobro según la empresa emisora
var fnFacturaConta = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT f.facturaId, ano, numero, CONCAT(ano, LPAD(f.numero,6, '0')) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        done(null, rows);
    })
}

// fnCobroEnConta
// Obtiene los cobros de la factura pasada en la contabilidad indicada
var fnCobroEnConta = function (conta, numserie, numfactu, fecfactu, facturaId, done) {
    numfactu = numfactu.toString();
    var nums = [];
    //comprobamos si hay anticipos
    var conection = getConnection();
    var sql = "SELECT CONCAT(ano,LPAD(numero, 6, 0)) AS numfactu";
    sql += " FROM factura_antcliens AS fa";
    sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
    sql += " WHERE fa.facturaId =  ?";
    sql = mysql.format(sql, facturaId);
    conection.query(sql, function (err, rows) {
        conection.end();
        if (err) return done(err);
        if(rows.length > 0) {
            for(var i = 0; i < rows.length; i++) {
                var n = rows[i].numfactu.toString();
                nums.push(n);
            }
        }
        var con = getConnection();
        sql = "SELECT c.*, fp.nomforpa ";
        sql += " FROM " + conta + ".cobros AS c";
        sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
        sql += " WHERE ";
        sql += "(numserie =  ?";
        sql += " AND numfactu = ?)";
        sql = mysql.format(sql, [numserie, numfactu]);
        if(nums.length > 0) {
            sql += " OR";
            sql += " (numserie = 'ANT'";
            sql += " AND numfactu IN (?))";
            sql = mysql.format(sql, [nums]);
        }
        sql += " ORDER BY c.fecvenci DESC";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    });
}
 
}
