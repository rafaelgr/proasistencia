// liquidacion_db_mysql
// Manejo de la tabla liquidacion_comercial en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 =require('mysql2/promise')
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');

// File System module
var fs = require('fs');
const e = require("express");

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

// deleteAnticipo
// Elimina la última liquidación de agente de un departamento pasado
module.exports.deleteUltimaLiquidacion = async (departamentoId) => {
    let connection = null;
    var ids = [];
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            //recuperamos los ids de las facturas de la última liquidación del departamento
            var sql = "SELECT l.dFecha, l.hFecha, l.facturaId FROM liquidacion_comercial AS l";
            sql += " INNER JOIN facturas AS f ON f.facturaId = l.facturaId";
            sql += " WHERE f.departamentoId = ?";
            sql += " AND l.dFecha = (";
	        sql += " SELECT MAX(dFecha) FROM liquidacion_comercial AS l";
	        sql += " INNER JOIN facturas AS f ON f.facturaId = l.facturaId";
	        sql += " WHERE f.departamentoId = ?)";
            const [result] = await connection.query(sql, [departamentoId, departamentoId]);
            if(result.length > 0) {
                var dFecha = new Date(result[0].dFecha);
                var hFecha = new Date(result[0].hFecha);
                result.forEach(function(e) {
                    ids.push(e.facturaId);
                });
                //borramos las liquidaciones de las facturas seleccionadas del periodo
                sql = "DELETE from liquidacion_comercial";
                sql += " WHERE facturaId IN (?)";
                sql += " AND dFecha = ?";
                const [result2] = await connection.query(sql, [ids, dFecha]);
                 //Actualizamos las facturas como no liquidadas
                 sql = "UPDATE facturas set liquidadaAgente = 0";
                 sql += " WHERE facturaId IN (?)";
                 const [result3] = await connection.query(sql, [ids]);
                 //Si el departamento es de obras borramos también los registros de la tabla liquidacion_comercial_obras
                 if(departamentoId == 8) {
                    sql = "DELETE FROM liquidacion_comercial_obras";
                    sql += " WHERE  dFecha = ?";
                    sql += " AND hFecha = ?";
                    const [result4] = await connection.query(sql, [dFecha, hFecha]);
                 }
                 await connection.end();
                resolve (result3);
            } else {
                var err = new Error("Error, no se han devuelto registros");
                throw err;
            }
        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }
    });
}

// deleteAnticipo
// Elimina la última liquidación de un departamento pasado
module.exports.deleteUltimaLiquidacionContrato = async (departamentoId) => {
    let connection = null;
    var ids = [];
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            //recuperamos los ids de los contratos de la última liquidación del departamento
            var sql = "SELECT l.dFecha, l.hFecha, l.contratoId FROM liquidacion_comercial AS l";
            sql += " INNER JOIN contratos AS c ON c.contratoId = l.contratoId";
            sql += " WHERE c.tipoContratoId = ?";
            sql += " AND l.dFecha = (";
            sql += " 	SELECT MAX(dFecha) FROM liquidacion_comercial AS l";
            sql += " 	INNER JOIN contratos AS c ON c.contratoId = l.contratoId";
            sql += " 	WHERE c.tipoContratoId = ? AND l.facturaId IS NULL";
            sql += " ) ";
            sql += " AND l.facturaId IS NULL";
            const [result] = await connection.query(sql, [departamentoId, departamentoId]);
            if(result.length > 0) {
                var dFecha = new Date(result[0].dFecha);
                result.forEach(function(e) {
                    ids.push(e.contratoId);
                });
                //borramos las liquidaciones de las contratos seleccionados del periodo
                sql = "DELETE from liquidacion_comercial";
                sql += " WHERE contratoId IN (?)";
                sql += " AND dFecha = ? AND facturaId IS NULL ";
                const [result2] = await connection.query(sql, [ids, dFecha]);
                 //Actualizamos las facturas como no liquidadas
                 sql = "UPDATE contratos_comisionistas set liquidado = 0";
                 sql += " WHERE contratoId IN (?)";
                 const [result3] = await connection.query(sql, [ids]);
                 await connection.end();
                resolve (result3);
            } else {
                var err = new Error("Error, no se han devuelto registros");
                throw err;
            }
        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }
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
            comision: 0,
            anticipo: 0,
            pendientePeriodo: 0,
            pendienteAnterior: 0,
            pagadoPeriodo: 0,
            pagadoAnterior: 0
        },
        tipoComercial: l.tipoComercial
    };
    return l1;
}

var fnCalculoComisionDeUnRegistro = function (r) {
    var base = r.impCliente - r.CA - r.PC - r.PCA - r.PCO - r.ICO - r.IJO - r.IOT - r.IAT - r.IC;
    r.base = base;
    if(!r.porComer ||  r.porComer == undefined)  r.porComer = 0;
    r.comision = (base * r.porComer) / 100.0;
    r.comision = r.comision - r.anticipo //descontamos los anticipos
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
        sql += "  WHERE (f.fecha >= ? AND f.fecha <= ? AND f.sel = 1";
        sql = mysql.format(sql, [dFecha, hFecha]);
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
        sql += " ) OR";
        sql += "  (f.fecha < ?  AND f.sel = 1";
        sql = mysql.format(sql, [dFecha]);
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
        sql += " )";
        
        sql += ")";
        /*
        if (tipoComercialId != 0) {
            sql += " AND comercialId IN (";
            sql += "SELECT comercialId FROM comerciales WHERE tipoComercialId = " + tipoComercialId + ")";
        }
        */
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            sql = " SELECT ";
            sql += " cli.nombre, clag.comercialId AS histComercialId,";
            sql += " DATE_FORMAT(clag.fechaCambio, '%y-%m-%d') AS fechaCambio, f.facturaId,";
            sql += " DATE_FORMAT(f.fecha, '%y-%m-%d') AS fecha, DATE_FORMAT( '" + dFecha + "', '%y-%m-%d') AS inicioPeriodo,";
            sql += " DATE_FORMAT( '" + hFecha + "', '%y-%m-%d') AS finPeriodo, f.serie, f.ano, f.numero, f.totalAlCliente, f.coste,";
            sql += " f.porcentajeAgente, cm.contratoId, cm.ascContratoId, cm.referencia, cm.tipoContratoId AS tipoMantenimientoId,";
            sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
            sql += " f.esSegura";
            sql += " FROM facturas AS f";
            sql += " LEFT JOIN contratos AS cm ON cm.contratoId = f.contratoId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cm.clienteId";
            sql += " LEFT JOIN clientes_agentes AS clag ON clag.clienteId = cm.clienteId";
            sql += " WHERE (f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
            sql = mysql.format(sql, [hFecha, dFecha]);
            if (departamentoId != 0 && departamentoId != 7) {//se procesa el departamento de reparaciones despues de procesar el resto
                sql += " AND f.departamentoId = " + departamentoId;
            }else {
                sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE departamentoId != 7 AND usuarioId = "+ usuarioId+")"        
            }
            if (empresaId != 0) {
                sql += " AND f.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND (cm.agenteId = " + comercialId +  ")";
            }            
            sql += ") OR";
            sql += " (f.fecha < ? AND f.sel = 1";
            sql = mysql.format(sql, [dFecha]);
            if (departamentoId != 0 && departamentoId != 7) {//se procesa el departamento de reparaciones despues de procesar el resto
                sql += " AND f.departamentoId = " + departamentoId;
            }else {
                sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE departamentoId != 7 AND usuarioId = "+ usuarioId+")"        
            }
            if (empresaId != 0) {
                sql += " AND f.empresaId = " + empresaId;
            }
            if (comercialId != 0) {
                sql += " AND (cm.agenteId = " + comercialId + ")";
            }      
            sql += ")";      
            sql += " ORDER BY f.facturaId, clag.fechaCambio ASC";
            
            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                liquidacionAgenteGeneral(res, departamentoId,false, con,function(err, result) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    if(departamentoId == 7) {//procesamos las facturas de reparaciones
                        sql = "SELECT";
                        sql += " f.facturaId, fl.facturaLineaId,f.ano, f.numero, f.serie,";  
                        sql += " f.clienteId, c.nombre, NULL AS contratoId, NULL AS ascContratoId,NULL AS referencia, 7 tipoMantenimientoI,";
                        sql += " c.comercialId AS agenteId, co.nombre AS nombreAgente, co.nif AS nifAgente,";
                        sql += " 1 AS tipoAgente, p.rappel AS porcentajeAgente, p.rappel  AS porAgente,";
                        sql += " NULL AS comercialId, NULL AS nombreComercial, NULL AS nifComercial, NULL AS tipoComercial, 0 AS porComer,";
                        sql += " SUM(fl.totalLinea) AS totalAlCliente, SUM(fl.totalLinea) AS coste,";
                        sql += " ca.comercialId AS histComercialId, DATE_FORMAT(ca.fechaCambio, '%y-%m-%d') AS fechaCambio,"
                        sql += " DATE_FORMAT(f.fecha, '%y-%m-%d') AS fecha, f.esSegura, DATE_FORMAT( '" + dFecha + "', '%y-%m-%d') AS inicioPeriodo,";
                        sql += "  DATE_FORMAT( '" + hFecha + "', '%y-%m-%d') AS finPeriodo"
                        sql += " FROM facturas_lineas AS fl";
                        sql += " LEFT JOIN facturas AS f ON f.facturaId = fl.facturaId";
                        sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
                        sql += " LEFT JOIN clientes_agentes AS ca ON ca.clienteId = c.clienteId";
                        sql += " LEFT JOIN comerciales AS co ON co.comercialId = c.comercialId";
                        sql += " LEFT JOIN partes_lineas AS pl ON pl.facturaLineaId = fl.facturaLineaId";
                        sql += " LEFT JOIN partes AS p ON p.parteId = pl.parteId";
                        sql += " WHERE (departamentoId = 7 AND f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
                        sql = mysql.format(sql, [hFecha, dFecha]);
                        if (empresaId != 0) {
                            sql += " AND f.empresaId = " + empresaId;
                        }
                        if (comercialId != 0) {
                            sql += " AND c.agenteId = " + comercialId;
                        }          
                        sql += ") OR";
                        sql += " (departamentoId = 7 AND f.fecha < ?  AND f.sel = 1";
                        sql = mysql.format(sql, [dFecha]);
                        if (empresaId != 0) {
                            sql += " AND f.empresaId = " + empresaId;
                        }
                        if (comercialId != 0) {
                            sql += " AND c.agenteId = " + comercialId;
                        }    
                        sql += ")";          
                        sql += " GROUP BY f.facturaId, c.comercialId, p.rappel, ca.clienteAgenteId";
                        sql += " ORDER BY f.facturaId, fl.facturaLineaId,ca.fechaCambio ASC";
                        con.query(sql, function (err, res2) {
                            if (err) return con.rollback(function (err2) {  done(err) });
                            if (res2.length == 0) {
                                // las consultas no ha devuelto registros
                                return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                            }
                            if (res2.length > 0) {// la segunda consultaa  ha devuelto registros
                                liquidacionAgenteGeneral(res2, departamentoId, true, con,function(err, result2) {
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
                        //UNA VEZ SE HA LIQUIDADO PROCESAMOS LAS LIQUIDACIONES DE OBRAS
                        if(departamentoId == 8) {
                            procesaLiquidacionesObras(dFecha, hFecha, con, function(err, result) {
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
                    }
                });
            })
        })
    });
}

var liquidacionAgenteGeneral = function(res, departamentoId, reparaciones, con, done) {
    if(departamentoId == 7 && !reparaciones) return done(null, null); // con los resultados de la primera sql si es de reparaciones no hacemos nada
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
        delete r.ascContratoId;
        sql = "INSERT INTO liquidacion_comercial SET ?";
        sql = mysql.format(sql, r);
        con.query(sql, function (err, res) {
            if (err) return callback(err);
            //actualizamos la factutra correspondiente como liquidadaAgentesi no tiene nungún pago pendiente
            if((r.pagadoPeriodo !=0 || r.pagadoAnterior !=0) && (r.pendientePeriodo == 0 || r.pendienteAnterior == 0)) {
                sql = "UPDATE facturas set liquidadaAgente = 1";
                sql += " WHERE facturaId = " + r.facturaId; 
                con.query(sql, function (err, res) {
                    if (err) return callback(err)
                    callback(null);
                });
            } else {
                callback(null);
            }
        });
    }, function (err) {
        if (err) return con.rollback(function (err2) { done(err) });
        done(null, null); // todo correcto
    });
}

var procesaLiquidacionesObras = function(dFecha, hFecha, con, done) {
    var periodoAnterior = {};
    var ids = [];
    var sql;
    //primero borramos las liquidaciones que pueda haber del periodo
    sql = "DELETE FROM liquidacion_comercial_obras  WHERE dFecha = ? AND hFecha = ?"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        if (err) return con.rollback(function (err2) { done(err) });
        //seleccionamos el periodo anterior
    sql = " SELECT DISTINCT dFecha, hFecha FROM liquidacion_comercial_obras AS l ";
    sql += " LEFT JOIN contratos AS c ON c.contratoId = l.contratoId";
    sql += " WHERE l.dFecha < ? AND c.tipoContratoId = 8 ORDER BY l.dFecha DESC";
    sql = mysql.format(sql, dFecha);
    con.query(sql, function (err, res) {
        if (err) return con.rollback(function (err2) { done(err) });
        if(res.length > 0) {
            periodoAnterior = res[0];
            periodoAnterior.dFecha = moment(periodoAnterior.dFecha).format('YYYY-MM-DD');
            periodoAnterior.hFecha = moment(periodoAnterior.hFecha).format('YYYY-MM-DD');
        } else {
            periodoAnterior.dFecha = null;
            periodoAnterior.hFecha = null;
        }
        sql = "SELECT l.contratoId,";
        sql += " c.firmaActa,";
        sql += " c.fechaFirmaActa,";
        sql += " c.importeCliente AS importeObra,";
        sql += " c.certificacionFinal AS certificacionFinal,";
        sql += " COALESCE(lo.facturado, 0) - (SUM(l.pagadoAnterior) + SUM(l.pendienteAnterior)) + SUM(l.impCliente)  AS facturado,";
        sql += " SUM(l.pagadoPeriodo)+ SUM(l.pagadoAnterior)+ COALESCE(lo.abonado, 0) AS abonado,";
        sql += " c.importeCliente - (SUM(l.pagadoPeriodo)+ SUM(l.pagadoAnterior)+ COALESCE(lo.abonado, 0)) AS pendienteAbono,";
        sql += " IF(lo.facturado, 1, 0) AS regAnte,";
        sql += " COALESCE(lo.pagadoPeriodo30, 0) AS pagadoPeriodo30,";
        sql += " COALESCE(lo.pagadoPeriodo20, 0) AS pagadoPeriodo20,";
        sql += " COALESCE(lo.pagadoPeriodo50, 0) AS pagadoPeriodo50,";

        sql += " COALESCE(lo.pagadoAnterior30, 0) AS pagadoAnterior30,";
        sql += " COALESCE(lo.pagadoAnterior20, 0) AS pagadoAnterior20,";
        sql += " COALESCE(lo.pagadoAnterior50, 0) AS pagadoAnterior50,";
        sql += " COALESCE(lo.adicionalPagadoAnterior, 0) AS adicionalPagadoAnterior,";
        sql += " COALESCE(lo.adicionalPagadoPeriodo, 0) AS adicionalPagadoPeriodo,";
        sql += " COALESCE(lo.baseAdicional, 0) AS baseAdicional,";
        

        sql += " COALESCE(lo.baseAnterior, 0) AS baseAnterior,";
        sql += " l.porComer,";
        sql += " l.comercialId,";
        sql += " l.dFecha AS dFecha,";
        sql += " l.hFecha AS hFecha";
        sql += " FROM liquidacion_comercial AS l";
        sql += " LEFT JOIN";
        sql += " (SELECT ";
        sql += " c.contratoId, tipoContratoId,";
        sql += " COALESCE(c.importeCliente, 0) + COALESCE(c2.impCliente,0) AS importeCliente,";
        sql += " COALESCE(c.certificacionFinal, 0) + COALESCE(c2.certFinal,0) AS certificacionFinal,";
        sql += " c.firmaActa, c.fechaFirmaActa";
        sql += " FROM contratos AS c";
        sql += " LEFT JOIN";
        sql += " (SELECT ascContratoId, SUM(importeCliente) impCliente, SUM(certificacionFinal) certFinal";
        sql += " FROM contratos";
        sql += " WHERE NOT ascContratoId IS NULL";
        sql += " GROUP BY ascContratoId) AS c2 ON c2.ascContratoId = c.contratoId) AS c ON c.contratoId = l.contratoId";
        sql += " LEFT JOIN"
        sql += " (SELECT";
        sql += " contratoId,";
        sql += " COALESCE(pagadoPeriodo30, 0) AS pagadoPeriodo30,";
        sql += " COALESCE(pagadoPeriodo20, 0) AS pagadoPeriodo20,";
        sql += " COALESCE(pagadoPeriodo50, 0) AS pagadoPeriodo50,";

        sql += " COALESCE(pagadoAnterior30, 0) AS pagadoAnterior30,";
        sql += " COALESCE(pagadoAnterior20, 0) AS pagadoAnterior20,";
        sql += " COALESCE(pagadoAnterior50, 0) AS pagadoAnterior50,";

        sql += " COALESCE(baseAnterior, 0) AS baseAnterior,";
        sql += " COALESCE(baseAdicional, 0) AS baseAdicional,";
        sql += " COALESCE(SUM(abonado), 0) AS abonado, COALESCE(SUM(facturado), 0) AS facturado,"
        sql += " COALESCE(adicionalPagadoPeriodo, 0) AS adicionalPagadoPeriodo,"
        sql += " COALESCE(adicionalPagadoAnterior, 0) AS adicionalPagadoAnterior"
        sql += " FROM liquidacion_comercial_obras WHERE dFecha >= ? and hFecha <= ?";
        sql += " GROUP BY contratoId";
        sql += " ) AS lo ON lo.contratoId = l.contratoId";
        sql += " WHERE c.tipoContratoId = 8";
        sql += " AND l.dFecha = ? AND l.hFecha = ?";
        sql += " GROUP BY contratoId, comercialId";
        sql = mysql.format(sql, [periodoAnterior.dFecha, periodoAnterior.hFecha, dFecha, hFecha]);
        con.query(sql, function (err, res1) {
            if (err) return con.rollback(function (err2) { done(err) });
            res1.forEach(e => {
                ids.push(e.contratoId);
            });
            //RECUPERAMOS EL CONTRATOID QUE TINEN LA FIRMA DE ACTA EN EL PERIODO Y NO TIENEN FACTURAS LIQUIDADAS
            sql = "SELECT c.contratoId FROM contratos AS c";
            sql +=" WHERE (NOT c.fechaFirmaActa IS NULL";
            sql +" AND c.tipoContratoId = 8";
            sql +=" AND c.fechaFirmaActa >= ?";
            sql +=" AND c.fechaFirmaActa <= ?)";
            sql += " AND"
            sql += " (NOT c.contratoId  IN (" + ids + "))";
            sql = mysql.format(sql, [dFecha, hFecha]); 
            con.query(sql, function (err, res2) {
                if (err) return con.rollback(function (err2) { done(err) });
                if(res2) {
                    if(res2.length > 0) {
                        //RECUPERAMOS LAS ÁULTIMAS LIQUIDACIONES DE LOS CONTRATOS ANTERIORES
                        async.eachSeries(res2, function (r, callback) {
                        sql = " SELECT ll.*, c.fechaFirmaActa, c.firmaActa, 1 AS regAnte  FROM contratos AS c";
                        sql += " INNER JOIN ";
                        sql += " (";
                        sql += "    SELECT * FROM liquidacion_comercial_obras";
                        sql += " WHERE contratoId = " + r.contratoId;
                        sql += " ORDER BY dFecha DESC LIMIT 1";
                        sql += " ) AS ll ON ll.contratoId = c.contratoId ";
                        con.query(sql, function (err, liqAnt) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            //arreglamos los registos
                            if(liqAnt) {
                                if(liqAnt.length > 0) {
                                    delete liqAnt[0].liquidacionComercialObrasId;
                                    liqAnt[0].dFecha = dFecha;
                                    liqAnt[0].hFecha = hFecha;
                                    res1.push(liqAnt[0]);
                                }
                            }
                            callback();
                
                        });
                        },function (err) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            procesaLiquidacionObras2(res1, dFecha, hFecha, con, function(err, data) {
                                if (err) return con.rollback(function (err2) { done(err) });
                                done(null, null); // todo correcto
                            })
                        });
                    } else {
                        procesaLiquidacionObras2(res1, dFecha, hFecha, con, function(err, data) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            done(null, null); // todo correcto
                        })
                    } 

                } else {
                    procesaLiquidacionObras2(res1, dFecha, hFecha, con, function(err, data) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        done(null, null); // todo correcto
                    });
                }             
            });
        });
    });

    });
}

var procesaLiquidacionObras2 = function(res1, dFecha, hFecha, con, done) {
     //MIRAMOS LOS REGISTROS PARA VER SI HAY LIQUIDACIONES ANTERIORES O ES UN REGISTRO NUEVO
     async.eachSeries(res1, function (r, callback) {
        sql = "SELECT * FROM liquidacion_comercial_obras WHERE contratoId = ?";
        sql += " ORDER BY dFecha DESC LIMIT 1";
        sql = mysql.format(sql, r.contratoId);
        con.query(sql, function (err, res3) {
            if (err) return done(err);
        //MIRAMOS SI TIENE LIQUIDACIONES ESTE PERIODO YA QUE ESTO AFECTA A LOS CALCULOS
            sql = "SELECT * FROM liquidacion_comercial WHERE contratoId = ?";
            sql += " AND dFecha = ? AND hFecha = ?";
            sql = mysql.format(sql, [r.contratoId, dFecha, hFecha]);
            con.query(sql, function (err, liqPeriodo) {
                if (err) return done(err);
                var liquidacionAnterior = null;
                var firmaCopia = null;
                var fechaFirmaCopia = null;
                // si hay un registro anterior lo establecemos
                if(res3) { 
                    if(res3.length > 0 && r.regAnte == 0) {
                        liquidacionAnterior = res3[0];
                        var firmaCopia = r.firmaActa;
                        var fechaFirmaCopia = r.fechaFirmaActa;

                        if(liqPeriodo.length > 0) {
                            var abo = liquidacionAnterior.abonado + r.abonado;
                            var fac = liquidacionAnterior.facturado + r.facturado;
                            var pend = liquidacionAnterior.importeObra - (liquidacionAnterior.facturado + r.facturado);

                            liquidacionAnterior.abonado = abo;
                            liquidacionAnterior.facturado = fac;
                            liquidacionAnterior.pendienteAbono = pend;

                        }

                        r = liquidacionAnterior;
                        r.liquidacionComercialObrasId = 0;
                        r.firmaActa = firmaCopia;
                        r.fechaFirmaActa = fechaFirmaCopia;
                        r = calculaLiquidacionObras(r, dFecha, hFecha);
                        var sql2 = "INSERT INTO liquidacion_comercial_obras set ?"
                        sql2 = mysql.format(sql2, r);
                        con.query(sql2, function (err, res) {
                            if (err) return done(err);
                            callback();
                        });
                    } else {
                        r = calculaLiquidacionObras(r,dFecha, hFecha);
                        var sql2 = "INSERT INTO liquidacion_comercial_obras set ?"
                        sql2 = mysql.format(sql2, r);
                        con.query(sql2, function (err, res) {
                            if (err) return done(err);
                            callback();
                        });

                    }

                } else {
                    r = calculaLiquidacionObras(r,dFecha, hFecha);
                    var sql2 = "INSERT INTO liquidacion_comercial_obras set ?"
                    sql2 = mysql.format(sql2, r);
                    con.query(sql2, function (err, res) {
                        if (err) return done(err);
                        callback();
                    });
                }

            });
        });
    },function (err) {
        if (err) return done(err);
        done(null, null); // todo correcto
    });
}


var calculaLiquidacionObras = function(r, dFecha, hFecha) {
    if(!r.adicionalPagadoAnterior) r.adicionalPagadoAnterior = 0;
    if(!r.adicionalPagadoPeriodo) r.adicionalPagadoPeriodo = 0;
    var cincuentaPor = r.importeObra / 2;
    var base30 = 0;
    var base20 = 0;
    var base50 = 0;
    var basePeriodo = 0;
    var baseAnterior = 0;
    var pagado30 = false;
    var pagado20 = false;
    var pagado50 = false;
    var totalLiq = 0;
    var totalLiqCert = 0;
    var diaActual = new Date();
    diaActual =  moment(diaActual).format('YYYY-MM-DD');
    var firmActa =  moment(r.fechaFirmaActa).format('YYYY-MM-DD');
    var dif = (r.certificacionFinal - r.importeObra);
    dif = r.importeObra + dif;
    var enteroAbonado = Math.trunc(r.abonado);
    var enterCertificacionFinal = Math.trunc(r.certificacionFinal)

    //diaActual = new Date(diaActual);
    //firmActa = new Date(firmActa);

    if(r.pagadoPeriodo30 == 0 && r.pagadoAnterior30 == 0) {
        if(r.abonado > cincuentaPor || r.abonado == cincuentaPor) {
            base30 = r.importeObra * 0.30;
            r.pagadoPeriodo30 = base30;
            basePeriodo += r.pagadoPeriodo30;
            pagado30 = true;
       }
    } else if(r.pagadoPeriodo30 > 0) {
        r.pagadoAnterior30 = r.pagadoPeriodo30;
        r.pagadoPeriodo30 = 0;
        baseAnterior += r.pagadoAnterior30;
        pagado30 = true;
    } else if(r.pagadoAnterior30 > 0) {
        pagado30 = true;
    }

    if(r.pagadoPeriodo20 == 0 && r.pagadoAnterior20 == 0) {
        if(r.firmaActa != 0 && (firmActa >= dFecha && firmActa <= hFecha)) {
            base20 = r.importeObra * 0.20;  
            r.pagadoPeriodo20 = base20;
            basePeriodo += r.pagadoPeriodo20;
            pagado20 = true;
       }
    } else if(r.pagadoPeriodo20 > 0) {
        r.pagadoAnterior20 = r.pagadoPeriodo20;
        r.pagadoPeriodo20 = 0;
        baseAnterior += r.pagadoAnterior20;
        pagado20 = true;
    } else if(r.pagadoAnterior20 > 0) {
        pagado20 = true;
    }

    if(r.pagadoPeriodo50 == 0 && r.pagadoAnterior50 == 0) {
        if(r.abonado > r.importeObra || r.abonado == r.importeObra) {
            base50 = r.importeObra * 0.50;
            r.pagadoPeriodo50 = base50;
            basePeriodo += r.pagadoPeriodo50
            pagado50 = true;
        } else if (r.certificacionFinal > 0 && r.abonado == dif) {
            base50 = r.importeObra * 0.50;
            r.pagadoPeriodo50 = base50;
            basePeriodo += r.pagadoPeriodo50
            pagado50 = true;
        }
    } else if(r.pagadoPeriodo50 > 0) {
        r.pagadoAnterior50 = r.pagadoPeriodo50;
        r.pagadoPeriodo50 = 0;
        baseAnterior += r.pagadoAnterior50;
        pagado50 = true;
    } else if(r.pagadoAnterior50 > 0) {
        pagado50 = true;
    }

    if(r.adicionalPagadoPeriodo) {
       r.adicionalPagadoAnterior = r.adicionalPagadoPeriodo;
       baseAnterior += r.baseAdicional;
       r.adicionalPagadoPeriodo = 0;
    }

    //AJUSTAMOS LA CERTIFICACION FINAL SI ES NECESARIO
    if(r.certificacionFinal != 0) {
       if(pagado30  && pagado50) {
        if((enteroAbonado = enterCertificacionFinal || enteroAbonado > enterCertificacionFinal) && 
        (!r.adicionalPagadoAnterior))
         {
            var diferencia = r.certificacionFinal - r.importeObra
            totalLiqCert = r.certificacionFinal * (r.porComer/100);
            r.pendienteAbono = 0;
            if(diferencia != 0) {
                r.baseAdicional = r.certificacionFinal - r.importeObra;
                basePeriodo = basePeriodo + r.baseAdicional;
            }
            if(!r.adicionalPagadoPeriodo){
                r.adicionalPagadoPeriodo =  r.baseAdicional * (r.porComer/100);
                r.adicionalPagadoAnterior = 0;
            } else {
                 r.adicionalPagadoAnterior = r.adicionalPagadoPeriodo;
                 r.adicionalPagadoPeriodo = 0;
            }
        } 
       } else {
        r.baseAdicional = 0;
       }
           
    } else {
        r.baseAdicional = 0;
    }

    r.dFecha = dFecha;
    r.hFecha = hFecha;
    r.basePeriodo = basePeriodo;
    r.comision = basePeriodo*(r.porComer/100);
    r.baseAnterior += baseAnterior;
    delete r.firmaActa;
    delete r.fechaFirmaActa;
    delete r.regAnte;
    return r;
}

var fnFacturasFromDbToJson = function(facturas, reparaciones) {
    var pdJs = [];
    var cabJs = null;
    var linJs = null;
    var facturaIdAnt = 0;
    var parametro;
    
    for (var i = 0; i < facturas.length; i++) {
        var f = facturas[i];
        if(f.ascContratoId) f.contratoId = f.ascContratoId;
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
                esSegura: f.esSegura,
                inicioPeriodo: f.inicioPeriodo,
                finPeriodo: f.finPeriodo,
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
    var fecha = f.fecha;
    var inicioPeriodo = f.inicioPeriodo;
    var finPeriodo = f.finPeriodo
    //fecha = new Date(fecha);
    var l1 = fnUnaLineaVacia(f);
    var calculado = false;
    try {
        if(f.ascContratoId) f.contratoId = f.ascContratoId
        if(f.histAgentes.length > 0){
            f.histAgentes.forEach(function (h) {
                if(f.fecha <= h.fechaCambio) {
                    l1.registro.facturaId = f.facturaId;
                    l1.registro.comercialId = h.histComercialId;
                    l1.registro.contratoId = f.contratoId;
                    l1.registro.impCliente = f.totalAlCliente;
                    l1.registro.coste = f.coste;
                    //l1.registro.base = f.totalAlCliente;
                    l1.registro.porComer = f.porcentajeAgente;
                    //l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
                    l1.tipoComercial = 1; // es un agente
                    if(!f.esSegura && fecha >= inicioPeriodo) {
                        l1.registro.pendientePeriodo =  f.totalAlCliente;//si la factura no tiene cobro seguro y pertenece al periodo
                        l1.registro.base = f.totalAlCliente;
                        l1.registro.comision = 0;// no se liquida
                    }
                    else if(!f.esSegura && fecha < inicioPeriodo) {
                        l1.registro.pendienteAnterior =  f.totalAlCliente;//si la factura no tiene cobro seguro y no pertenece al periodo
                        l1.registro.base = f.totalAlCliente;
                        l1.registro.comision = 0;// no se liquida
                    }
                  
                    if(f.esSegura && fecha >= inicioPeriodo) {//si la factura tiene cobro seguro y pertenece al periodo
                        l1.registro.pagadoPeriodo =  f.totalAlCliente;
                        l1.registro.pendientePeriodo =  0;
                        l1.registro.base = f.totalAlCliente;//se liquida
                        l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
                    }
                    else if(f.esSegura && fecha < inicioPeriodo) {//si la factura tiene cobro seguro y no pertenece al periodo
                        l1.registro.pagadoAnterior =  f.totalAlCliente;
                        l1.registro.pendienteAnterior =  0;
                        l1.registro.base = f.totalAlCliente;//se liquida
                        l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
                    }
                    l1.registro.dFecha = inicioPeriodo;
                    l1.registro.hFecha = finPeriodo;
                    
                    ls.push(l1);
                    calculado = true;
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
    
    if(!calculado) {
        if(f.ascContratoId) f.contratoId = f.ascContratoId
        l1.registro.facturaId = f.facturaId;
        l1.registro.comercialId = f.agenteId;
        l1.registro.contratoId = f.contratoId;
        l1.registro.impCliente = f.totalAlCliente;
        l1.registro.coste = f.coste;
        //l1.registro.base = f.totalAlCliente;
        l1.registro.porComer = f.porcentajeAgente;
        //l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
        l1.tipoComercial = 1; // es un agente
        if(!f.esSegura && fecha >= inicioPeriodo) {
            l1.registro.pendientePeriodo =  f.totalAlCliente;//si la factura no tiene cobro seguro y pertenece al periodo
            l1.registro.base = f.totalAlCliente;
            l1.registro.comision = 0;// no se liquida
        }
        else if(!f.esSegura && fecha < inicioPeriodo) {
            l1.registro.pendienteAnterior =  f.totalAlCliente;//si la factura no tiene cobro seguro y no pertenece al periodo
            l1.registro.base = f.totalAlCliente;
            l1.registro.comision = 0;// no se liquida
        }
      
        if(f.esSegura && fecha >= inicioPeriodo) {//si la factura tiene cobro seguro y pertenece al periodo
            l1.registro.pagadoPeriodo =  f.totalAlCliente;
            l1.registro.pendientePeriodo =  0;
            l1.registro.base = f.totalAlCliente;//se liquida
            l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
        }
        else if(f.esSegura && fecha < inicioPeriodo) {//si la factura tiene cobro seguro y no pertenece al periodo
            l1.registro.pagadoAnterior =  f.totalAlCliente;
            l1.registro.pendienteAnterior =  0;
            l1.registro.base = f.totalAlCliente;//se liquida
            l1.registro.comision = (f.totalAlCliente * f.porcentajeAgente) / 100.0;
        }
        l1.registro.dFecha = inicioPeriodo;
        l1.registro.hFecha = finPeriodo;

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
        if (err) return con.rollback(function (err2) { done(err) });
        if(departamentoId == 7) {//SQL PARA REPARACIONES
            recuperaRegistrosReparaciones(empresaId, comercialId, dFecha, hFecha, con, function(err, res) {
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
                var ls = fnProcesarFacturasLiquidacionContratos(res);
                ls.forEach(function (l) { regs.push(l.registro) });
                async.eachSeries(regs, function (r, callback) {
                    delete r.quita; // borrramos la propiedad quita para que no de error al actualizar
                    r.dFecha = dFecha;
                    r.hFecha = hFecha;
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        sql = "UPDATE facturas set liquidadaComercial = 1";
                        sql += " WHERE facturaId = " + r.facturaId;
                        con.query(sql, function (err, res) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            callback(null);
                        });
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        con.end();
                        done(null, null); // todo correcto
                    });
                });
            });
        } else if(departamentoId == 8) { //SQL PARA OBRAS
            recuperaRegistrosObras(empresaId, comercialId, departamentoId, dFecha, hFecha, con, function(err, res){
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
                        if(c.liquidado == 0)  ls.forEach(function (l) { regs.push(l.registro) });
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
                    r.dFecha = dFecha;
                    r.hFecha = hFecha;
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        sql = "UPDATE contratos_comisionistas set liquidado = 1";
                        sql += " WHERE contratoId = " + r.contratoId + " AND comercialId = " +r.comercialId
                        con.query(sql, function (err, res) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            callback(null);
                        });
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        con.end();
                        done(null, null); // todo correcto
                    });
                });
            });
        } else {
            recuperaRegistros(empresaId, comercialId, departamentoId, dFecha, hFecha, con, function(err, res){
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
                        if(c.liquidado == 0)  ls.forEach(function (l) { regs.push(l.registro) });
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
                    r.dFecha = dFecha;
                    r.hFecha = hFecha;
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        sql = "UPDATE contratos_comisionistas set liquidado = 1";
                        sql += " WHERE contratoId = " + r.contratoId + " AND comercialId = " +r.comercialId
                        con.query(sql, function (err, res) {
                            if (err) return con.rollback(function (err2) { done(err) });
                            callback(null);
                        });
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        con.end();
                        done(null, null); // todo correcto
                    });
                });
            });
        }
    });
}

var recuperaRegistrosReparaciones = function(empresaId, comercialId, dFecha, hFecha, con, callback) {
    var sql = "SELECT f.facturaId,  COALESCE(cm3.rappel, 0) AS porAgente, 0 AS anticipo,";
    sql += " (COALESCE(f.total, 0) - COALESCE(cm3.gastos, 0)) AS beneficio, ";
    sql += " COALESCE(f.total, 0) AS facturado,";
    sql += " COALESCE(f.total, 0) AS facturadoAlCliente,";
    sql += " COALESCE(cm3.gastos, 0) AS gastos, ";
    sql += " f.departamentoId AS tipoMantenimientoId, ";
    sql += " c2.comercialId AS comercialId, ";
    sql += " c2.nombre AS nombreComercial, ";
    sql += " c2.nif AS nifComercial, ";
    sql += " c2.tipoComercialId AS tipoComercial, ";
    sql += " c.comercialId AS agenteId, ";
    sql += " c.nombre AS nombreAgente, ";
    sql += " c.nif AS nifAgente, ";
    sql += " c.tipoComercialId AS tipoAgente,";
    sql += " repComisAgente, repPorImpCliente, repPorImpClienteAgente, repPorCostes, repCostes, repJefeObra, repOficinaTecnica, repAsesorTecnico, ";
    sql += " COALESCE(repComision, 0) AS repComision";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN ";
    sql += " (";
    sql += " SELECT p.facturaId, SUM(pl.importeProveedor) AS gastos, p.rappel";
    sql += " FROM partes AS p";
    sql += " LEFT JOIN partes_lineas AS pl ON pl.parteId = p.parteId";
    sql += " GROUP BY p.facturaId";
    sql += " ) AS cm3 ON cm3.facturaId = f.facturaId"
    sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId";
    sql += " LEFT JOIN servicios  AS s ON s.clienteId = cli.clienteId"
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = s.agenteId ";
    sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = c.ascComercialId";
    sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = c2.comercialId AND cc.empresaId = f.empresaId ";
    sql += " WHERE ";
    sql += "  f.fecha <= ? AND f.fecha >= ? AND f.sel = 1 AND f.departamentoId = 7 AND f.liquidadaComercial = 0";
    if (empresaId != 0) {
        sql += " AND f.empresaId = " + empresaId;
    }
    if (comercialId != 0) {
        sql += " AND c2.comercialId = " + comercialId ;
    }    
    sql += " GROUP BY f.facturaId";        
    sql += " ORDER BY f.facturaId";
    sql = mysql.format(sql, [hFecha, dFecha]);
    con.query(sql, function (err, rows) {
       if(err) return callback(err);
       return callback(null, rows);
    });
}

var recuperaRegistros = function(empresaId, comercialId, departamentoId, dFecha, hFecha, con, callback) {
    var regs = []
        var sql = "SELECT cm.fechaFinal AS fecha, cmc.liquidado, 0 AS anticipo," 
        sql += " cm.contratoId, (COALESCE(cm2.facturado, 0) - COALESCE(cm3.gastos, 0)) AS beneficio, COALESCE(cm2.facturado, 0) as facturado,";
        sql += " COALESCE(cm2.facturadoAlCliente, 0) as facturadoAlCliente, COALESCE(cm3.gastos, 0) as gastos,"
        sql += " cm.referencia, cm.tipoContratoId AS tipoMantenimientoId,";
        sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial,";
        sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
        sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial, COALESCE(manComision, 0) AS manComision,";
        sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial, COALESCE(segComision, 0) AS segComision,";
        sql += " finComisAgente, finPorImpCliente, finPorImpClienteAgente, finPorCostes, finCostes, finJefeObra, finOficinaTecnica, finAsesorTecnico, finComercial, COALESCE(finComision, 0) AS finComision,";
        sql += " arqComisAgente, arqPorImpCliente, arqPorImpClienteAgente, arqPorCostes, arqCostes, arqJefeObra, arqOficinaTecnica, arqAsesorTecnico, arqComercial, COALESCE(arqComision, 0) AS arqComision,";
        sql += " obrComisAgente, obrPorImpCliente, obrPorImpClienteAgente, obrPorCostes, obrCostes, obrJefeObra, obrOficinaTecnica, obrAsesorTecnico, obrComercial, COALESCE(obrComision, 0) AS obrComision";
        sql += " FROM contratos AS cm";
        sql += " LEFT JOIN (SELECT contratoId, SUM(total) AS facturado,  SUM(totalAlCliente) AS facturadoAlCliente FROM facturas GROUP BY contratoId) AS cm2 ON cm2.contratoId = cm.contratoId";
        sql += " LEFT JOIN (SELECT contratoId, SUM(importe) AS gastos FROM facprove_serviciados GROUP BY contratoId) AS cm3 ON cm3.contratoId = cm.contratoId";
        sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
        sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = cm.empresaId";
        sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
        sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
        sql += " WHERE NOT cmc.comercialId IS NULL";
        sql += " AND cmc.sel = 1 AND cmc.liquidado = 0";
        sql += " AND cm.tipoContratoId = " + departamentoId;
        if (empresaId != 0) {
            sql += " AND cm.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND cmc.comercialId = " + comercialId ;
        }            
        sql += " ORDER BY cm.contratoId, cmc.comercialId";
        sql = mysql.format(sql, [hFecha, dFecha]);
        con.query(sql, function (err, rows) {
            if(err) return callback(err);
            //eliminamos los registros que ya están liquidados
           
            return callback(null, rows);
         }); 
}

var recuperaRegistrosObras = function(empresaId, comercialId, departamentoId, dFecha, hFecha, con, callback) {
    var regs = []
        var sql = "SELECT cm.fechaFinal AS fecha, cmc.liquidado, COALESCE(tmp.anticipo, 0) AS anticipo," 
        sql += " cm.contratoId, (COALESCE(cm.certificacionFinal, 0) - COALESCE(cm3.gastos, 0)) AS beneficio, COALESCE(cm.certificacionFinal, 0) as facturado,";
        sql += " COALESCE(cm.certificacionFinal, 0) as facturadoAlCliente, COALESCE(cm3.gastos, 0) as gastos,"
        sql += " cm.referencia, cm.tipoContratoId AS tipoMantenimientoId,";
        sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial,";
        sql += " c.nif AS nifComercial, c.tipoComercialId AS tipoComercial,";
        sql += " cm.agenteId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente,"; 
        sql += " c2.tipoComercialId AS tipoAgente, cm.porcentajeAgente AS porAgente,";
        sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial, COALESCE(manComision, 0) AS manComision,";
        sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial, COALESCE(segComision, 0) AS segComision,";
        sql += " finComisAgente, finPorImpCliente, finPorImpClienteAgente, finPorCostes, finCostes, finJefeObra, finOficinaTecnica, finAsesorTecnico, finComercial, COALESCE(finComision, 0) AS finComision,";
        sql += " arqComisAgente, arqPorImpCliente, arqPorImpClienteAgente, arqPorCostes, arqCostes, arqJefeObra, arqOficinaTecnica, arqAsesorTecnico, arqComercial, COALESCE(arqComision, 0) AS arqComision,";
        sql += " obrComisAgente, obrPorImpCliente, obrPorImpClienteAgente, obrPorCostes, obrCostes, obrJefeObra, obrOficinaTecnica, obrAsesorTecnico, obrComercial, COALESCE(obrComision, 0) AS obrComision";
        sql += " FROM contratos AS cm";
        sql += " LEFT JOIN (SELECT contratoId, SUM(total) AS facturado,  SUM(totalAlCliente) AS facturadoAlCliente FROM facturas GROUP BY contratoId) AS cm2 ON cm2.contratoId = cm.contratoId";
        sql += " LEFT JOIN (SELECT contratoId, SUM(importe) AS gastos FROM facprove_serviciados GROUP BY contratoId) AS cm3 ON cm3.contratoId = cm.contratoId";
        sql += " LEFT JOIN contratos_comisionistas AS cmc ON cmc.contratoId = cm.contratoId";
        sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = cm.empresaId";
        sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
        sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.agenteId";
        sql += " LEFT JOIN"; 
        sql += " (SELECT an.contratoId, SUM(an.importe) AS anticipo, a.comercialId FROM antcol_serviciados AS an";
        sql += " LEFT JOIN antcol AS a ON a.antcolId = an.antcolId";
        sql += " GROUP BY an.contratoId) AS tmp ON tmp.contratoId = cm.contratoId AND tmp.comercialId = cmc.comercialId"
        sql += " WHERE NOT cmc.comercialId IS NULL";
        sql += " AND cmc.sel = 1 AND cmc.liquidado = 0";
        sql += " AND cm.tipoContratoId = " + departamentoId;
        if (empresaId != 0) {
            sql += " AND cm.empresaId = " + empresaId;
        }
        if (comercialId != 0) {
            sql += " AND cmc.comercialId = " + comercialId ;
        }            
        sql += " ORDER BY cm.contratoId, cmc.comercialId";
        sql = mysql.format(sql, [hFecha, dFecha]);
        con.query(sql, function (err, rows) {
            if(err) return callback(err);
            //eliminamos los registros que ya están liquidados
           
            return callback(null, rows);
         }); 
}



var fnProcesarFacturasLiquidacionContratos = function (fsl) {
    var ls = [];
    // vamos a crear una lista de objetos con dos propiedades que a su vez son objetos
    // origen: lo que se ha leido de la base de datos
    // registro: lo que se guardará como registro de liquidación
    fsl.forEach(function (c) {
        var l = fnUnaLineaVacia(c);
        if(c.tipoMantenimientoId == 7) {
            l.registro.facturaId = c.facturaId;
            l.registro.contratoId = null
        } else {
            l.registro.facturaId = null
            l.registro.contratoId = c.contratoId;
        }
        l.registro.comercialId = c.comercialId;
        l.registro.contratoId = c.contratoId;
        l.registro.impCliente = c.facturado;
        l.registro.coste = c.gastos;
        l.registro.porComer = 0;
        l.registro.anticipo = c.anticipo;
        var comisAgente = (c.facturadoAlCliente * c.porAgente) / 100.0;
        // el caso es diferente si se trata de seguro o mantenimiento
        if (c.tipoMantenimientoId == 1) {
            // mantenimiento

            l.registro.porComer = c.manComision;

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

            l.registro.porComer = c.segComision;

            if (c.segComisAgente && c.segComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (c.segPorImpCliente && c.segPorImpCliente != 0) {
                l.registro.PC = (c.facturado * c.segPorImpCliente) / 100.0;
            }
            if (c.segPorImpClienteAgente && c.segPorImpClienteAgente != 0) {
                l.registro.PCA = ((c.facturado - comisAgente) * c.segPorImpClienteAgente) / 100.0;
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

            l.registro.porComer = c.finComision;

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

            l.registro.porComer = c.arqComision;

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

            l.registro.porComer = c.repComision;

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

            l.registro.porComer = c.obrComision;

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
    if(tipoComercialId != 1) {
        crearReportComerciales(dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario,  (err, liquidaciones) => {
            if (err) return callback(err);
            callback(null, liquidaciones);
        });
    } else {
        if(departamentoId == 8) {
            crearReportObras(dFecha, hFecha,  tipoComercialId, comercialId,  (err, liquidaciones) => {
                if (err) return callback(err);
                callback(null, liquidaciones);
            });
        } else {
            crearReport(dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, (err, liquidaciones) => {
                if (err) return callback(err);
                callback(null, liquidaciones);
            });
        }
    }
}

module.exports.postCrearReportColaboradoresResumen = function (dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, callback) {
    crearReportResumen(dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, (err, liquidaciones) => {
        if (err) return callback(err);
        callback(null, liquidaciones);
    });
}

var crearReportObras = function(dFecha, hFecha, tipoComercialId, comercialId, callback) {
    var connection = getConnection();
    var sql = "";
    var obj = 
        {
            liqAgente: ""
        }
        sql = "SELECT liq.contratoId,";
        sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
        sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
        sql += " com.comercialId,";
        sql += " com.nombre AS nomComercial,";
        sql += " tpp.nombre AS tipoProyecto,";
        sql += " cli.nombre AS nomCliente,";
        sql += " cnt.direccion,"
        sql += " cnt.referencia,";
        sql += " cnt.firmaActa,"
        sql += " cnt.FechaFirmaActa,"
        sql += " liq.importeObra,";
        sql += " liq.certificacionFinal,"
        sql += " liq.baseAdicional,"
        
        sql += " liq.facturado,";
        sql += " liq.abonado, ";
        sql += " liq.pendienteAbono,";
        sql += " liq.porComer,";
        sql += " liq.basePeriodo,";
        sql += " liq.baseAnterior,";
        sql += " liq.comision,";
        sql += " liq.pagadoPeriodo30,";
        sql += " liq.pagadoAnterior30,";
        sql += " liq.pagadoPeriodo20,";
        sql += " liq.pagadoAnterior20,";
        sql += " liq.pagadoPeriodo50,";
        sql += " liq.pagadoAnterior50,";
        sql += " liq.adicionalPagadoPeriodo,";
        sql += " liq.adicionalPagadoAnterior,";
        sql += " tpc.nombre AS tipoColaborador";
        sql += " FROM liquidacion_comercial_obras AS liq";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
        sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
        sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
        sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
        sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = cnt.tipoProyectoId";
        if(tipoComercialId != 1) {
            sql += " WHERE cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
        } else {
            sql += " WHERE liq.dFecha >= '" + dFecha + "' AND liq.hFecha <= '" + hFecha + "' AND cnt.fechaInicio >= '2021-01-01' AND cnt.contratoIntereses = 0";
        }
        if (comercialId) {
            sql += " AND liq.comercialId IN (" + comercialId + ")";
        }
        if (tipoComercialId) {
            sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
        }
        
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)    return callback(err, null);
        result.forEach(e => {
            if(e.pagadoPeriodo20 != 0 || e.pagadoAnterior20 != 0)
             {
                 e.firmaActa = "SI"
             } else {
                e.firmaActa = "NO"
             }
            
        });
        obj.liqAgente = result;
        callback(null, obj);
        
       /*  var resultado = JSON.stringify(obj);
        fs.writeFile(process.env.REPORTS_DIR + "\\liquidacion_agente_obras.json", resultado, function(err) {
            if(err) return callback(err);
            //return callback(null, true);
        });
         */
        
    });
}

var crearReport = function(dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, callback) {
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
            sql += " fac.liquidadaAgente,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
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
                sql += " WHERE (cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
            } else {
                sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
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
            
            sql += ") OR";

            if(tipoComercialId != 1) {
                sql += " (cnt.fechaFinal < '" + dFecha + "'";
            } else {
                sql += " (fac.fecha < '" + dFecha + "'";
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
            sql += " AND (fac.liquidadaAgente= 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" + dFecha + "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId";
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
            sql += " fac.liquidadaAgente,"
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " NULL AS fechaFinal ";
            sql += " FROM liquidacion_comercial AS liq ";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7) OR";
            sql += " (fac.fecha < '" + dFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7 AND (fac.liquidadaAgente = 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" +  dFecha + "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId";
        }
        else {
            sql = "(SELECT";
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
            sql += " fac.liquidadaAgente,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
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
                sql += " WHERE (cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
            } else {
                sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
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
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+" AND departamentoId <> 8)"
            }

            sql += ") OR";

            if(tipoComercialId != 1) {
                sql += " (cnt.fechaFinal < '" + dFecha + "'";
            } else {
                sql += " (fac.fecha < '" + dFecha + "'";
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
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+"  AND departamentoId <> 8)"
            }
            sql += " AND (fac.liquidadaAgente = 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" +  dFecha+ "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId)";
          

            sql += " UNION";
    
            sql += " (SELECT";
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
            sql += " fac.liquidadaAgente,";
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " NULL AS fechaFinal ";
            sql += " FROM liquidacion_comercial AS liq ";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7) OR";
            sql += " (fac.fecha < '" + dFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7 AND (fac.liquidadaAgente = 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" +  dFecha + "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId)";
            sql += " ORDER BY comercialId";
    
        }

    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)    return callback(err, null);
        obj.liqAgente = result;
        async.forEachSeries(obj.liqAgente, function(f, done) {
            fnFacturaConta(f.facturaId, function (err, rows) {
                if (err) return done(err);
                if (rows.length == 0) {
                    done(); 
                }else {
                    var fa = rows[0];
                    f.fechaBis = moment(f.fechaBis).format('DD/MM/YYYY');
                    f.numfactu = f.serie + "-" + f.ano + "-" + f.numero;
                    var numserie = fa.serie;
                    var numfactu = fa.numfac;
                    var fecfactu = fa.fecha;
                    var conta = fa.contabilidad;
                    var facturaId = fa.facturaId;
                    fnCobroEnConta(conta, numserie, numfactu, fecfactu, facturaId,function (err, cobros) {
                        if (err) return done(err);
                        //f = procesaCobros(cobros, f, dFecha, hFecha);
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
}

var crearReportResumen = function(dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, callback) {
    var connection = getConnection();
    var sql = "";
    var obj = 
        {
            departamentos: ""
        }
        sql = "(SELECT";
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
            sql += " fac.liquidadaAgente,"
            sql += " liq.impCliente,";
            sql += " 0 AS certificacionFinal,"
            sql += " 0 AS baseAdicional,"
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
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
                sql += " WHERE (cnt.fechaFinal >= '" + dFecha + "' AND cnt.fechaFinal <= '" + hFecha + "'";
            } else {
                sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
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
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+" AND departamentoId != 8)"
            }

            sql += ") OR";

            if(tipoComercialId != 1) {
                sql += " (cnt.fechaFinal < '" + dFecha + "'";
            } else {
                sql += " (fac.fecha < '" + dFecha + "'";
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
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+" AND departamentoId != 8)"
            }
            sql += " AND (fac.liquidadaAgente = 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" +  dFecha+ "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId, tpm.nombre)";
          

            sql += " UNION";
    
            sql += " (SELECT";
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
            sql += " fac.liquidadaAgente,";
            sql += " liq.impCliente,";
            sql += " 0 AS certificacionFinal,"
            sql += " 0 AS baseAdicional,"
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " liq.pendientePeriodo,";
            sql += " liq.pendienteAnterior,";
            sql += " liq.pagadoPeriodo,";
            sql += " liq.pagadoAnterior,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " NULL AS fechaFinal ";
            sql += " FROM liquidacion_comercial AS liq ";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN facturas AS fac ON fac.facturaId = liq.facturaId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = fac.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = fac.departamentoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE (fac.fecha >= '" + dFecha + "' AND fac.fecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7) OR";
            sql += " (fac.fecha < '" + dFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " AND fac.departamentoId = 7 AND (fac.liquidadaAgente = 0 OR (liq.pagadoAnterior <> 0 AND liq.dFecha >= '" +  dFecha + "' AND liq.hFecha <= '" + hFecha + "')))";
            sql += " ORDER BY com.comercialId, tpm.nombre)";
            sql += " ORDER BY comercialId, departamento";
    
        


    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)    return callback(err, null);
        var connection2 = getConnection();
        //seleccionamos el periodo anterior
        var periodoAnterior = {};
        sql = " SELECT DISTINCT dFecha, hFecha FROM liquidacion_comercial_obras AS l ";
        sql += " LEFT JOIN contratos AS c ON c.contratoId = l.contratoId";
        sql += " WHERE l.dFecha < ? AND c.tipoContratoId = 8 ORDER BY l.dFecha DESC";
        sql = mysql.format(sql, dFecha);
        connection2.query(sql, function (err, res) {
            if (err)    return callback(err, null);
            closeConnectionCallback(connection2, callback);
            if(res.length > 0) {
                periodoAnterior = res[0];
                periodoAnterior.dFecha = moment(periodoAnterior.dFecha).format('YYYY-MM-DD');
                periodoAnterior.hFecha = moment(periodoAnterior.hFecha).format('YYYY-MM-DD');
            } else {
                periodoAnterior.dFecha = null;
                periodoAnterior.hFecha = null;
            }
            sql = " SELECT l.comercialId,"; 
            sql += " com.nombre AS nomComercial,";
            sql += " d.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador,";
            sql += " tpp.nombre AS tipoProyecto,";
            sql += " SUM(l.importeObra) AS impCliente,";
            sql += " SUM(l.baseAdicional) AS baseAdicional,";
            sql += " SUM(l.certificacionFinal) AS certificacionFinal,"
            sql += " COALESCE(l2.pagadoAnterior, 0) AS pagadoAnterior, ";
            sql += " SUM(l.abonado) - COALESCE(l2.pagadoAnterior, 0)  AS pagadoPeriodo, ";
            sql += " SUM(l.pendienteAbono)   AS pendientePeriodo, ";
            sql += " COALESCE(l2.pendienteAnterior, 0) AS pendienteAnterior,";
            sql += " SUM(l.pagadoPeriodo30) + SUM(l.pagadoPeriodo20) + SUM(l.pagadoPeriodo50) AS baseCalculo,";
            sql += " SUM(l.comision) AS comision, ";
            sql += " l.dFecha,";
            sql += " l.hFecha ";
            sql += " FROM liquidacion_comercial_obras AS l ";
            sql += " LEFT JOIN ";
            sql += " (";
	            sql += " SELECT ll.comercialId, ";
	            sql += " COALESCE(SUM(abonado), 0) AS pagadoAnterior,";
	            sql += " COALESCE(SUM(pendienteAbono), 0) AS pendienteAnterior,";
	            sql += " dFecha, hFecha ";
	            sql += " FROM liquidacion_comercial_obras AS ll";
	            sql += " LEFT JOIN comerciales AS com ON com.comercialId = ll.comercialId  ";
	            sql += " LEFT JOIN contratos AS c ON c.contratoId = ll.contratoId  AND c.fechaInicio >= 20210101 ";
	            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId  ";
	            sql += " LEFT JOIN departamentos AS d ON d.departamentoId = c.tipoContratoId  ";
	            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId  ";
	            sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = c.tipoProyectoId  ";
	            sql += " WHERE  ll.dFecha = '" + periodoAnterior.dFecha + "' AND  ll.hFecha = '" + periodoAnterior.hFecha + "' AND c.tipoContratoId = 8";
                if (comercialId) {
                    sql += " AND ll.comercialId IN (" + comercialId + ")";
                }
                if (tipoComercialId) {
                    sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
                }
	            sql += " GROUP BY c.tipoContratoId, ll.comercialId ";
            sql += " ) AS l2 ON l2.comercialId = l.comercialId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = l.comercialId  ";
            sql += " LEFT JOIN contratos AS c ON c.contratoId = l.contratoId   AND c.fechaInicio >= 20210101";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = c.clienteId  ";
            sql += " LEFT JOIN departamentos AS d ON d.departamentoId = c.tipoContratoId  ";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId  ";
            sql += " LEFT JOIN tipos_proyecto AS tpp ON tpp.tipoProyectoId = c.tipoProyectoId  ";
            sql += " WHERE  l.dFecha <= '" + dFecha + "' AND l.hFecha = '" + hFecha + "' AND c.tipoContratoId = 8 AND c.contratoIntereses = 0";
            if (comercialId) {
                sql += " AND l.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            sql += " GROUP BY c.tipoContratoId, l.comercialId ";
            sql += " ORDER BY l.comercialId";
            var connection3 = getConnection();
            connection3.query(sql, function (err, result2) {
                if (err)    return callback(err, null);
                closeConnectionCallback(connection3, callback);
                if(result2.length > 0) {
                    result2.forEach(r => {
                        result.push(r)
                    });
                }
                result.sort(function (a, b){
                    return (b.comercialId - a.comercialId);
                })
                //una vez procesadas toda las facturas agrupamos por comercial y departamento
                obj.departamentos = agrupaComerDep(result);
                var resultado = JSON.stringify(obj);
                /* fs.writeFile(process.env.REPORTS_DIR + "\\liquidacion_agente.json", resultado, function(err) {
                     if(err) return callback(err);
                     //return callback(null, true);
                }); */
                callback(null, obj);
            });
        });
    });
}

var agrupaComerDep = function(obj) {
    var antComercialId = null;
    var objdepartamentos = [];
    var primerRegistro = false;
    var objBis = [];
    var objDep = [];
    try{
        obj.forEach( function(o) {
            //procesamos la primera liquidacion
            if(!antComercialId) {
                objBis = creaObjetoVacio();
                objdepartamentos = objBis.departamentos;
                //asignamos los valores al departamento correspondiente
                objdepartamentos.forEach( function(d) {
                    if(d.nombre == o.departamento) {
                        d.comercialId = o.comercialId;
                        d.nomComercial = o.nomComercial;
                        d.tipoColaborador = o.tipoColaborador
                        d.dFecha = o.dFecha;
                        d.hFecha = o.hFecha;
                        d.impCliente += o.impCliente;
                        d.certificacionFinal += o.certificacionFinal;
                        d.baseAdicional += o.baseAdicional;
                        d.pagadoPeriodo += o.pagadoPeriodo;
                        d.pendientePeriodo += o.pendientePeriodo;
                        d.pagadoAnterior += o.pagadoAnterior;
                        d.pendienteAnterior +=  o.pendienteAnterior;
                        d.baseCalculo +=  o.baseCalculo;
                        d.comision += o.comision;
                    } else {
                        d.comercialId = o.comercialId;
                        d.nomComercial = o.nomComercial;
                        d.tipoColaborador = o.tipoColaborador
                        d.dFecha = o.dFecha;
                        d.hFecha = o.hFecha;
                    }
                });
            }
            //si ya hemos procesado un registro
            if(antComercialId) {
                 //Si es el mismo comercial asignamos los valores al departamento correspondiente
                if(antComercialId == o.comercialId) {
                    objdepartamentos.forEach( function(d) {
                        if(d.nombre == o.departamento) {
                            d.comercialId = o.comercialId;
                            d.nomComercial = o.nomComercial;
                            d.tipoColaborador = o.tipoColaborador
                            d.dFecha = o.dFecha;
                            d.hFecha = o.hFecha;
                            d.impCliente += o.impCliente;
                            d.certificacionFinal += o.certificacionFinal;
                            d.baseAdicional += o.baseAdicional;
                            d.pagadoPeriodo += o.pagadoPeriodo;
                            d.pendientePeriodo += o.pendientePeriodo;
                            d.pagadoAnterior += o.pagadoAnterior;
                            d.pendienteAnterior +=  o.pendienteAnterior;
                            d.baseCalculo +=  o.baseCalculo;
                            d.comision += o.comision;
                        } else{
                            d.comercialId = o.comercialId;
                            d.nomComercial = o.nomComercial;
                            d.tipoColaborador = o.tipoColaborador
                            d.dFecha = o.dFecha;
                            d.hFecha = o.hFecha;
                        }
                    });
                } else {
                    //se hemos cambiado de comercial guardamos el anterior y creamos un nuevo objeto vacio
                    if(!primerRegistro) {
                      
                        objdepartamentos.forEach( function(r) {
                            objDep.push(r);//guardamos por separado
                        });
                       
                    }
                    primerRegistro = false;
                    objBis = [];
                    objBis = creaObjetoVacio();
                    antComercialId = o.comercialId
                    objdepartamentos = objBis.departamentos;
                    //asignamos los valores al departamento correspondiente
                    objdepartamentos.forEach( function(d) {
                        if(d.nombre == o.departamento) {
                            d.comercialId = o.comercialId;
                            d.tipoColaborador = o.tipoColaborador
                            d.dFecha = o.dFecha;
                            d.hFecha = o.hFecha;
                            d.nomComercial = o.nomComercial;
                            d.impCliente += o.impCliente;
                            d.certificacionFinal += o.certificacionFinal;
                            d.baseAdicional += o.baseAdicional;
                            d.pagadoPeriodo += o.pagadoPeriodo;
                            d.pendientePeriodo += o.pendientePeriodo;
                            d.pagadoAnterior += o.pagadoAnterior;
                            d.pendienteAnterior +=  o.pendienteAnterior;
                            d.baseCalculo +=  o.baseCalculo;
                            d.comision += o.comision;
                        } else {
                            d.comercialId = o.comercialId;
                            d.nomComercial = o.nomComercial;
                            d.tipoColaborador = o.tipoColaborador
                            d.dFecha = o.dFecha;
                            d.hFecha = o.hFecha;
                        }
                    });
                    antComercialId = o.comercialId;
                }
                 
            } else {
                antComercialId = o.comercialId;
               
                    
                objdepartamentos.forEach( function(r) {
                     objDep.push(r);//guardamos por separado
                 });
                 primerRegistro = true
            }
        });
    } catch (e) {
        console.log(e);
    }
    
    return objDep;
}
var creaObjetoVacio = function() {
    var obj = {
        departamentos: 
        [
            {
                nombre: "SEGUROS",
                impCliente: 0,
                certificacionFinal: 0,
                baseAdicional: 0,
                pagadoPeriodo: 0,
                pendientePeriodo: 0,
                pagadoAnterior: 0,
                pendienteAnterior: 0,
                baseCalculo: 0,
                comision: 0,
                comercialId: 0
            },
            {
                nombre: "ARQUITECTURA",
                impCliente: 0,
                certificacionFinal: 0,
                baseAdicional: 0,
                pagadoPeriodo: 0,
                pendientePeriodo: 0,
                pagadoAnterior: 0,
                pendienteAnterior: 0,
                baseCalculo: 0,
                comision: 0,
                comercialId: 0
            },
            {
                nombre: "MANTENIMIENTO",
                impCliente: 0,
                certificacionFinal: 0,
                baseAdicional: 0,
                pagadoPeriodo: 0,
                pendientePeriodo: 0,
                pagadoAnterior: 0,
                pendienteAnterior: 0,
                baseCalculo: 0,
                comision: 0,
                comercialId: 0
            },
            {
                nombre: "REPARACIONES",
                impCliente: 0,
                certificacionFinal: 0,
                baseAdicional: 0,
                pagadoPeriodo: 0,
                pendientePeriodo: 0,
                pagadoAnterior: 0,
                pendienteAnterior: 0,
                baseCalculo: 0,
                comision: 0,
                comercialId: 0
            },
            {
                nombre: "OBRAS",
                impCliente: 0,
                certificacionFinal: 0,
                baseAdicional: 0,
                pagadoPeriodo: 0,
                pendientePeriodo: 0,
                pagadoAnterior: 0,
                pendienteAnterior: 0,
                baseCalculo: 0,
                comision: 0,
                comercialId: 0
            }

        ]
    }
    return obj;
}

var crearReportComerciales = function (dFecha, hFecha, departamentoId, tipoComercialId, comercialId, usuario, callback) {
    var connection = getConnection();
    var sql = "";
    var obj = 
        {
            liqAgente: ""
        }
    
            sql = "SELECT";
            sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
            sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
            sql += " com.comercialId,";
            sql += " com.nombre AS nomComercial,";
            sql += " com2.comercialId AS agenteId,";
            sql += " com2.nombre AS nomAgente,";
            sql += " cli.nombre AS nomCliente,";
            sql += " cli.proId AS codigo,"
            sql += " cli.fechaAlta AS fechaAlta,";
            sql += " cnt.direccion,"    
            sql += " cnt.referencia,";
            sql +=   null + " AS vFac,"
            sql += " liq.impCliente,";
            sql += " liq.base As baseCalculo,";
            sql += " liq.porComer, ";
            sql += " liq.comision,";
            sql += " tpm.nombre AS departamento,";
            sql += " tpc.nombre AS tipoColaborador, ";
            sql += " DATE_FORMAT(cnt.fechaFinal, '%Y-%m-%d') AS fechaFinal";
            sql += " FROM liquidacion_comercial AS liq";
            sql += " LEFT JOIN contratos AS cnt ON cnt.contratoId = liq.contratoId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
            sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = cnt.agenteId";
            sql += " LEFT JOIN clientes AS cli ON cli.clienteId = cnt.clienteId";
            sql += " LEFT JOIN departamentos AS tpm ON tpm.departamentoId = cnt.tipoContratoId";
            sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
            sql += " WHERE liq.dFecha >= '" + dFecha + "' AND liq.hFecha <= '" + hFecha + "'";
            if (comercialId) {
                sql += " AND liq.comercialId IN (" + comercialId + ")";
            }
            if (tipoComercialId) {
                sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
            }
            if (departamentoId && departamentoId > 0) {
                sql += " AND cnt.tipoContratoId = " + departamentoId;
            }else {
                sql += " AND cnt.tipoContratoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuario+" AND departamentoId <> 7)"
            }
            sql += " GROUP BY liq.contratoId, liq.comercialId"
            if(departamentoId == 7) {
                sql = " SELECT ";
                sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
                sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
                sql += " com.comercialId,";
                sql += " com.nombre AS nomComercial,";
                sql += " com2.comercialId AS agenteId,";
                sql += " com2.nombre AS nomAgente,";
                sql += " cli.nombre AS nomCliente,";
                sql += " cli.proId AS codigo,";
                sql += " cli.fechaAlta AS fechaAlta,";
                sql += " f.receptorDireccion,";
                sql += " p.refPresupuesto AS referencia,";
                sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
                sql += " liq.impCliente,";
                sql += " liq.base AS baseCalculo,";
                sql += " liq.porComer,";
                sql += " liq.comision, ";
                sql += " d.nombre AS departamento,";
                sql += " tpc.nombre AS tipoColaborador,";
                sql += " DATE_FORMAT(f.fecha, '%Y-%m-%d') AS fechaFinal";
                sql += " FROM liquidacion_comercial AS liq";
                sql += " LEFT JOIN facturas AS f ON f.facturaId = liq.facturaId";
                sql += " LEFT JOIN partes AS p ON p.facturaId = f.facturaId";
                sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId ";
                sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
                sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = cli.comercialId";
                sql += " LEFT JOIN departamentos AS d ON d.departamentoId = f.departamentoId";
                sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
                sql += " WHERE liq.dFecha  >= '" + dFecha + "' AND liq.hFecha  <= '" + hFecha + "'";
                if (comercialId) {
                    sql += " AND liq.comercialId IN (" + comercialId + ")";
                }
                if (tipoComercialId) {
                    sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
                }
                sql += " AND f.departamentoId  =  7"
                sql += " GROUP BY liq.facturaId"
            }
            if(departamentoId == 0) {
                sql += " UNION"
                sql += " SELECT ";
                sql += " '" + moment(dFecha).format('DD/MM/YYYY') + "' as dFecha,";
                sql += " '" + moment(hFecha).format('DD/MM/YYYY') + "' as hFecha,";
                sql += " com.comercialId,";
                sql += " com.nombre AS nomComercial,";
                sql += " com2.comercialId AS agenteId,";
                sql += " com2.nombre AS nomAgente,";
                sql += " cli.nombre AS nomCliente,";
                sql += " cli.proId AS codigo,";
                sql += " cli.fechaAlta AS fechaAlta,";
                sql += " f.receptorDireccion,";
                sql += " p.refPresupuesto AS referencia,";
                sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS vFac,";
                sql += " liq.impCliente,";
                sql += " liq.base AS baseCalculo,";
                sql += " liq.porComer,";
                sql += " liq.comision, ";
                sql += " d.nombre AS departamento,";
                sql += " tpc.nombre AS tipoColaborador,";
                sql += " DATE_FORMAT(f.fecha, '%Y-%m-%d') AS fechaFinal";
                sql += " FROM liquidacion_comercial AS liq";
                sql += " LEFT JOIN facturas AS f ON f.facturaId = liq.facturaId";
                sql += " LEFT JOIN partes AS p ON p.facturaId = f.facturaId";
                sql += " LEFT JOIN clientes AS cli ON cli.clienteId = f.clienteId ";
                sql += " LEFT JOIN comerciales AS com ON com.comercialId = liq.comercialId";
                sql += " LEFT JOIN comerciales AS com2 ON com2.comercialId = cli.comercialId ";
                sql += " LEFT JOIN departamentos AS d ON d.departamentoId = f.departamentoId";
                sql += " LEFT JOIN tipos_comerciales AS tpc ON tpc.tipoComercialId = com.tipoComercialId";
                sql += " WHERE liq.dFecha  >= '" + dFecha + "' AND liq.hFecha  <= '" + hFecha + "'";
                if (comercialId) {
                    sql += " AND liq.comercialId IN (" + comercialId + ")";
                }
                if (tipoComercialId) {
                    sql += " AND com.tipoComercialId IN (" + tipoComercialId + ")";
                }
                sql += " AND f.departamentoId  =  7"
                sql += " GROUP BY liq.facturaId"
            }
        
           
        
        
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err)    return callback(err, null);
            //procesamos la fecha de final de contrato
            if(result.length > 0) {
                result.forEach(function(f) {
                    f.fechaFinal = moment(f.fechaFinal).format('DD/MM/YYYY');
                    f.fechaAlta = moment(f.fechaAlta).format('DD/MM/YYYY');
                });
            }
            obj.liqAgente = result;
            callback(null, obj);
           // obj.libCli = procesaResultado(result);
    
           /*  var resultado = JSON.stringify(obj);
            fs.writeFile(process.env.REPORTS_DIR + "\\listado.json", resultado, function(err) {
                if(err) return callback(err);
                //return callback(null, true);
            }); */
            
            
        });
}
var procesaCobros = function(cobros, f, dFecha, hFecha) {
    if(!f.pagadoAnterior || f.pagadoAnterior == 0) return f // no hacemos nada en caso de que no sea un pago anterior al periodo
    cobros.forEach(c => {
        f.AnteriorCobradaPeriodo = false;
        c.fecultco  = moment(c.fecultco).format('YYYY-MM-DD');
        if(c.fecultco >= dFecha && c.fecultco <= hFecha) {
           f.AnteriorCobradaPeriodo = true;
           if(f.AnteriorCobradaPeriodo) {
                return f;// si encontramos un cobro en el periodo salimos
            } 
        }
    });
    if(!f.AnteriorCobradaPeriodo) {
       f = {} // si no se ha encontrado ningún cobro en el periodo eliminamos la factura del informe
    } 
    return f
}

//actualizamos una liquidación como devuelta
var marcaLiqDevuelta = function (facturaId,done) {
    var con = getConnection();
    sql = "UPDATE liquidacion_comercial";
    sql += " SET devuelta = 1";
    sql += " WHERE facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, result) {
        con.end();
        if (err) return done(err);
        done(null, result);
    })
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

module.exports.postPrepararCorreos = function (dFecha, hFecha, tipoComercialId, done) {
    crearPdfsLiquidacion(dFecha, hFecha, tipoComercialId,  (err, liquidaciones) => {
        if (err) return done(err);
        done(null, liquidaciones);
    });
}


module.exports.postEnviarCorreos = function (dFecha, hFecha, test,liquidaciones, done) {
    // TODO: Hay que montar los correos propiamente dichos
    crearCorreosAEnviar(dFecha, hFecha, liquidaciones, (err, data) => {
        if (err) return done(err);
        var correos = data;
        enviarCorreos(correos, test,(err, msg) => {
            done(null, msg);
        });
    })
}


var enviarCorreos = (correos, test, done) => {
    var resEnvio = "Resultados del envío: <br/>";
    var numReg = 0;
    var totalReg = correos.length;
    async.forEachSeries(correos,
        (c, done1) => {
            correoAPI.sendCorreo(c, test, null, false, (err) => {
                ioAPI.sendProgress("Enviado correos... ", ++numReg, totalReg);
                resEnvio += c.liquidaciones[0].nombre + "(" + c.liquidaciones[0].emailConfi + ") // ";
                if (err) {
                    resEnvio += "ERROR: " + err.message + "<br/>";
                    done1();
                } else {
                    resEnvio += "CORRECTO " + "<br/>";
                    /* actualizaFacturaComoEnviadaPorCorreo(c, (err) => {
                        if (err) return done1(err);
                        done1();
                    }); */
                    done1();
                }
            });
        
        },
        (err) => {
            done(null, resEnvio);
        });
}



var crearPdfsLiquidacion = function (dFecha, hFecha, tipoComercialId, callback) {
    //buscamos las ids de todos los comerciles seleccionados
    Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
    Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
    var con = getConnection();
    var file = "";
    var file2 = "";
    var file3 = "";
    var liquidaciones = [];

    var sql = "SELECT comercialId, nombre, emailConfi FROM comerciales WHERE sel = 1";
    con.query(sql, function(err, result) {
        con.end();
        if(err) return callback(err);
        var numReg = 0;
        var totalReg = result.length;
        ioAPI.sendProgress("Procesando pdfs...", numReg, totalReg);
        async.eachSeries(result, function (comercial, done) {
            ioAPI.sendProgress("Procesando pdfs...", ++numReg, totalReg);
            crearReport(dFecha, hFecha, 0, tipoComercialId, comercial.comercialId, 6, function(err, obj) {
                if(err) return callback(err);
                crearReportResumen(dFecha, hFecha, 0, tipoComercialId, comercial.comercialId, 6, function(err, obj2) {
                    if(err) return callback(err);
                    crearReportObras(dFecha, hFecha, tipoComercialId, comercial.comercialId, function(err, obj3) {
                        if(err) return callback(err);
                        if(tipoComercialId != 1) {
                            file = process.env.REPORTS_DIR + "\\" + "liquidacion_colaborador.mrt"; 
                            file2 =  process.env.REPORTS_DIR + "\\" + "liquidacion_colaborador_resumen.mrt"; 
                            file3 =  process.env.REPORTS_DIR + "\\" + "liquidacion_colaborador_obras.mrt"; 
                        } else {
                            file = process.env.REPORTS_DIR + "\\" +"liquidacion_agente.mrt";
                            file2 = process.env.REPORTS_DIR + "\\" +"liquidacion_agente_resumen.mrt";
                            file3 = process.env.REPORTS_DIR + "\\" +"liquidacion_agente_obras.mrt";
                        }
                    
                        var report = new Stimulsoft.Report.StiReport();
                       
                            
                            
                        report.loadFile(file);
                    
                        var dataSet = new Stimulsoft.System.Data.DataSet("liq_col");
                        dataSet.readJson(obj);
                        
                         // Remove all connections from the report template
                         report.dictionary.databases.clear();
                    
                         //
                        report.regData(dataSet.dataSetName, "", dataSet);
                        report.dictionary.synchronize();
                    
                        report.renderAsync(function () {
                            // Creating export settings
                            var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                            // Creating export service
                            var service = new Stimulsoft.Report.Export.StiPdfExportService();
                            // Creating MemoryStream
                            var stream = new Stimulsoft.System.IO.MemoryStream();
                            service.exportTo(report, stream, settings);
        
                            var data = stream.toArray();
        
                            var buffer = new Buffer.from(data, "utf-8");
        
                        
                            fs.writeFileSync(process.env.LIQUIDACION_DIR + "\\" + comercial.nombre + "_" + dFecha + "-" + hFecha + ".pdf", buffer);
                            comercial.pdf = process.env.LIQUIDACION_DIR + "\\" +  comercial.nombre + "_" + dFecha + "-" + hFecha + ".pdf";
                            if(obj.liqAgente.length == 0) {
                                comercial.tieneDepartaemntos = false;
                            } else {
                                comercial.tieneDepartaemntos = true;
                            }
                            comercial.nomfich =  comercial.nombre + "_liquidacion".toString();
                                    
                            //pdf resumen
        
                            var report2 = new Stimulsoft.Report.StiReport();
                           
                                
                                
                            report2.loadFile(file2);
                        
                            var dataSet2 = new Stimulsoft.System.Data.DataSet("liq_col2");
                            dataSet2.readJson(obj2);
                            
                             // Remove all connections from the report template
                             report2.dictionary.databases.clear();
                        
                             //
                            report2.regData(dataSet2.dataSetName, "", dataSet2);
                            report2.dictionary.synchronize();
                        
                            report2.renderAsync(function () {
                                // Creating export settings
                                var settings2 = new Stimulsoft.Report.Export.StiPdfExportSettings();
                                // Creating export service
                                var service2 = new Stimulsoft.Report.Export.StiPdfExportService();
                                // Creating MemoryStream
                                var stream2 = new Stimulsoft.System.IO.MemoryStream();
                                service2.exportTo(report2, stream2, settings2);
            
                                var data2 = stream2.toArray();
            
                                var buffer2 = new Buffer(data2, "utf-8");
            
                            
                                fs.writeFileSync(process.env.LIQUIDACION_DIR + "\\" + comercial.nombre + "_resumen" + dFecha + "-" + hFecha + ".pdf", buffer2);
                                comercial.pdfResumen = process.env.LIQUIDACION_DIR + "\\" +  comercial.nombre + "_resumen" + dFecha + "-" + hFecha + ".pdf";
                                comercial.nomfichResumen =  comercial.nombre+"liquidacion_resumen".toString();
                            
                                
                                //pdf obras
        
                            var report3 = new Stimulsoft.Report.StiReport();
                           
                                
                                
                            report3.loadFile(file3);
                        
                            var dataSet3 = new Stimulsoft.System.Data.DataSet("liq_col3");
                            dataSet3.readJson(obj3);
                            
                             // Remove all connections from the report template
                             report3.dictionary.databases.clear();
                        
                             //
                            report3.regData(dataSet3.dataSetName, "", dataSet3);
                            report3.dictionary.synchronize();
                        
                            report3.renderAsync(function () {
                                // Creating export settings
                                var settings3 = new Stimulsoft.Report.Export.StiPdfExportSettings();
                                // Creating export service
                                var service3 = new Stimulsoft.Report.Export.StiPdfExportService();
                                // Creating MemoryStream
                                var stream3 = new Stimulsoft.System.IO.MemoryStream();
                                service3.exportTo(report3, stream3, settings3);
            
                                var data3 = stream3.toArray();
            
                                var buffer3 = new Buffer(data3, "utf-8");
            
                            
                                fs.writeFileSync(process.env.LIQUIDACION_DIR + "\\" + comercial.nombre + "_obras" + dFecha + "-" + hFecha + ".pdf", buffer3);
                                comercial.pdfObras = process.env.LIQUIDACION_DIR + "\\" +  comercial.nombre + "_obras" + dFecha + "-" + hFecha + ".pdf";
                                comercial.nomfichObras =  comercial.nombre+"liquidacion_obras".toString();
                                if(obj3.liqAgente.length == 0){
                                    comercial.tieneObras = false;
                                } else {
                                    comercial.tieneObras = true;
                                }
                                liquidaciones.push(comercial);
                                done(null);
                               
                            });
                               
                        });
                        
        
                    });
                            
                });
            });
                
        });
    }, function (err) {
            if (err) return callback(err);
            callback(null, liquidaciones);
        });
    });
}




// crearCorreosAEnviar
var crearCorreosAEnviar = (dFecha, hFecha, liquidaciones, done) => {
   
    var asuntoCorreo = "";
    var c0 = "";
    var c1 = "";
    var correo = {};
    var correos = [];
    liquidaciones.forEach((liquidacion) => {
        //ioAPI.sendProgress("Procesando correos...", ++numReg, totalReg);
            // nuevo cliente, un correo por cliente
            liquidacion.asuntoCorreo = "Envio de liquidaciones del periodo " + dFecha +"-" + hFecha;
            
            asuntoCorreo = liquidacion.asuntoCorreo;
            correo = {
                nombreEmpresa: "Comercializa",
                emisor: "agentes@comercializa.info",
                destinatario: liquidacion.emailConfi,
                asunto: asuntoCorreo,
                ficheros: [],
                liquidaciones: []
            }
            //c0 = liquidacion.nombreCliente;
        c1 = " LIQUIDACIÓN: " + liquidacion.nombre + "<br/>";
        c1 += " Buenos días <br/>";
        c1 += " Adjuntamos listado de ventas en el periodo indicado, si son conformes con los datos, agradeceríamos nos remitieran, a este mismo correo, la correspondiente Factura tomando como base el importe liquidable, y a nombre de: <br/> ";
        c1 += " Fondogar S.L. </br>";
        c1 += " Cif: B81002057 </br>";
        c1 += " dirección. C/ Ramon y Cajal 37, 28470  Cercedilla Madrid. <br/>";
        c1 += " Saludos";
        correo.cuerpo = c1
        
        if(!liquidacion.tieneDepartaemntos) {
            fs.unlinkSync(liquidacion.pdf)
        } else {
            correo.ficheros.push(liquidacion.pdf);
        }
       
        correo.ficheros.push(liquidacion.pdfResumen);

        if(!liquidacion.tieneObras) {
            fs.unlinkSync(liquidacion.pdfObras)
        } else{
           
            correo.ficheros.push(liquidacion.pdfObras)
        }
        correo.liquidaciones.push(liquidacion);
        correos.push(correo);
    }); 
    done(null, correos);
}




